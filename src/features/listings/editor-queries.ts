import 'server-only';

import { cache } from 'react';

import type { ListingCondition, ListingStatus } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/server';

const IMAGE_BUCKET = 'listing-images';
const SIGNED_IMAGE_TTL_SECONDS = 60 * 60;
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22 viewBox=%220 0 800 600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%23f5f5f4%22/%3E%3Cpath d=%22M270 390l82-92 63 66 48-48 70 74H270z%22 fill=%22%23d6d3d1%22/%3E%3Ccircle cx=%22472%22 cy=%22232%22 r=%2232%22 fill=%22%23d6d3d1%22/%3E%3C/svg%3E';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type ListingEditorCategory = {
  id: number;
  slug: string;
  name: string;
  icon: string;
};

export type ListingEditorOptions = {
  categories: ListingEditorCategory[];
};

export type OwnedListingForEdit = {
  id: string;
  title: string;
  description: string;
  priceCents: number | null;
  categoryId: number | null;
  condition: ListingCondition | null;
  openToOffers: boolean;
  pickupArea: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  status: 'draft' | 'published';
  images: Array<{
    id: string;
    url: string;
    path: string;
    progress: number;
    status: 'uploaded' | 'failed';
    name: string;
  }>;
};

export type ManagedListing = {
  id: string;
  title: string;
  priceCents: number | null;
  status: Extract<ListingStatus, 'draft' | 'published' | 'sold' | 'archived'>;
  updatedAt: string;
  publishedAt: string | null;
  coverUrl: string | null;
  category: ListingEditorCategory | null;
};

export class ListingEditorDataError extends Error {
  constructor(message = 'We could not load your listing workspace right now.') {
    super(message);
    this.name = 'ListingEditorDataError';
  }
}

export const getListingEditorOptions = cache(async (): Promise<ListingEditorOptions> => {
  const supabase = await createClient();
  const categoriesResult = await supabase
    .from('categories')
    .select('id,slug,name,icon')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (categoriesResult.error) {
    throw new ListingEditorDataError();
  }

  return {
    categories: categoriesResult.data ?? [],
  };
});

export async function getOwnedListingForEdit(
  listingId: string,
  sellerId: string,
): Promise<OwnedListingForEdit | null> {
  const supabase = await createClient();
  const { data: listing, error } = await supabase
    .from('listings')
    .select(
      'id,title,description,price_cents,category_id,condition,open_to_offers,pickup_area,pickup_latitude,pickup_longitude,status',
    )
    .eq('id', listingId)
    .eq('seller_id', sellerId)
    .in('status', ['draft', 'published'])
    .maybeSingle();

  if (error) {
    throw new ListingEditorDataError('We could not load this listing for editing.');
  }

  if (!listing) return null;

  const { data: imageRows, error: imageError } = await supabase
    .from('listing_images')
    .select('id,storage_path,position,upload_status')
    .eq('listing_id', listingId)
    .order('position', { ascending: true });

  if (imageError) {
    throw new ListingEditorDataError('We could not load the images for this listing.');
  }

  const rows = imageRows ?? [];
  const signedUrls = await signImagePaths(
    supabase,
    rows.filter((image) => image.upload_status === 'uploaded').map((image) => image.storage_path),
  );

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    priceCents: listing.price_cents,
    categoryId: listing.category_id,
    condition: listing.condition,
    openToOffers: listing.open_to_offers,
    pickupArea: listing.pickup_area,
    pickupLatitude: listing.pickup_latitude,
    pickupLongitude: listing.pickup_longitude,
    status: listing.status as 'draft' | 'published',
    images: rows.map((image, index) => ({
      id: image.id,
      path: image.storage_path,
      url: signedUrls.get(image.storage_path) ?? FALLBACK_IMAGE,
      progress: 100,
      status: image.upload_status === 'uploaded' ? ('uploaded' as const) : ('failed' as const),
      name: `Photo ${index + 1}`,
    })),
  };
}

export async function getManagedListings(sellerId: string): Promise<ManagedListing[]> {
  const supabase = await createClient();
  const { data: listingRows, error } = await supabase
    .from('listings')
    .select('id,title,price_cents,category_id,status,updated_at,published_at')
    .eq('seller_id', sellerId)
    .in('status', ['draft', 'published', 'sold', 'archived'])
    .order('updated_at', { ascending: false });

  if (error) throw new ListingEditorDataError('We could not load your listings.');

  const rows = listingRows ?? [];
  if (rows.length === 0) return [];

  const listingIds = rows.map((listing) => listing.id);
  const [categoriesResult, imagesResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id,slug,name,icon')
      .order('sort_order', { ascending: true }),
    supabase
      .from('listing_images')
      .select('listing_id,storage_path,position')
      .in('listing_id', listingIds)
      .eq('upload_status', 'uploaded')
      .order('position', { ascending: true }),
  ]);

  if (categoriesResult.error || imagesResult.error) {
    throw new ListingEditorDataError('We could not finish loading your listings.');
  }

  const categoryMap = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category]),
  );
  const coverPathByListing = new Map<string, string>();

  for (const image of imagesResult.data ?? []) {
    if (!coverPathByListing.has(image.listing_id)) {
      coverPathByListing.set(image.listing_id, image.storage_path);
    }
  }

  const signedUrls = await signImagePaths(supabase, [...coverPathByListing.values()]);

  return rows.map((listing) => {
    const coverPath = coverPathByListing.get(listing.id);

    return {
      id: listing.id,
      title: listing.title,
      priceCents: listing.price_cents,
      status: listing.status as ManagedListing['status'],
      updatedAt: listing.updated_at,
      publishedAt: listing.published_at,
      coverUrl: coverPath ? (signedUrls.get(coverPath) ?? null) : null,
      category: listing.category_id ? (categoryMap.get(listing.category_id) ?? null) : null,
    };
  });
}

async function signImagePaths(
  supabase: SupabaseServerClient,
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();

  const uniquePaths = [...new Set(paths)];
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrls(uniquePaths, SIGNED_IMAGE_TTL_SECONDS);

  if (error || !data) return new Map();

  const signedUrls = new Map<string, string>();
  data.forEach((item, index) => {
    if (item.signedUrl) {
      signedUrls.set(item.path ?? uniquePaths[index], item.signedUrl);
    }
  });

  return signedUrls;
}

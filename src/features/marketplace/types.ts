export type MarketplaceCategory = {
  id: number;
  slug: string;
  label: string;
  icon: string | null;
};

export type MarketplaceSeller = {
  id: string;
  fullName: string;
  program: string | null;
  academicYear: string | null;
  joinedAt: string;
};

export type MarketplaceImage = {
  id: string;
  storagePath: string;
  position: number;
  url: string | null;
};

export type MarketplaceListing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  priceCents: number;
  condition: string | null;
  openToOffers: boolean;
  pickupArea: string | null;
  featuredAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  category: MarketplaceCategory | null;
  seller: MarketplaceSeller | null;
  images: MarketplaceImage[];
};

export type MarketplaceViewer = {
  id: string;
  role: 'student' | 'moderator' | null;
};

export type MarketplacePageData = {
  categories: MarketplaceCategory[];
  featured: MarketplaceListing[];
  listings: MarketplaceListing[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  query: string;
  category: string | null;
};

export type MarketplaceFilters = {
  query?: string;
  category?: string;
  page?: number;
};

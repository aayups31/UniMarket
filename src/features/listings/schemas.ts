import { z } from 'zod';

export const LISTING_TITLE_MAX = 100;
export const LISTING_DESCRIPTION_MAX = 5000;
export const LISTING_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const LISTING_IMAGE_MAX_COUNT = 6;

export const listingConditionSchema = z.enum(['new', 'like_new', 'good', 'fair', 'well_used']);

const listingDraftBaseSchema = z.object({
  listingId: z.uuid().nullable().optional(),
  title: z.string().trim().max(LISTING_TITLE_MAX),
  description: z.string().trim().max(LISTING_DESCRIPTION_MAX),
  priceCents: z.number().int().min(0).max(100_000_000).nullable(),
  categoryId: z.number().int().positive().nullable(),
  condition: listingConditionSchema.nullable(),
  openToOffers: z.boolean(),
  pickupArea: z.string().trim().max(120),
  pickupLatitude: z.number().min(-90).max(90).nullable(),
  pickupLongitude: z.number().min(-180).max(180).nullable(),
});

export const listingDraftSchema = listingDraftBaseSchema.superRefine((listing, context) => {
  if ((listing.pickupLatitude === null) !== (listing.pickupLongitude === null)) {
    context.addIssue({
      code: 'custom',
      message: 'Pickup coordinates must be provided as a complete pair.',
      path: ['pickupLatitude'],
    });
  }
});

export const listingPublishSchema = listingDraftBaseSchema.extend({
  listingId: z.uuid(),
  title: z
    .string()
    .trim()
    .min(3, 'Give your listing a clear, descriptive title.')
    .max(LISTING_TITLE_MAX),
  description: z
    .string()
    .trim()
    .min(20, 'Add a little more detail so buyers know exactly what to expect.')
    .max(LISTING_DESCRIPTION_MAX),
  priceCents: z
    .number({ error: 'Choose a price in Canadian dollars.' })
    .int()
    .min(0)
    .max(100_000_000),
  categoryId: z.number({ error: 'Choose the category that fits best.' }).int().positive(),
  condition: listingConditionSchema,
  pickupArea: z.string().trim().min(5, 'Add the exact pickup address.').max(120),
});

export const imageRegistrationSchema = z.object({
  listingId: z.uuid(),
  name: z.string().trim().min(1).max(255),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  sizeBytes: z.number().int().positive().max(LISTING_IMAGE_MAX_BYTES),
  width: z.number().int().positive().max(20_000),
  height: z.number().int().positive().max(20_000),
});

export const listingIdSchema = z.uuid();

export const moderationRemovalSchema = z.object({
  listingId: listingIdSchema,
  reason: z.string().trim().min(10).max(500),
});

export type ListingDraftInput = z.infer<typeof listingDraftSchema>;
export type ListingPublishInput = z.infer<typeof listingPublishSchema>;
export type ListingCondition = z.infer<typeof listingConditionSchema>;

export function dollarsToCents(value: string): number | null {
  const normalized = value.trim().replace(/[$,\s]/g, '');
  if (!normalized) return null;
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}

export function centsToDollars(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return (value / 100).toFixed(value % 100 === 0 ? 0 : 2);
}

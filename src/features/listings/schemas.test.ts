import { describe, expect, it } from 'vitest';
import {
  dollarsToCents,
  imageRegistrationSchema,
  LISTING_IMAGE_MAX_BYTES,
  LISTING_IMAGE_MAX_COUNT,
  listingDraftSchema,
  listingIdSchema,
  listingPublishSchema,
  moderationRemovalSchema,
} from './schemas';

const validDraft = {
  listingId: 'f8a96f83-93bf-4f5f-ae39-76d23576bc4d',
  title: 'Dell monitor',
  description: 'Works perfectly and includes the stand and HDMI cable.',
  priceCents: 12_000,
  categoryId: 1,
  condition: 'good' as const,
  openToOffers: true,
  pickupArea: '200 University Ave W',
  pickupLatitude: 43.471468,
  pickupLongitude: -80.544205,
};

describe('listing schemas', () => {
  it('allows incomplete private drafts', () => {
    expect(
      listingDraftSchema.safeParse({
        ...validDraft,
        title: '',
        description: '',
        priceCents: null,
        categoryId: null,
        condition: null,
        pickupArea: '',
        pickupLatitude: null,
        pickupLongitude: null,
      }).success,
    ).toBe(true);
  });

  it('requires complete publish data', () => {
    expect(listingPublishSchema.safeParse(validDraft).success).toBe(true);
    expect(listingPublishSchema.safeParse({ ...validDraft, title: '' }).success).toBe(false);
    expect(
      listingPublishSchema.safeParse({
        ...validDraft,
        pickupLatitude: null,
        pickupLongitude: null,
      }).success,
    ).toBe(true);
  });

  it('allows an unpinned draft but rejects a partial coordinate pair', () => {
    expect(
      listingDraftSchema.safeParse({
        ...validDraft,
        pickupLatitude: null,
        pickupLongitude: null,
      }).success,
    ).toBe(true);
    expect(listingDraftSchema.safeParse({ ...validDraft, pickupLongitude: null }).success).toBe(
      false,
    );
  });

  it('validates destructive and moderation action inputs', () => {
    expect(listingIdSchema.safeParse(validDraft.listingId).success).toBe(true);
    expect(listingIdSchema.safeParse('not-a-listing-id').success).toBe(false);
    expect(
      moderationRemovalSchema.safeParse({
        listingId: validDraft.listingId,
        reason: 'Duplicate scam listing.',
      }).success,
    ).toBe(true);
    expect(
      moderationRemovalSchema.safeParse({ listingId: validDraft.listingId, reason: 'Too short' })
        .success,
    ).toBe(false);
  });

  it('enforces the six-image, 5 MiB upload contract', () => {
    expect(LISTING_IMAGE_MAX_COUNT).toBe(6);
    expect(LISTING_IMAGE_MAX_BYTES).toBe(5 * 1024 * 1024);

    const registration = {
      listingId: validDraft.listingId,
      name: 'monitor.jpg',
      mimeType: 'image/jpeg' as const,
      sizeBytes: LISTING_IMAGE_MAX_BYTES,
      width: 1600,
      height: 1200,
    };

    expect(imageRegistrationSchema.safeParse(registration).success).toBe(true);
    expect(
      imageRegistrationSchema.safeParse({
        ...registration,
        sizeBytes: LISTING_IMAGE_MAX_BYTES + 1,
      }).success,
    ).toBe(false);
  });
});

describe('dollarsToCents', () => {
  it.each([
    ['120', 12_000],
    ['$12.50', 1_250],
    ['1,200.05', 120_005],
    ['', null],
    ['12.999', null],
  ])('converts %s safely', (input, expected) => {
    expect(dollarsToCents(input)).toBe(expected);
  });
});

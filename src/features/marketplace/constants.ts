export const LISTING_IMAGE_BUCKET = 'listing-images';
export const MARKETPLACE_PAGE_SIZE = 12;
export const FEATURED_LISTING_LIMIT = 4;

export const CATEGORY_PRESENTATION: Record<string, { description: string }> = {
  electronics: {
    description: 'Tech for class and co-op',
  },
  books: {
    description: 'Textbooks and course reads',
  },
  household: {
    description: 'Essentials for your student place',
  },
  'household-items': {
    description: 'Essentials for your student place',
  },
  clothing: {
    description: 'Clothing, shoes, and accessories',
  },
};

export const CONDITION_LABELS: Record<string, string> = {
  new: 'New',
  like_new: 'Like new',
  good: 'Good',
  fair: 'Fair',
  well_used: 'Well used',
};

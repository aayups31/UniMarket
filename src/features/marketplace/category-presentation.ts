export type MarketplaceCategoryPresentation = {
  image: string;
  imagePosition: string;
  accent: string;
};

const DEFAULT_PRESENTATION: MarketplaceCategoryPresentation = {
  image: '/waterloo/campus-aerial-restored.webp',
  imagePosition: 'object-[50%_52%]',
  accent: 'from-um-gold-300/18',
};

const CATEGORY_PRESENTATION: Record<string, MarketplaceCategoryPresentation> = {
  electronics: {
    image: '/waterloo/category-electronics-still-life-v2.webp',
    imagePosition: 'object-[62%_54%]',
    accent: 'from-sky-300/12',
  },
  books: {
    image: '/waterloo/category-books-still-life-v2.webp',
    imagePosition: 'object-[56%_57%]',
    accent: 'from-amber-300/14',
  },
  household: {
    image: '/waterloo/category-household-still-life-v2.webp',
    imagePosition: 'object-[61%_52%]',
    accent: 'from-orange-200/12',
  },
  'household-items': {
    image: '/waterloo/category-household-still-life-v2.webp',
    imagePosition: 'object-[61%_52%]',
    accent: 'from-orange-200/12',
  },
  clothing: {
    image: '/waterloo/category-clothing-still-life-v2.webp',
    imagePosition: 'object-[54%_50%]',
    accent: 'from-violet-200/10',
  },
};

export function getMarketplaceCategoryPresentation(slug: string | null | undefined) {
  return (slug && CATEGORY_PRESENTATION[slug]) || DEFAULT_PRESENTATION;
}

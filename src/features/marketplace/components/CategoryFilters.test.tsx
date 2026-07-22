import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CategoryFilters } from './CategoryFilters';

afterEach(cleanup);

const categories = [
  { id: 1, slug: 'electronics', label: 'Electronics', icon: 'laptop' },
  { id: 2, slug: 'books', label: 'Books', icon: 'book-open' },
];

describe('CategoryFilters', () => {
  it('preserves a search query when switching categories', () => {
    render(<CategoryFilters activeCategory="books" categories={categories} query="desk lamp" />);

    expect(screen.getByRole('link', { name: 'Electronics' })).toHaveAttribute(
      'href',
      '/marketplace/categories/electronics?q=desk+lamp',
    );
    expect(screen.getByRole('link', { name: 'Books' })).toHaveAttribute('aria-current', 'page');
  });

  it('clears the category without clearing the search', () => {
    render(<CategoryFilters activeCategory="books" categories={categories} query="calculus" />);

    expect(screen.getByRole('link', { name: 'All listings' })).toHaveAttribute(
      'href',
      '/marketplace?q=calculus',
    );
  });
});

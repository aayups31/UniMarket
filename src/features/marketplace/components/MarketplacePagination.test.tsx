import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MarketplacePagination } from './MarketplacePagination';

afterEach(cleanup);

describe('MarketplacePagination', () => {
  it('keeps independent category pagination inside its route', () => {
    render(
      <MarketplacePagination
        category="books"
        page={2}
        query="calculus"
        scopePath="/marketplace/categories/books"
        totalPages={3}
      />,
    );

    expect(screen.getByRole('link', { name: 'Previous marketplace page' })).toHaveAttribute(
      'href',
      '/marketplace/categories/books?q=calculus',
    );
    expect(screen.getByRole('link', { name: 'Next marketplace page' })).toHaveAttribute(
      'href',
      '/marketplace/categories/books?q=calculus&page=3',
    );
  });
});

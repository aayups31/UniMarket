import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MarketplaceSearch } from './MarketplaceSearch';

afterEach(cleanup);

describe('MarketplaceSearch', () => {
  it('submits a progressively enhanced GET search while preserving the category', () => {
    const { container } = render(<MarketplaceSearch category="books" query="calculus" />);

    const search = screen.getByRole('search');
    expect(search).toHaveAttribute('action', '/marketplace');
    expect(search).toHaveAttribute('method', 'get');
    expect(screen.getByLabelText(/search listings by title/i)).toHaveValue('calculus');
    expect(screen.getByRole('button', { name: 'Search listings' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(container.querySelector('input[name="category"]')).toHaveValue('books');
  });

  it('clears only the query and keeps the active category', () => {
    render(<MarketplaceSearch category="electronics" query="monitor" />);

    expect(screen.getByRole('link', { name: 'Clear search' })).toHaveAttribute(
      'href',
      '/marketplace?category=electronics',
    );
  });

  it('does not render a redundant clear action for an empty query', () => {
    render(<MarketplaceSearch category={null} query="" />);

    expect(screen.queryByRole('link', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('keeps search and clear actions inside an independent category route', () => {
    const { container } = render(
      <MarketplaceSearch
        category={null}
        query="calculus"
        scopePath="/marketplace/categories/books"
      />,
    );

    expect(screen.getByRole('search')).toHaveAttribute('action', '/marketplace/categories/books');
    expect(screen.getByRole('link', { name: 'Clear search' })).toHaveAttribute(
      'href',
      '/marketplace/categories/books',
    );
    expect(container.querySelector('input[name="category"]')).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProfileAvatar } from './ProfileAvatar';

describe('ProfileAvatar', () => {
  it('uses initials when no photo is configured', () => {
    render(<ProfileAvatar avatarUrl={null} initials="AP" name="Aayu Singh" />);

    expect(screen.getByText('AP')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a configured photo and falls back to initials when it fails', () => {
    const { container } = render(
      <ProfileAvatar
        avatarUrl="https://images.example.com/aayu.webp"
        initials="AP"
        name="Aayu Singh"
      />,
    );

    const image = screen.getByRole('img', { name: "Aayu Singh's profile" });
    expect(image).toHaveAttribute('referrerpolicy', 'no-referrer');

    fireEvent.error(image);
    expect(container).toHaveTextContent('AP');
  });
});

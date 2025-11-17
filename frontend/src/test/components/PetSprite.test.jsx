import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PetSprite from '../../components/PetSprite';

describe('PetSprite', () => {
  test('renders img with correct src for known type (Dog)', () => {
    render(<PetSprite type="Dog" />);

    const img = screen.getByRole('img', { name: /dog sprite/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/pets/dog.png');
  });

  test('falls back to emoji for unknown type', () => {
    render(<PetSprite type="Unicorn" />);

    const emojiContainer = screen.getByRole('img', { name: /unicorn sprite/i });
    // default fallback glyph is 🐾 when type is unknown
    expect(emojiContainer).toHaveTextContent('🐾');
  });

  test('switches to emoji when image load fails', () => {
    render(<PetSprite type="Dog" />);

    const img = screen.getByRole('img', { name: /dog sprite/i });

    // Trigger the onError handler
    fireEvent.error(img);

    const emojiContainer = screen.getByRole('img', { name: /dog sprite/i });
    // For known type "dog", fallback emoji is 🐶
    expect(emojiContainer).toHaveTextContent('🐶');
  });
});

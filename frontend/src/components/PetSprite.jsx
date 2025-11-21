// src/components/PetSprite.jsx

import { useMemo, useState } from 'react';

// Mapping from pet type → sprite asset path.
// Keys are lowercase; component normalizes incoming type string.
const SRC_BY_TYPE = {
  dog: '/pets/dog.png',
  cat: '/pets/cat.png',
  dragon: '/pets/dragon.png',
};

// Emoji used if the type sprite is missing or fails to load.
const EMOJI_FALLBACK = {
  dog: '🐶',
  cat: '🐱',
  dragon: '🐲',
};

/**
 * PetSprite
 *
 * Renders a pixel-style sprite for a given pet type.
 * - Uses a PNG sprite when available.
 * - Falls back to an emoji glyph if the image is missing or fails to load.
 *
 * Props:
 * - type      (string): logical type, e.g. "Dog", "Cat", "Dragon" (case-insensitive)
 * - size      (number): rendered width/height in px (default 120)
 * - title     (string): accessible label/title; falls back to "<type> sprite"
 * - className (string): extra CSS classes to merge with base sprite classes
 */
export default function PetSprite({ type = 'Dog', size = 120, title, className = '' }) {
  const [showEmoji, setShowEmoji] = useState(false);

  // Normalize type to match our sprite/emoji maps.
  const kind = useMemo(() => String(type || '').toLowerCase(), [type]);
  const alt = title || `${type} sprite`;
  const src = SRC_BY_TYPE[kind];

  // If we have no sprite path, or the <img> failed to load, render the emoji fallback.
  if (!src || showEmoji) {
    const glyph = EMOJI_FALLBACK[kind] || '🐾';

    return (
      <div
        role="img"
        aria-label={alt}
        title={alt}
        className={`pet-sprite pet-anim--idle pet-anim--hover ${className}`.trim()}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: Math.round(size * 0.7), lineHeight: 1 }}>
          {glyph}
        </span>
      </div>
    );
  }

  // Default: use the sprite image.
  return (
    <img
      src={src}
      alt={alt}
      title={alt}
      width={size}
      height={size}
      decoding="async"
      loading="lazy"
      draggable="false"
      className={`pet-sprite pet-anim--idle pet-anim--hover ${className}`.trim()}
      onError={() => setShowEmoji(true)}
    />
  );
}

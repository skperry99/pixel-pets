// frontend/src/components/PetSprite.jsx
import { useMemo, useState } from 'react';

const SRC_BY_TYPE = {
  Dog: '/pets/dog.png',
  Cat: '/pets/cat.png',
  Dragon: '/pets/dragon.png',
};

// Emoji used if the type sprite is missing or fails to load
const EMOJI_FALLBACK = {
  dog: '🐶',
  cat: '🐱',
  dragon: '🐲',
};

export default function PetSprite({
  type = 'Dog',
  size = 120, // numeric px size (width/height attributes)
  title, // label for alt; falls back to type
  className = '', // extra classes if needed
}) {
  const [showEmoji, setShowEmoji] = useState(false);

  const kind = useMemo(() => String(type || '').toLowerCase(), [type]);
  const alt = title || `${type} sprite`;
  const src = SRC_BY_TYPE[type];

  // If no image path exists for this type OR we already failed -> show emoji
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

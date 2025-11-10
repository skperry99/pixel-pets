const SRC_BY_TYPE = {
  Dog: "/pets/dog.png",
  Cat: "/pets/cat.png",
  Dragon: "/pets/dragon.png",
};

const FALLBACK_SRC = "/pets/dog.png";

/**
 * Pixel pet sprite image.
 * - Uses retro theme classes (no inline styles)
 * - Width/height via attributes to keep pixels crisp
 * - Graceful fallback if the sprite is missing
 */
export default function PetSprite({
  type = "Dog",
  size = 120, // numeric px size (width/height attributes)
  title, // label for alt; falls back to type
  className = "", // extra classes if needed
}) {
  const src = SRC_BY_TYPE[type] || FALLBACK_SRC;
  const alt = title || `${type} sprite`;

  function handleError(e) {
    if (e.currentTarget.src.endsWith(FALLBACK_SRC)) return;
    e.currentTarget.src = FALLBACK_SRC;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      decoding="async"
      loading="lazy"
      draggable="false"
      className={`pet-sprite ${className}`.trim()}
      onError={handleError}
    />
  );
}

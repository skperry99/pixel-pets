// src/components/PetSprite.jsx
const srcByType = {
  Dog: "/pets/dog.png",
  Cat: "/pets/cat.png",
  Dragon: "/pets/dragon.png",
};

export default function PetSprite({ type, size = 120, title }) {
  const src = srcByType[type] || "/pets/dog.png";
  return (
    <img
      src={src}
      alt={title || type}
      width={size}
      height={size}
      style={{
        imageRendering: "pixelated",
        width: size,
        height: size,
        border: "3px solid var(--border-color)",
        backgroundColor: "#111",
        boxShadow: "3px 3px 0 #000",
      }}
      className="pet-sprite"
    />
  );
}
import { useMemo, useState } from "react";
import { createPet } from "../api";

export default function AdoptForm({
  userId,                 // required (number)
  onAdopt,                // required: (savedPet) => void
  petTypes,               // optional: ["Cat","Dog","Dragon"]; if omitted, we'll fall back to a default
  className = "",
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // If you later add /api/pets/types, you can fetch here. For now, use prop or default:
  const options = useMemo(() => petTypes?.length ? petTypes : ["Cat", "Dog", "Dragon"], [petTypes]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setErr("");

    const trimmed = name.trim();
    if (!trimmed) { setErr("Please enter a pet name."); return; }
    if (!type)     { setErr("Please select a pet type."); return; }
    if (!userId)   { setErr("Missing user ID."); return; }
    if (options.length && !options.includes(type)) { setErr("Invalid pet type."); return; }

    try {
      setBusy(true);
      const saved = await createPet({ name: trimmed, type, userId: Number(userId) });
      onAdopt?.(saved);         // hand result back to parent
      setName("");
      setType("");
    } catch (e) {
      setErr(e.message || "Adoption failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`panel ${className}`} style={{ maxWidth: 720 }}>
      <h2>Adopt a new pet</h2>

      <input
        placeholder="Pet name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <option value="">Select a pet type</option>
        {options.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      {err && (
        <div style={{ color: "var(--danger-color)", margin: "0.5rem 0", textShadow: "1px 1px #000" }}>
          {err}
        </div>
      )}

      <button disabled={busy}>{busy ? "Adopting..." : "Adopt 🐾"}</button>
    </form>
  );
}

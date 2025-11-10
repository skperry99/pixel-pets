import { useMemo, useRef, useState } from "react";
import { createPet } from "../api";

export default function AdoptForm({
  userId, // required (number)
  onAdopt, // required: (savedPet) => void
  petTypes, // optional: ["Cat","Dog","Dragon"]; fallback used if omitted
  className = "",
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const errorRef = useRef(null);

  // Use prop or default list
  const options = useMemo(
    () => (petTypes?.length ? petTypes : ["Cat", "Dog", "Dragon"]),
    [petTypes]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setErr("");

    const trimmed = name.trim();
    if (!trimmed) return setAndFocusError("Please enter a pet name.");
    if (!type) return setAndFocusError("Please select a pet type.");
    if (!userId) return setAndFocusError("Missing user ID.");
    if (options.length && !options.includes(type))
      return setAndFocusError("Invalid pet type.");

    try {
      setBusy(true);
      const saved = await createPet({
        name: trimmed,
        type,
        userId: Number(userId),
      });
      onAdopt?.(saved);
      setName("");
      setType("");
    } catch (e) {
      setAndFocusError(e?.message || "Adoption failed.");
    } finally {
      setBusy(false);
    }
  }

  function setAndFocusError(message) {
    setErr(message);
    // Move screen reader focus to the error
    queueMicrotask(() => errorRef.current?.focus());
  }

  return (
    <section className={`panel ${className}`}>
      <header className="panel__header">
        <h2 className="panel__title">Adopt a New Pet</h2>
      </header>

      <div className="panel__body">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__row">
            <label className="label" htmlFor="adopt-name">
              Pet name
            </label>
            <input
              id="adopt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!!err && !name.trim()}
              aria-describedby={err && !name.trim() ? "adopt-error" : undefined}
              disabled={busy}
              placeholder="Pixel Paws"
            />
          </div>

          <div className="form__row">
            <label className="label" htmlFor="adopt-type">
              Pet type
            </label>
            <select
              id="adopt-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!!err && !type}
              aria-describedby={err && !type ? "adopt-error" : undefined}
              disabled={busy}
            >
              <option value="">Select a pet type</option>
              {options.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {err && (
            <div
              id="adopt-error"
              className="form-error"
              role="alert"
              tabIndex={-1}
              ref={errorRef}
            >
              {err}
            </div>
          )}

          <div className="form__row" style={{ textAlign: "center" }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Adopting..." : "Adopt 🐾"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

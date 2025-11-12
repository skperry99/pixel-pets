import { useMemo, useRef, useState } from 'react';
import { createPet } from '../api';

export default function AdoptForm({
  userId, // required (number)
  onAdopt, // required: (savedPet) => void
  petTypes, // optional: ["Cat","Dog","Dragon"]; fallback used if omitted
  className = '',
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const errorRef = useRef(null);

  // Use prop or default list
  const options = useMemo(
    () => (petTypes?.length ? petTypes : ['Cat', 'Dog', 'Dragon']),
    [petTypes],
  );

  function setAndFocusError(message) {
    setErr(message);
    // Move screen reader focus to the error
    queueMicrotask(() => errorRef.current?.focus());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setErr('');

    const trimmed = name.trim();
    if (!trimmed) return setAndFocusError('Please enter a pet name.');
    if (!type) return setAndFocusError('Please select a pet type.');
    if (!userId) return setAndFocusError('Missing user ID.');
    if (options.length && !options.includes(type)) {
      return setAndFocusError('Invalid pet type.');
    }

    setBusy(true);
    const res = await createPet({
      name: trimmed,
      type,
      userId: Number(userId),
    });

    if (!res.ok) {
      setAndFocusError(res.error || 'Adoption failed.');
      setBusy(false);
      return;
    }

    const saved = res.data;
    onAdopt?.(saved);
    setName('');
    setType('');
    setBusy(false);
  }

  return (
    <section className={`panel ${className}`}>

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
              minLength={2}
              maxLength={50}
              pattern="^[A-Za-z0-9 _'\-]{2,50}$"
              aria-required="true"
              aria-invalid={!!err && !name.trim()}
              aria-describedby={err && !name.trim() ? 'adopt-error' : undefined}
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
              aria-describedby={err && !type ? 'adopt-error' : undefined}
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
              aria-live="assertive"
              tabIndex={-1}
              ref={errorRef}
            >
              {err}
            </div>
          )}

          <div className="form__row" style={{ textAlign: 'center' }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Adopting...' : 'Adopt 🐾'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

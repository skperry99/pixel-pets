// src/components/AdoptForm.jsx

import { useMemo, useRef, useState } from 'react';
import { createPet } from '../api';

/**
 * AdoptForm
 *
 * Small, self-contained form used on the Dashboard:
 * - Lets the current user adopt a new pet by name + type.
 * - Enforces simple client-side validation.
 * - Surfaces errors inline and moves focus to the error message.
 *
 * Props:
 * - userId   (number, required): owning user id
 * - onAdopt  (function, required): callback receiving the saved pet DTO
 * - petTypes (string[], optional): allowed types; defaults to ["Cat", "Dog", "Dragon"]
 * - className (string, optional): extra panel classes
 */
export default function AdoptForm({ userId, onAdopt, petTypes, className = '' }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const errorRef = useRef(null);

  // Use provided petTypes or a default list
  const options = useMemo(
    () => (petTypes?.length ? petTypes : ['Cat', 'Dog', 'Dragon']),
    [petTypes],
  );

  /** Set an error message and shift focus to the alert region for screen readers. */
  function setAndFocusError(message) {
    setErrorMsg(message);
    // Move screen reader focus to the error
    queueMicrotask(() => errorRef.current?.focus());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;

    setErrorMsg('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      return setAndFocusError('Please enter a pet name.');
    }
    if (!type) {
      return setAndFocusError('Please select a pet type.');
    }
    if (!userId) {
      return setAndFocusError('Missing user ID.');
    }
    if (options.length && !options.includes(type)) {
      return setAndFocusError('Invalid pet type.');
    }

    setBusy(true);

    const res = await createPet({
      name: trimmedName,
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

    // Reset form on success
    setName('');
    setType('');
    setBusy(false);
  }

  return (
    <section className={`panel ${className}`}>
      <div className="panel__body">
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Pet name */}
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
              aria-invalid={!!errorMsg && !name.trim()}
              aria-describedby={errorMsg && !name.trim() ? 'adopt-error' : undefined}
              disabled={busy}
              placeholder="Pixel Paws"
            />
          </div>

          {/* Pet type */}
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
              aria-invalid={!!errorMsg && !type}
              aria-describedby={errorMsg && !type ? 'adopt-error' : undefined}
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

          {/* Inline error message (focusable alert region) */}
          {errorMsg && (
            <div
              id="adopt-error"
              className="form-error"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
              ref={errorRef}
            >
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="form__row u-text-center">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Adopting...' : 'Adopt 🐾'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

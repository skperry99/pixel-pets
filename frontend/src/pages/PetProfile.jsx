// src/pages/PetProfile.jsx
// Individual pet profile:
// - Loads a single pet by ID
// - Lets the player feed, play, rest, or delete the pet
// - Shows mood/status, loading state, and API errors via inline + toasts

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { getPetById, feedPet, playWithPet, restPet, deletePet } from '../api';

import AppLayout from '../components/AppLayout';
import PetSprite from '../components/PetSprite';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingCard from '../components/LoadingCard';

import { useNotice } from '../hooks/useNotice';
import { getStoredUserId } from '../utils/auth';
import { burstConfetti } from '../utils/confetti';
import { moodFor } from '../utils/mood';

export default function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load pet on mount / when ID changes
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    let isActive = true;

    (async () => {
      const res = await getPetById(petId);
      if (!isActive) return;

      if (!res.ok) {
        const msg = res.error || 'Failed to load pet.';
        setError(msg);
        notify.error(msg);
        setLoading(false);
        return;
      }

      setPet(res.data || null);
      setLoading(false);
    })();

    return () => {
      isActive = false;
    };
  }, [petId, userId, navigate, notify]);

  /** Merge updated pet fields into local state. */
  function updatePetState(updated) {
    setPet((prev) => ({ ...(prev || {}), ...(updated || {}) }));
  }

  async function handleFeed() {
    if (busy) return;
    setBusy(true);

    const res = await feedPet(petId);
    if (!res.ok) {
      notify.error(res.error || 'Feeding failed.');
    } else {
      notify.success('Nom nom! 🍖');
      updatePetState(res.data);
    }

    setBusy(false);
  }

  async function handlePlay() {
    if (busy) return;
    setBusy(true);

    const res = await playWithPet(petId);
    if (!res.ok) {
      notify.error(res.error || 'Playtime failed.');
    } else {
      notify.success('So much fun! 🎮');
      burstConfetti();
      updatePetState(res.data);
    }

    setBusy(false);
  }

  async function handleRest() {
    if (busy) return;
    setBusy(true);

    const res = await restPet(petId);
    if (!res.ok) {
      notify.error(res.error || 'Rest failed.');
    } else {
      notify.success('Zzz… 😴');
      updatePetState(res.data);
    }

    setBusy(false);
  }

  async function handleDeleteConfirmed() {
    if (busy) return;
    setBusy(true);

    const res = await deletePet(petId);
    if (!res.ok) {
      notify.error(res.error || 'Could not delete pet.');
      setBusy(false);
      return;
    }

    notify.success('Pet released. 🐾');
    navigate('/dashboard');
  }

  if (loading) {
    return (
      <AppLayout headerProps={{ title: 'PET PROFILE' }}>
        <LoadingCard title="Loading your pet…" />
      </AppLayout>
    );
  }

  if (error || !pet) {
    return (
      <AppLayout headerProps={{ title: 'PET PROFILE' }}>
        <section className="panel panel--wide panel--center">
          <header className="panel__header">
            <h2 className="panel__title">Not Found</h2>
          </header>
          <div className="panel__body u-stack-md">
            <p>{error || 'We couldn’t find that pet.'}</p>
            <Link to="/dashboard" className="btn btn--ghost">
              ← Back to Dashboard
            </Link>
          </div>
        </section>
      </AppLayout>
    );
  }

  const { name, type, fullness, happiness, energy } = pet;
  const mood = moodFor(pet);

  return (
    <AppLayout headerProps={{ title: 'PET PROFILE' }}>
      <section className="panel panel--wide panel--center">
        <header className="panel__header">
          <h1 className="panel__title">{name ? `${name} the ${type}` : 'Pet Profile'}</h1>
        </header>

        <div className="panel__body u-stack-lg">
          {/* Mood / status notice */}
          {mood.length > 0 && (
            <div className="notice notice--warn" role="status" aria-live="polite">
              <div className="notice__row">
                <div className="notice__icon" aria-hidden="true">
                  🧪
                </div>
                <div className="notice__body">
                  <strong>Pet Status:</strong> {mood.join(' · ')}
                </div>
              </div>
            </div>
          )}

          {/* Sprite */}
          <div className="u-center">
            <PetSprite
              type={type}
              className="pet-sprite pet-sprite--lg pet-sprite--hover-bounce"
              title={`${name} the ${type}`}
            />
          </div>

          {/* Stats */}
          <div className="u-stack-md">
            {typeof fullness === 'number' && (
              <div className="status-bar status-bar--fullness" aria-label="Fullness">
                <div className="status-fill" style={{ width: `${fullness}%` }} />
                <div className="status-label">{Math.round(fullness)}%</div>
              </div>
            )}

            {typeof happiness === 'number' && (
              <div className="status-bar status-bar--happiness" aria-label="Happiness">
                <div className="status-fill" style={{ width: `${happiness}%` }} />
                <div className="status-label">{Math.round(happiness)}%</div>
              </div>
            )}

            {typeof energy === 'number' && (
              <div className="status-bar status-bar--energy" aria-label="Energy">
                <div className="status-fill" style={{ width: `${energy}%` }} />
                <div className="status-label">{Math.round(energy)}%</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="u-actions-row">
            <button className="btn" onClick={handleFeed} disabled={busy}>
              Feed 🍖
            </button>
            <button className="btn btn--secondary" onClick={handlePlay} disabled={busy}>
              Play 🎮
            </button>
            <button className="btn btn--ghost" onClick={handleRest} disabled={busy}>
              Rest 😴
            </button>
            <button
              className="btn btn--danger"
              onClick={() => setConfirmOpen(true)}
              disabled={busy}
            >
              Delete ❌
            </button>
          </div>

          <ConfirmDialog
            open={confirmOpen}
            title={`Release ${pet?.name ?? 'this pet'}?`}
            message="This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            danger
            onConfirm={() => {
              setConfirmOpen(false);
              handleDeleteConfirmed();
            }}
            onCancel={() => setConfirmOpen(false)}
          />

          {/* Back link */}
          <div className="u-text-center">
            <Link to="/dashboard">
              <button className="btn btn--ghost">← Back to Dashboard</button>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

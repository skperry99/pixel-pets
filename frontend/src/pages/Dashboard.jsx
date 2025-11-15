// src/pages/Dashboard.jsx
// Player dashboard:
// - Loads current user's profile + pets
// - Lets users adopt new pets and navigate to pet profiles
// - Shows inline empty state, loading state, and toast notices

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getPetsByUser, getUserProfile } from '../api';
import AppLayout from '../components/AppLayout';
import PetSprite from '../components/PetSprite';
import AdoptForm from '../components/AdoptForm';
import LoadingCard from '../components/LoadingCard';

import { burstConfetti } from '../utils/confetti';
import { useNotice } from '../hooks/useNotice';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';
import { Brand } from '../utils/brandText';

export default function Dashboard() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId(); // localStorage user id

  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // { id, username, email }
  const [loading, setLoading] = useState(true);

  // Load profile + pets when the page mounts / user changes
  useEffect(() => {
    if (userId == null) {
      navigate('/login');
      return;
    }

    let isActive = true;

    (async () => {
      const [profileRes, petsRes] = await Promise.all([
        getUserProfile(Number(userId)),
        getPetsByUser(userId),
      ]);

      if (!isActive) return;

      // Profile
      if (!profileRes.ok) {
        notify.error(profileRes.error || 'Failed to load profile.');
      } else {
        setUserProfile(profileRes.data || null);
      }

      // Pets
      if (!petsRes.ok) {
        notify.error(petsRes.error || 'Failed to load pets.');
        setPets([]); // always keep an array
      } else {
        const list = Array.isArray(petsRes.data) ? petsRes.data : [];
        setPets(list);
      }

      setLoading(false);
    })();

    return () => {
      isActive = false;
    };
  }, [userId, navigate, notify]);

  function handleLogout() {
    clearStoredUserId();
    navigate('/login');
  }

  if (loading) {
    return (
      <AppLayout headerProps={{ title: 'DASHBOARD' }}>
        <LoadingCard title="Loading your pets…" />
      </AppLayout>
    );
  }

  const petCountText =
    pets.length === 0
      ? 'You do not have any pets yet — adopt your first friend!'
      : `You have ${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}.`;

  return (
    <AppLayout headerProps={{ title: 'DASHBOARD' }}>
      {/* Welcome / Profile panel */}
      <section className="panel panel--full">
        <header className="panel__header">
          <h1 className="panel__title">
            {userProfile ? `Welcome, ${userProfile.username}!` : 'Your Pet Dashboard'}
          </h1>
        </header>

        <div className="panel__body u-stack-md">
          <p>{petCountText}</p>

          <div className="u-stack-sm" style={{ display: 'inline-grid' }}>
            <button className="btn" onClick={() => navigate('/settings')}>
              Edit Profile
            </button>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Adopt panel */}
      <section className="panel panel--full">
        <header className="panel__header">
          <h2 className="panel__title">Adopt a New Friend</h2>
        </header>

        <div className="panel__body">
          <AdoptForm
            userId={userId}
            petTypes={['Cat', 'Dog', 'Dragon']}
            onAdopt={(savedPet) => {
              setPets((prev) => {
                if (prev.length === 0) {
                  // 🎉 celebrate first pet
                  burstConfetti();
                }
                return [...prev, savedPet];
              });
              notify.success(`Adopted ${savedPet.name} the ${savedPet.type}!`);
            }}
          />
        </div>
      </section>

      {/* Pets grid panel */}
      <section className="panel panel--full">
        <header className="panel__header">
          <h2 className="panel__title">Your Pets</h2>
        </header>

        <div className="panel__body">
          {pets.length === 0 ? (
            <section className="panel panel--narrow u-stack-md">
              <p>🧸 {Brand.emptyStates.pets}</p>

              <button
                className="btn btn--secondary"
                onClick={() => document.getElementById('adopt-name')?.focus()}
              >
                Adopt your first friend
              </button>

              <p className="notfound__hint">{Brand.hints.dashboard}</p>
            </section>
          ) : (
            <div className="grid grid-3">
              {pets.map((pet) => (
                <article key={pet.id} className="panel">
                  <div className="panel__body u-stack-md">
                    <Link to={`/pets/${pet.id}`} title={`${pet.name} the ${pet.type}`}>
                      <PetSprite
                        type={pet.type}
                        size={120}
                        title={`${pet.name} the ${pet.type}`}
                        className="pet-sprite"
                      />
                    </Link>

                    <div className="u-stack-sm">
                      <h3>{pet.name}</h3>

                      {/* Stat bars: only render if present */}
                      {typeof pet.fullness === 'number' && (
                        <div className="status-bar status-bar--fullness" aria-label="Fullness">
                          <div className="status-fill" style={{ width: `${pet.fullness}%` }} />
                        </div>
                      )}

                      {typeof pet.happiness === 'number' && (
                        <div className="status-bar status-bar--happiness" aria-label="Happiness">
                          <div className="status-fill" style={{ width: `${pet.happiness}%` }} />
                        </div>
                      )}

                      {typeof pet.energy === 'number' && (
                        <div className="status-bar status-bar--energy" aria-label="Energy">
                          <div className="status-fill" style={{ width: `${pet.energy}%` }} />
                        </div>
                      )}
                    </div>

                    <div className="u-actions-row">
                      <Link
                        to={`/pets/${pet.id}`}
                        className="btn btn--secondary"
                        title={`${pet.name} the ${pet.type}`}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

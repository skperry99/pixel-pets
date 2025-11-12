import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPetsByUser, getUserProfile } from '../api';
import AppLayout from '../components/AppLayout';
import PetSprite from '../components/PetSprite';
import { burstConfetti } from '../utils/confetti';
import AdoptForm from '../components/AdoptForm';
import { useNotice } from '../hooks/useNotice';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';
import { Brand } from '../utils/brandText';
import LoadingCard from '../components/LoadingCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId();

  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // {id, username, email}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId == null) {
      navigate('/login');
      return;
    }

    let isActive = true;
    (async () => {
      const [pRes, listRes] = await Promise.all([
        getUserProfile(Number(userId)),
        getPetsByUser(userId),
      ]);

      if (!isActive) return;

      // Profile
      if (!pRes.ok) {
        notify.error(pRes.error || 'Failed to load profile.');
      } else {
        setUserProfile(pRes.data || null);
      }

      // Pets
      if (!listRes.ok) {
        notify.error(listRes.error || 'Failed to load pets.');
        setPets([]); // ensure array
      } else {
        const list = Array.isArray(listRes.data) ? listRes.data : [];
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
        <div className="panel__body stack-md">
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
                  burstConfetti(); // 🎉 first pet celebration
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
              {pets.map((p) => (
                <article key={p.id} className="panel">
                  <div className="panel__body stack-md">
                    <Link to={`/pets/${p.id}`} title={`${p.name} the ${p.type}`}>
                      <PetSprite
                        type={p.type}
                        size={120}
                        title={`${p.name} the ${p.type}`}
                        className="pet-sprite"
                      />
                    </Link>

                    <div className="u-stack-sm">
                      <h3>{p.name}</h3>
                      {/* Stat bars: only render if present */}
                      {typeof p.fullness === 'number' && (
                        <div className="status-bar status-bar--fullness" aria-label="Fullness">
                          <div className="status-fill" style={{ width: `${p.fullness}%` }} />
                        </div>
                      )}
                      {typeof p.happiness === 'number' && (
                        <div className="status-bar status-bar--happiness" aria-label="Happiness">
                          <div className="status-fill" style={{ width: `${p.happiness}%` }} />
                        </div>
                      )}
                      {typeof p.energy === 'number' && (
                        <div className="status-bar status-bar--energy" aria-label="Energy">
                          <div className="status-fill" style={{ width: `${p.energy}%` }} />
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/pets/${p.id}`}
                      className="btn btn--secondary"
                      title={`${p.name} the ${p.type}`}
                    >
                      View Profile
                    </Link>
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

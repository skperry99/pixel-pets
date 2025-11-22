// src/pages/Landing.jsx
// Public landing page for Pixel Pets.
// - Shows hero sprite + sample status bars
// - Primary CTAs: Log In and Register

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import PetSprite from '../components/PetSprite';
import StatusBarPixel from '../components/StatusBarPixel';
import { getStoredUserId } from '../utils/auth';
import { getUserProfile } from '../api';

export default function Landing() {
  const navigate = useNavigate();

  const userId = getStoredUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // If we have a stored user id, fetch a lightweight profile
  useEffect(() => {
    if (!userId) return;

    let isActive = true;
    setProfileLoading(true);

    (async () => {
      const res = await getUserProfile(userId);
      if (!isActive) return;

      if (res.ok) {
        setUserProfile(res.data || null);
      }
      // On error, just fall back to generic landing copy
      setProfileLoading(false);
    })();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const isLoggedIn = Boolean(userId && userProfile);

  return (
    <AppLayout
      headerProps={{
        title: 'PIXEL PETS',
        subtitle: '✨ Because every pixel deserves a little love. 🐾',
      }}
    >
      {/* Hero */}
      <section className="panel panel--wide">
        <div className="panel__body u-stack-md u-center" style={{ flexDirection: 'column' }}>
          <PetSprite type="Dragon" size={240} title="Pixel Pet Preview" />

          {/* Decorative demo bars */}
          <div className="demo-bars u-stack-sm" aria-hidden="true">
            <StatusBarPixel label="Fullness" value={86} kind="fullness" />
            <StatusBarPixel label="Happiness" value={72} kind="happiness" />
            <StatusBarPixel label="Energy" value={63} kind="energy" />
          </div>

          {/* Messaging */}
          {isLoggedIn ? (
            <>
              <p className="u-text-center">
                Welcome back, <strong>{userProfile?.username ?? 'Trainer'}</strong>!
              </p>
              <p className="u-text-center">
                Your pixel pals are waiting on your dashboard. Keep their stats happy with feed,
                play, and rest.
              </p>
            </>
          ) : (
            <>
              <p className="u-text-center">
                Adopt your own retro pixel pet and keep their stats happy.
              </p>
              <p className="u-text-center">
                Feed, play, and rest your way to a cozy little pixel menagerie.
              </p>
            </>
          )}

          {/* CTAs */}
          <div className="u-actions-row">
            {isLoggedIn ? (
              <>
                <button
                  className="btn"
                  onClick={() => navigate('/dashboard')}
                  disabled={profileLoading}
                >
                  ▶ Go to Dashboard
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate('/settings')}
                  disabled={profileLoading}
                >
                  ⚙ Edit Profile
                </button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => navigate('/login')}>
                  ▶ START / LOG IN
                </button>
                <button className="btn btn--secondary" onClick={() => navigate('/register')}>
                  ★ NEW GAME / REGISTER
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature tease */}
      <section className="panel panel--wide">
        <header className="panel__header">
          <h2 className="panel__title">Features</h2>
        </header>
        <div className="panel__body">
          <ul className="feature-list">
            <li>🕹️ Retro 8-bit UI with crunchy pixels</li>
            <li>🍖 Feed · 🎾 Play · 💤 Rest to boost stats</li>
            <li>📈 Level up and keep your pets happy</li>
            <li>💾 Real backend (Spring Boot + MySQL)</li>
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}

// src/pages/NotFound.jsx
// 404 page:
// - Shows a playful pixel ghost
// - Offers navigation back home, back in history, or to dashboard

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import { burstConfetti } from '../utils/confetti';
import { Brand } from '../utils/brandText';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Quick celebratory pop so the page feels alive
    burstConfetti();
  }, []);

  return (
    <AppLayout headerProps={{ title: 'WHOOPS!' }}>
      <div className="page-center">
        <section className="panel panel--narrow notfound">
          <header className="panel__header">
            <h1 className="panel__title notfound__title">
              <span className="notfound__code" aria-hidden="true">
                404
              </span>
              <span className="sr-only">Page Not Found</span>
            </h1>
          </header>

          <div className="panel__body notfound__body u-stack-md">
            <p className="notfound__lead">This path wandered off the map. The pixels got lost 🐾</p>

            {/* Pixel ghost illustration */}
            <div className="notfound__ghost" aria-hidden="true">
              <div className="eye" />
              <div className="eye" />
              <div className="frill frill-1" />
              <div className="frill frill-2" />
              <div className="frill frill-3" />
              <div className="frill frill-4" />
            </div>

            <div className="u-actions-row">
              <Link to="/">
                <button className="btn">← Home</button>
              </Link>

              <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>
                ⤺ Go Back
              </button>

              <Link to="/dashboard">
                <button className="btn btn--ghost">Dashboard</button>
              </Link>
            </div>

            <p className="notfound__hint">{Brand.hints.notFound}</p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

// src/components/NavBar.jsx
// Top navigation for Pixel Pets.
// - Shows brand, page title/subtitle, and primary nav links
// - Adapts links based on auth state (login/register vs dashboard/settings/logout)
// - Includes a responsive hamburger menu + Escape-to-close behavior

import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';
import { Brand } from '../utils/brandText';

export default function NavBar({
  headerTitle = Brand.layout.headerTitle,
  headerSubtitle = Brand.layout.headerSubtitle,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthed = Boolean(getStoredUserId());
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) => `nav__link ${isActive ? 'active' : ''}`;

  function handleLogout(e) {
    e.preventDefault();
    clearStoredUserId();
    navigate('/login');
  }

  // Close menu on route change for better UX on mobile
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close menu on Escape key when open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      window.addEventListener('keydown', onKey);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="nav container">
      {/* Brand (left) */}
      <Link to="/" className="nav__brand" aria-label="Pixel Pets home">
        🐾 {Brand.app}
      </Link>

      {/* Page title + subtitle (center) */}
      <div className="nav__center">
        {headerTitle && <h1 className="nav__title pulse">🐾 {headerTitle}</h1>}
        {headerSubtitle && <p className="nav__subtitle">{headerSubtitle}</p>}
      </div>

      {/* Right: hamburger + primary navigation */}
      <div className="nav__controls">
        {/* Hamburger (visible on small screens via CSS) */}
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="primary-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
        </button>

        {/* Primary navigation */}
        <nav
          id="primary-menu"
          className={`nav__links ${open ? 'nav__links--open' : ''}`}
          aria-label="Primary"
        >
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          {isAuthed ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/settings" className={linkClass}>
                Edit Profile
              </NavLink>

              {/* Pixel-style Quit button */}
              <button
                type="button"
                className="btn btn--danger nav__quit-btn"
                onClick={handleLogout}
                aria-label="Quit to login screen"
                title="Quit"
              >
                QUIT
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log In
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

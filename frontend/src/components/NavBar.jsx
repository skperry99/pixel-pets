// src/components/NavBar.jsx
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';

export default function NavBar({
  headerTitle = 'PIXEL PETS',
  headerSubtitle = '✨ Because every pixel deserves a little love. 🐾',
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

  // Close the menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="nav container">
      {/* Brand (left) */}
      <Link to="/" className="nav__brand" aria-label="Pixel Pets home">
        🐾 Pixel Pets
      </Link>

      {/* Page title + subtitle (center) */}
      <div className="nav__center">
        {headerTitle && <h1 className="nav__title pulse">🐾 {headerTitle}</h1>}
        {headerSubtitle && <p className="nav__subtitle">{headerSubtitle}</p>}
      </div>

      {/* Right side: hamburger + links */}
      <div className="nav__controls">
        {/* Hamburger toggler (shown on small screens by CSS) */}
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
              <button type="button" className="btn btn--ghost nav__logout" onClick={handleLogout}>
                Logout
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

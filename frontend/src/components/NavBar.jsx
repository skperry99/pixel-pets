import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';

/* Pixel "logout" icon (door + arrow) */
function LogoutIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      role="img"
      aria-hidden="true"
      focusable="false"
      className="icon-pixel"
    >
      {/* door */}
      <rect x="2" y="3" width="7" height="12" />
      <rect x="3" y="8" width="1" height="1" /> {/* knob */}
      {/* arrow */}
      <rect x="10" y="8" width="6" height="2" />
      <rect x="14" y="6" width="2" height="2" />
      <rect x="14" y="10" width="2" height="2" />
    </svg>
  );
}

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

  // Close menu on route change
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

              {/* Icon logout (replaces button text) */}
              <button
                type="button"
                className="btn btn--ghost nav__icon-btn"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogoutIcon />
                <span className="sr-only">Log out</span>
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

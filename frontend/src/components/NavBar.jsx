import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';

export default function NavBar({
  headerTitle = 'PIXEL PETS',
  headerSubtitle = '✨ Because every pixel deserves a little love. 🐾',
}) {
  const navigate = useNavigate();
  const isAuthed = Boolean(getStoredUserId());

  const linkClass = ({ isActive }) => `nav__link ${isActive ? 'active' : ''}`;

  function handleLogout(e) {
    e.preventDefault();
    clearStoredUserId();
    navigate('/login');
  }

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

      {/* Primary navigation (right) */}
      <nav className="nav__links" aria-label="Primary">
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
  );
}

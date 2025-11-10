import { NavLink, useNavigate } from "react-router-dom";
import { getStoredUserId, clearStoredUserId } from "../utils/auth";

export default function NavBar({
  headerTitle = "PIXEL PETS",
  headerSubtitle = "✨ Because every pixel deserves a little love. 🐾",
}) {
  const navigate = useNavigate();
  const isAuthed = Boolean(getStoredUserId());

  const linkClass = ({ isActive }) => `nav__link ${isActive ? "active" : ""}`;

  function handleHomeClick(e) {
    e.preventDefault();
    navigate("/");
  }

  function handleLogout(e) {
    e.preventDefault();
    clearStoredUserId();
    navigate("/login");
  }

  return (
    <div className="nav container">
      {/* Left: brand */}
      <a href="/" onClick={handleHomeClick} className="nav__brand">
        🐾 Pixel Pets
      </a>

      {/* Center: page title/subtitle */}
      <div className="nav__center">
        {headerTitle && <h1 className="nav__title pulse">🐾 {headerTitle}</h1>}
        {headerSubtitle && <p className="nav__subtitle">{headerSubtitle}</p>}
      </div>

      {/* Right: links */}
      <div className="nav__links">
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
            <button
              className="btn btn--ghost nav__logout"
              onClick={handleLogout}
            >
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
      </div>
    </div>
  );
}

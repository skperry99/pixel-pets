// NavBar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getStoredUserId, clearStoredUserId } from "../utils/auth";

export default function NavBar({
  headerTitle = "PIXEL PETS",
  headerSubtitle = "✨ Because every pixel deserves a little love. 🐾",
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthed = Boolean(getStoredUserId());
  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  function handleHomeClick(e) {
    e.preventDefault();
    navigate("/");
  }

  function handleLogout(e) {
    e.preventDefault();
    clearStoredUserId();
    navigate("/login");
  }

  const LoggedOutMenu = () => (
    <div className="nav-links nav-right">
      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/login" className={linkClass}>Log In</NavLink>
      <NavLink to="/register" className={linkClass}>Register</NavLink>
    </div>
  );

  const LoggedInMenu = () => (
    <div className="nav-links nav-right">
      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/settings" className={linkClass}>Edit Profile</NavLink>
      <button className="btn btn--ghost nav-logout" onClick={handleLogout}>Logout</button>
    </div>
  );

  return (
    <div className="container nav-row nav-grid">
      {/* Left: brand */}
      <a href="/" onClick={handleHomeClick} className="nav-brand nav-left">
        🐾 Pixel Pets
      </a>

      {/* Center: header title from page */}
      <div className="nav-center">
        {headerTitle && <h1 className="nav-header-title pulse">🐾 {headerTitle}</h1>}
        {headerSubtitle && <p className="nav-header-subtitle">{headerSubtitle}</p>}
      </div>

      {/* Right: menu */}
      {isAuthed ? <LoggedInMenu /> : <LoggedOutMenu />}
    </div>
  );
}
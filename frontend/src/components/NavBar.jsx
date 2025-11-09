import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getStoredUserId } from "../utils/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--accent-bright)" : "var(--accent-color)",
    textShadow: "1px 1px #000",
    marginRight: "1rem",
  });

  const isAuthed = Boolean(getStoredUserId);
  const path = location.pathname;

  // LOGGED OUT MENUS
  const LoggedOutMenu = () => {
    if (path === "/") {
      // Landing → show Login + Register
      return (
        <>
          <NavLink to="/login" style={linkStyle}>
            Log In
          </NavLink>
          <NavLink to="/register" style={linkStyle}>
            Register
          </NavLink>
        </>
      );
    }
    if (path === "/login") {
      // Login → show Home + Register
      return (
        <>
          <NavLink to="/" style={linkStyle} end>
            Home
          </NavLink>
          <NavLink to="/register" style={linkStyle}>
            Register
          </NavLink>
        </>
      );
    }
    if (path === "/register") {
      // Register → show Home + Login
      return (
        <>
          <NavLink to="/" style={linkStyle} end>
            Home
          </NavLink>
          <NavLink to="/login" style={linkStyle}>
            Log In
          </NavLink>
        </>
      );
    }
    // Fallback (unknown public page) → Home + Login + Register
    return (
      <>
        <NavLink to="/" style={linkStyle} end>
          Home
        </NavLink>
        <NavLink to="/login" style={linkStyle}>
          Log In
        </NavLink>
        <NavLink to="/register" style={linkStyle}>
          Register
        </NavLink>
      </>
    );
  };

  // LOGGED IN MENUS
  const LoggedInMenu = () => {
    const onDashboard = path === "/dashboard";
    const onSettings = path === "/settings";

    // Always show Home
    const homeLink = (
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
    );

    // Show the *other* link depending on current page:
    // - On /dashboard → show Edit Profile
    // - On /settings → show Dashboard
    // - On any other authed page → show both
    const dashLink = !onDashboard ? (
      <NavLink to="/dashboard" style={linkStyle}>
        Dashboard
      </NavLink>
    ) : null;

    const settingsLink = !onSettings ? (
      <NavLink to="/settings" style={linkStyle}>
        Edit Profile
      </NavLink>
    ) : null;

    return (
      <>
        {homeLink}
        {onDashboard && (
          <NavLink to="/settings" style={linkStyle}>
            Edit Profile
          </NavLink>
        )}
        {onSettings && (
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
        )}
        {!onDashboard && !onSettings && (
          <>
            {dashLink}
            {settingsLink}
          </>
        )}
      </>
    );
  };

  return (
    <nav>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        style={{
          color: "var(--accent-bright)",
          marginRight: "1rem",
          textDecoration: "none",
        }}
      >
        🐾 Pixel Pets
      </a>

      {isAuthed ? <LoggedInMenu /> : <LoggedOutMenu />}
    </nav>
  );
}

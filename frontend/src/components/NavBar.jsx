import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--accent-bright)" : "var(--accent-color)",
    textShadow: "1px 1px #000",
  });

  return (
    <nav aria-label="Main">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        style={{ color: "var(--accent-bright)", marginRight: "1rem" }}
      >
        🐾 Pixel Pets
      </a>

      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/login" style={linkStyle}>
        Log In
      </NavLink>
      <NavLink to="/register" style={linkStyle}>
        Register
      </NavLink>
      <NavLink to="/dashboard" style={linkStyle}>
        Dashboard
      </NavLink>
      <NavLink to="/settings" style={linkStyle}>
        Edit Profile
      </NavLink>
    </nav>
  );
}

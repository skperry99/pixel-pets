import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newUserId = await registerUser(
        formData.username,
        formData.email,
        formData.password
      );
      localStorage.setItem("userId", newUserId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <input
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        disabled={loading}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={loading}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={loading}
        required
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p>Already have an account?</p>
      <button onClick={() => navigate("/login")}>Login</button>
    </form>
  );
}

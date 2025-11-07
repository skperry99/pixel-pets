import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import AppLayout from "../components/AppLayout";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userId = await login(form.username, form.password);
      localStorage.setItem("userId", userId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      headerProps={{
        title: "LOG IN",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "CHECKING..." : "LOG IN"}
        </button>
        <p>New to Pixel Pets?</p>
        <button onClick={() => navigate("/register")}>Create an account</button>
      </form>
    </AppLayout>
  );
}

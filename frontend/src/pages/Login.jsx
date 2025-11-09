// frontend/src/pages/Login.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useNotice } from "../hooks/useNotice";
import { login } from "../api";
import { getStoredUserId, setStoredUserId } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    const id = getStoredUserId();
    if (id != null) navigate("/dashboard");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      const msg = "Username and password are required.";
      setErrorMsg(msg);
      notify.error(msg);
      (!username ? usernameRef : passwordRef).current?.focus();
      return;
    }

    try {
      setLoading(true);
      const userId = await login(username, password); // backend returns a number
      setStoredUserId(userId);
      notify.success("Welcome back! 🐾");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.message || "Login failed.";
      setErrorMsg(msg);
      notify.error(msg);
      usernameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "LOGIN" }}>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Log In</h1>

        <input
          ref={usernameRef}
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="username"
          disabled={loading}
          required
        />

        <input
          ref={passwordRef}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
          disabled={loading}
          required
        />

        {errorMsg && <p>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Log In"}
        </button>

        <p>New to Pixel Pets?</p>
        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={loading}
        >
          Create Account
        </button>
      </form>
    </AppLayout>
  );
}
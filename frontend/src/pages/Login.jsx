import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import AppLayout from "../components/AppLayout";
import { useNotice } from "../hooks/useNotice";

export default function Login() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      const msg = "Username and password are required.";
      setErrorMsg(msg);
      notify.error(msg);
      (!username ? usernameRef : passwordRef).current?.focus();
      setLoading(false);
      return;
    }

    try {
      const userId = await login(username, password);
      localStorage.setItem("userId", String(userId));
      notify.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.message ||
        (err?.status === 401 ? "Invalid username or password." : "Login failed.");
      setErrorMsg(msg);
      notify.error(msg);
      usernameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "LOG IN" }}>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>

        <input
          ref={usernameRef}
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
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
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
          required
        />

        {errorMsg && <p style={{ marginTop: 8 }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Log in"}
        </button>

        <p style={{ marginTop: 12 }}>New to Pixel Pets?</p>
        <button type="button" onClick={() => navigate("/register")} disabled={loading}>
          Create an account
        </button>
      </form>
    </AppLayout>
  );
}

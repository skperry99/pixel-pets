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
  const errorRef = useRef(null);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    const id = getStoredUserId();
    if (id != null) navigate("/dashboard");
  }, [navigate]);

  function setAndFocusError(msg) {
    setErrorMsg(msg);
    // shift focus to the alert text for SR users
    queueMicrotask(() => errorRef.current?.focus());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      const msg = "Username and password are required.";
      setAndFocusError(msg);
      notify.error(msg);
      if (!username) usernameRef.current?.focus();
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
      setAndFocusError(msg);
      notify.error(msg);
      usernameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "LOGIN" }}>
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">Log In</h1>
        </header>

        <div className="panel__body">
          <form className="form" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="form__row">
              <label className="label" htmlFor="login-username">
                Username
              </label>
              <input
                id="login-username"
                ref={usernameRef}
                name="username"
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!errorMsg && !form.username.trim()}
              />
            </div>

            {/* Password */}
            <div className="form__row">
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!errorMsg && !form.password}
              />
            </div>

            {/* Error (role=alert + focusable) */}
            {errorMsg && (
              <div
                className="form-error"
                role="alert"
                tabIndex={-1}
                ref={errorRef}
              >
                {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div className="form__row" style={{ textAlign: "center" }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Log In"}
              </button>
            </div>

            <div className="form__row" style={{ textAlign: "center" }}>
              <p>New to Pixel Pets?</p>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </section>
    </AppLayout>
  );
}

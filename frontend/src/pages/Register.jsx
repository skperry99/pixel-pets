import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { setStoredUserId } from '../utils/auth';
import AppLayout from '../components/AppLayout';
import { useNotice } from '../hooks/useNotice';

export default function Register() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const errorRef = useRef(null);

  function setAndFocusError(msg) {
    setErrorMsg(msg);
    queueMicrotask(() => errorRef.current?.focus());
  }

  function isValidEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    // client-side validation (mirror of backend rules, loosely)
    if (!username || !email || !password) {
      const msg = 'All fields are required.';
      setAndFocusError(msg);
      notify.error(msg);
      if (!username) return usernameRef.current?.focus();
      if (!email) return emailRef.current?.focus();
      return;
    }
    if (username.length < 3 || username.length > 30) {
      const msg = 'Username must be 3–30 characters.';
      setAndFocusError(msg);
      notify.error(msg);
      return usernameRef.current?.focus();
    }
    if (!isValidEmail(email)) {
      const msg = 'Please enter a valid email address.';
      setAndFocusError(msg);
      notify.error(msg);
      return emailRef.current?.focus();
    }
    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters.';
      setAndFocusError(msg);
      notify.error(msg);
      return;
    }

    setLoading(true);
    const res = await registerUser(username, email, password);
    if (!res.ok) {
      const msg = res.error || 'Registration failed.';
      setAndFocusError(msg);
      notify.error(msg);
      usernameRef.current?.focus();
      setLoading(false);
      return;
    }

    // API returns the new user id as JSON (number)
    const newUserId = res.data;
    setStoredUserId(newUserId);
    notify.success('Account created! Welcome to Pixel Pets.');
    navigate('/dashboard');
    setLoading(false);
  }

  return (
    <AppLayout headerProps={{ title: 'REGISTER' }}>
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">Create Account</h1>
        </header>

        <div className="panel__body">
          <form className="form" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="form__row">
              <label className="label" htmlFor="reg-username">
                Username
              </label>
              <input
                id="reg-username"
                ref={usernameRef}
                name="username"
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={
                  !!errorMsg && (!form.username.trim() || form.username.trim().length < 3)
                }
              />
            </div>

            {/* Email */}
            <div className="form__row">
              <label className="label" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                ref={emailRef}
                name="email"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!errorMsg && !isValidEmail(form.email)}
              />
            </div>

            {/* Password */}
            <div className="form__row">
              <label className="label" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!errorMsg && form.password.length < 8}
              />
            </div>

            {/* Error (role=alert + focusable) */}
            {errorMsg && (
              <div
                className="form-error"
                role="alert"
                aria-live="assertive"
                tabIndex={-1}
                ref={errorRef}
              >
                {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div className="form__row center">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="form__row center">
              <p>Already have an account?</p>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </section>
    </AppLayout>
  );
}

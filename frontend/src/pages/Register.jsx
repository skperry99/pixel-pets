// src/pages/Register.jsx
// Registration screen:
// - Redirects to dashboard if already authed
// - Client-side validation for username/email/password
// - Inline error message + toast notices

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { setStoredUserId, getStoredUserId } from '../utils/auth';
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

  // If already authed, bounce; otherwise autofocus username for convenience.
  useEffect(() => {
    const id = getStoredUserId();
    if (id != null) {
      navigate('/dashboard');
    } else {
      usernameRef.current?.focus();
    }
  }, [navigate]);

  // Helper: set error text and shift focus to alert for SR users.
  function setErrorAndFocus(message) {
    setErrorMsg(message);
    queueMicrotask(() => errorRef.current?.focus());
  }

  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    // Client-side validation
    if (!username || !email || !password) {
      const message = 'All fields are required.';
      setErrorAndFocus(message);
      notify.error(message);
      if (!username) return usernameRef.current?.focus();
      if (!email) return emailRef.current?.focus();
      return;
    }

    if (username.length < 3 || username.length > 30) {
      const message = 'Username must be 3–30 characters.';
      setErrorAndFocus(message);
      notify.error(message);
      return usernameRef.current?.focus();
    }

    if (!isValidEmail(email)) {
      const message = 'Please enter a valid email address.';
      setErrorAndFocus(message);
      notify.error(message);
      return emailRef.current?.focus();
    }

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.';
      setErrorAndFocus(message);
      notify.error(message);
      return;
    }

    setLoading(true);

    const res = await registerUser(username, email, password);
    if (!res.ok) {
      const message = res.error || 'Registration failed.';
      setErrorAndFocus(message);
      notify.error(message);
      usernameRef.current?.focus();
      setLoading(false);
      return;
    }

    // API returns new user id as JSON
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
            <div className="form__row u-text-center">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="form__row u-text-center">
              <p>Already have an account?</p>
              <div className="u-actions-row">
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </AppLayout>
  );
}

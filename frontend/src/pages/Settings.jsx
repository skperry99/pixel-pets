// src/pages/Settings.jsx
// Profile settings:
// - Load current user profile
// - Update username/email
// - Change password
// - Delete account (with DELETE confirmation + toast feedback)

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateUser, deleteUserApi, getUserProfile } from '../api';
import AppLayout from '../components/AppLayout';
import { useNotice } from '../hooks/useNotice';
import { getStoredUserId, clearStoredUserId } from '../utils/auth';
import { Brand } from '../utils/brandText';
import ConfirmAction from '../components/ConfirmAction';

export default function Settings() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId();

  // ----- Form state -----
  const [form, setForm] = useState({ username: '', email: '' });
  const [password, setPassword] = useState('');

  // Shared status/error state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete-confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState(''); // inline delete error
  const [headerName, setHeaderName] = useState('');

  const requiredPhrase = 'DELETE';

  // ----- Refs -----
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const errorRef = useRef(null);

  // ----- Effects: initial load -----
  useEffect(() => {
    if (userId == null) {
      navigate('/login');
      return;
    }

    (async () => {
      const res = await getUserProfile(userId);
      if (!res.ok) {
        const inlineMsg = res.error || Brand.inline.profileLoadFailed;

        // Inline: detailed explanation
        setErrorAndFocus(inlineMsg);

        // Toast: short, on-brand
        notify.error(Brand.toasts.profileLoadFailed);
        return;
      }

      const user = res.data || {};
      setForm({
        username: user.username ?? '',
        email: user.email ?? '',
      });
      setHeaderName(user.username ?? '');
      usernameRef.current?.focus();
    })();
  }, [userId, navigate, notify]);

  // ----- Helpers -----

  function isValidEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  /** Set error message and move focus to the error block for SR users. */
  function setErrorAndFocus(msg) {
    setErrorMsg(msg);
    queueMicrotask(() => errorRef.current?.focus());
  }

  // ----- Handlers: profile update -----

  async function handleProfileSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    setLoading(true);

    const username = form.username.trim();
    const email = form.email.trim();

    // Basic validation (inline only)
    if (!username || !email) {
      const msg = 'Username and email are required.';
      setErrorAndFocus(msg);
      if (!username) usernameRef.current?.focus();
      else emailRef.current?.focus();
      setLoading(false);
      return;
    }

    if (username.length < 3 || username.length > 30) {
      const msg = 'Username must be 3–30 characters.';
      setErrorAndFocus(msg);
      usernameRef.current?.focus();
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      const msg = 'Please enter a valid email address.';
      setErrorAndFocus(msg);
      emailRef.current?.focus();
      setLoading(false);
      return;
    }

    const res = await updateUser(userId, { username, email });
    if (!res.ok) {
      const inlineMsg = res.error || Brand.inline.profileUpdateFailed;

      // Inline: more detailed
      setErrorAndFocus(inlineMsg);
      usernameRef.current?.focus();

      // Toast: short, themed
      notify.error(Brand.toasts.profileError);

      setLoading(false);
      return;
    }

    const updated = res.data || {};

    // Re-sync form with server; fall back to submitted values if needed.
    const nextUsername = updated.username ?? username;
    const nextEmail = updated.email ?? email;

    setForm({
      username: nextUsername,
      email: nextEmail,
    });

    // Header only updates after successful save
    setHeaderName(nextUsername);
    notify.success(Brand.toasts.profilePatched);
    setLoading(false);
  }

  // ----- Handlers: password update -----

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    setLoading(true);

    const nextPwd = password;

    // Basic validation (inline only)
    if (!nextPwd) {
      const msg = 'Password is required.';
      setErrorAndFocus(msg);
      passwordRef.current?.focus();
      setLoading(false);
      return;
    }

    if (nextPwd.length < 8) {
      const msg = 'Password must be at least 8 characters.';
      setErrorAndFocus(msg);
      passwordRef.current?.focus();
      setLoading(false);
      return;
    }

    const res = await updateUser(userId, { password: nextPwd });
    if (!res.ok) {
      const inlineMsg = res.error || Brand.inline.passwordChangeFailed;

      // Inline: details
      setErrorAndFocus(inlineMsg);
      passwordRef.current?.focus();

      // Toast: short + themed
      notify.error(Brand.toasts.passwordError);

      setLoading(false);
      return;
    }

    setPassword('');
    notify.success(Brand.toasts.passwordPatched);
    setLoading(false);
  }

  // ----- Handlers: session / delete -----

  function handleLogout() {
    clearStoredUserId();
    navigate('/login');
  }

  async function handleConfirmDelete() {
    if (loading) return;

    setErrorMsg('');

    // 1) Client-side check: phrase must match exactly
    if (confirmText !== requiredPhrase) {
      const msg = `Please type "${requiredPhrase}" exactly to confirm.`;

      // Inline error under the DELETE input
      setDeleteError(msg);

      // Short, on-brand toast (fun + quick)
      notify.error(msg);

      // Force focus back to the confirm field so the user can fix it quickly
      queueMicrotask(() => {
        if (confirmRef.current) {
          confirmRef.current.focus();
          confirmRef.current.select?.();
        }
      });
      // Extra safety in case anything else tries to grab focus
      window.setTimeout(() => {
        if (confirmRef.current) {
          confirmRef.current.focus();
          confirmRef.current.select?.();
        }
      }, 0);

      return;
    }

    // 2) Phrase is correct → actually attempt deletion
    setDeleteError('');
    setLoading(true);

    const res = await deleteUserApi(userId);
    if (!res.ok) {
      const inlineMsg = res.error || 'Account deletion failed.';

      // Stay in the Delete section: use inline deleteError here
      setDeleteError(inlineMsg);

      // Toast: short, themed error
      notify.error(Brand.toasts.accountDeleteError || 'Account deletion failed. 😿');

      // Keep the user anchored at the DELETE input
      queueMicrotask(() => {
        if (confirmRef.current) {
          confirmRef.current.focus();
          confirmRef.current.select?.();
        }
      });

      setLoading(false);
      return;
    }

    notify.success('Your account was deleted.');
    clearStoredUserId();
    navigate('/login');
    setLoading(false);
  }

  // ----- Render -----

  return (
    <AppLayout headerProps={{ title: 'PROFILE SETTINGS' }}>
      {/* Header / quick actions */}
      <section className="panel">
        <header className="panel__header">
          <h1 className="panel__title">
            {headerName ? `${headerName}'s Profile` : 'Profile Settings'}
          </h1>
        </header>

        <div className="panel__body">
          <div className="u-actions-row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              ← Dashboard
            </button>
            <button type="button" className="btn" onClick={handleLogout} disabled={loading}>
              Logout
            </button>
          </div>

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
        </div>
      </section>

      {/* Update profile */}
      <section className="panel">
        <header className="panel__header">
          <h2 className="panel__title">Update Profile</h2>
        </header>

        <div className="panel__body">
          <form className="form" onSubmit={handleProfileSubmit} noValidate>
            <div className="form__row">
              <label className="label" htmlFor="set-username">
                Username
              </label>
              <input
                id="set-username"
                ref={usernameRef}
                name="username"
                type="text"
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                disabled={loading}
                required
                aria-required="true"
              />
            </div>

            <div className="form__row">
              <label className="label" htmlFor="set-email">
                Email
              </label>
              <input
                id="set-email"
                ref={emailRef}
                name="email"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={loading}
                required
                aria-required="true"
              />
            </div>

            <div className="form__row u-text-center">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Change password */}
      <section className="panel">
        <header className="panel__header">
          <h2 className="panel__title">Change Password</h2>
        </header>

        <div className="panel__body">
          <form className="form" onSubmit={handlePasswordSubmit} noValidate>
            <div className="form__row">
              <label className="label" htmlFor="set-password">
                New password
              </label>
              <input
                id="set-password"
                ref={passwordRef}
                name="password"
                type="password"
                placeholder="minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                aria-required="true"
              />
            </div>

            <div className="form__row u-text-center">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Delete account */}
      <section className="panel">
        <header className="panel__header">
          <h2 className="panel__title">Delete Account</h2>
        </header>

        <div className="panel__body u-stack-md">
          <p>Deleting your account will permanently remove your user and all pets.</p>

          {!confirmDelete ? (
            <div className="u-actions-row">
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  setConfirmDelete(true);
                  setDeleteError('');
                  setConfirmText('');
                  setTimeout(() => confirmRef.current?.focus(), 0);
                }}
                disabled={loading}
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="u-stack-sm">
              <p>
                Type <strong>{requiredPhrase}</strong> to confirm.
              </p>

              <input
                ref={confirmRef}
                placeholder={requiredPhrase}
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  if (deleteError) setDeleteError('');
                }}
                disabled={loading}
                aria-label="Type DELETE to confirm account deletion"
                aria-invalid={Boolean(deleteError)}
                aria-describedby={deleteError ? 'delete-confirm-error' : undefined}
              />

              {deleteError && (
                <p id="delete-confirm-error" className="form-error" role="alert">
                  {deleteError}
                </p>
              )}

              {/* Inline confirmation UI using ConfirmAction */}
              <ConfirmAction
                className="settings-delete-confirm"
                confirmPrompt="Are you absolutely sure? This cannot be undone."
                confirmLabel="Yes, delete my account"
                cancelLabel="Cancel"
                danger
                busy={loading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                  setConfirmDelete(false);
                  setConfirmText('');
                  setDeleteError('');
                }}
                autoFocusConfirm={false} // we’re already focusing the input above
              />
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

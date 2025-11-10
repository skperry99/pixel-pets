import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUserApi, getUserProfile } from "../api";
import AppLayout from "../components/AppLayout";
import { useNotice } from "../hooks/useNotice";
import { getStoredUserId, clearStoredUserId } from "../utils/auth";

export default function Settings() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId();

  const [form, setForm] = useState({ username: "", email: "" });
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [headerName, setHeaderName] = useState("");

  const requiredPhrase = "DELETE";

  // Refs for focusing the first invalid field / error text
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (userId == null) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const user = await getUserProfile(userId);
        setForm({ username: user.username ?? "", email: user.email ?? "" });
        setHeaderName(user.username ?? "");
      } catch (err) {
        const msg = err?.message || "Failed to load profile.";
        setAndFocusError(msg);
        notify.error(msg);
      }
    })();
  }, [userId, navigate, notify]);

  function isValidEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  function setAndFocusError(msg) {
    setErrorMsg(msg);
    queueMicrotask(() => errorRef.current?.focus());
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email) {
      const msg = "Username and email are required.";
      setAndFocusError(msg);
      notify.error(msg);
      if (!username) usernameRef.current?.focus();
      else emailRef.current?.focus();
      setLoading(false);
      return;
    }
    if (username.length < 3 || username.length > 30) {
      const msg = "Username must be 3–30 characters.";
      setAndFocusError(msg);
      notify.error(msg);
      usernameRef.current?.focus();
      setLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      const msg = "Please enter a valid email address.";
      setAndFocusError(msg);
      notify.error(msg);
      emailRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const updated = await updateUser(userId, { username, email });
      setForm({
        username: updated.username ?? username,
        email: updated.email ?? email,
      });
      setHeaderName(updated.username ?? username);
      notify.success("Profile updated!");
    } catch (err) {
      const msg = err?.message || "Profile update failed.";
      setAndFocusError(msg);
      notify.error(msg);
      usernameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const nextPwd = password;

    if (!nextPwd) {
      const msg = "Password is required.";
      setAndFocusError(msg);
      notify.error(msg);
      passwordRef.current?.focus();
      setLoading(false);
      return;
    }
    if (nextPwd.length < 8) {
      const msg = "Password must be at least 8 characters.";
      setAndFocusError(msg);
      notify.error(msg);
      passwordRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      await updateUser(userId, { password: nextPwd });
      setPassword("");
      notify.success("Password changed!");
    } catch (err) {
      const msg = err?.message || "Password change failed.";
      setAndFocusError(msg);
      notify.error(msg);
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearStoredUserId();
    navigate("/login");
  }

  async function handleConfirmDelete() {
    if (loading) return;
    if (confirmText !== requiredPhrase) return;

    setErrorMsg("");
    setLoading(true);

    try {
      await deleteUserApi(userId);
      notify.success("Your account was deleted.");
      clearStoredUserId(); // ensure local storage is cleared the same way everywhere
      navigate("/login");
    } catch (err) {
      const msg = err?.message || "Account deletion failed.";
      setAndFocusError(msg);
      notify.error(msg);
      confirmRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "PROFILE SETTINGS" }}>
      <main className="container stack-lg">
        {/* Header / quick actions */}
        <section className="panel">
          <header className="panel__header">
            <h1 className="panel__title">
              {headerName ? `${headerName}'s Profile` : "Profile Settings"}
            </h1>
          </header>
          <div className="panel__body">
            <div className="actions-row">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                ← Dashboard
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleLogout}
                disabled={loading}
              >
                Logout
              </button>
            </div>
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  disabled={loading}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form__row center">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
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

              <div className="form__row center">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
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
          <div className="panel__body stack-md">
            <p>
              Deleting your account will permanently remove your user and all
              pets.
            </p>

            {!confirmDelete ? (
              <div className="actions-row">
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => setConfirmDelete(true)}
                  disabled={loading}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="stack-sm">
                <p>
                  Type <strong>{requiredPhrase}</strong> to confirm.
                </p>
                <input
                  ref={confirmRef}
                  placeholder={requiredPhrase}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={loading}
                  aria-label="Type DELETE to confirm account deletion"
                />
                <div className="actions-row">
                  <button
                    type="button"
                    className="btn btn--danger"
                    disabled={loading || confirmText !== requiredPhrase}
                    onClick={handleConfirmDelete}
                  >
                    {loading ? "Deleting..." : "Confirm delete"}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    disabled={loading}
                    onClick={() => {
                      setConfirmDelete(false);
                      setConfirmText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

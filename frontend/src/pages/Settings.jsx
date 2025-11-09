import { useEffect, useState, useRef } from "react";
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

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (userId == null) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const user = await getUserProfile(userId);
        setForm({ username: user.username ?? "", email: user.email ?? "" });
        setHeaderName(user.username ?? ""); // <- display name is decoupled from form
      } catch (err) {
        const msg = err?.message || "Failed to load profile.";
        setErrorMsg(msg);
        notify.error(msg);
      }
    })();
  }, [userId, navigate, notify]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email) {
      const msg = "Username and email are required.";
      setErrorMsg(msg);
      notify.error(msg);
      (!username ? usernameRef : emailRef).current?.focus();
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      const msg = "Please enter a valid email address.";
      setErrorMsg(msg);
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
      setHeaderName(updated.username ?? username); // <- only change header after save

      notify.success("Profile updated!");
    } catch (err) {
      const msg = err?.message || "Profile update failed.";
      setErrorMsg(msg);
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
      setErrorMsg(msg);
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
      setErrorMsg(msg);
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
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (err) {
      const msg = err?.message || "Account deletion failed.";
      setErrorMsg(msg);
      notify.error(msg);
      confirmRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "PROFILE SETTINGS" }}>
      <h1>{headerName ? `${headerName}'s Profile` : "Profile Settings"}</h1>

      <div>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          disabled={loading}
        >
          Dashboard
        </button>
        <button type="button" onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>

      {errorMsg && <p style={{ marginTop: 8 }}>{errorMsg}</p>}

      <form onSubmit={handleProfileSubmit} noValidate>
        <h2>Update Profile</h2>
        <input
          ref={usernameRef}
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          disabled={loading}
          required
        />
        <input
          ref={emailRef}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} noValidate>
        <h2>Change Password</h2>
        <input
          ref={passwordRef}
          name="password"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      <div>
        <h2>Delete Account</h2>
        <p>
          Deleting your account will permanently remove your user and all pets.
        </p>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
          >
            Delete Account
          </button>
        ) : (
          <div>
            <p>
              Type <strong>{requiredPhrase}</strong> to confirm.
            </p>
            <input
              ref={confirmRef}
              placeholder={requiredPhrase}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
            />
            <div>
              <button
                type="button"
                disabled={loading || confirmText !== requiredPhrase}
                onClick={handleConfirmDelete}
              >
                {loading ? "Deleting..." : "Confirm delete"}
              </button>
              <button
                type="button"
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
    </AppLayout>
  );
}

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { setStoredUserId } from "../utils/auth";
import AppLayout from "../components/AppLayout";
import { useNotice } from "../hooks/useNotice";

export default function Register() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    // basic validation
    if (!username || !email || !password) {
      const msg = "All fields are required.";
      setErrorMsg(msg);
      notify.error(msg);
      // focus first missing field
      (!username
        ? usernameRef
        : !email
        ? emailRef
        : passwordRef
      ).current?.focus();

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
      const newUserId = await registerUser(username, email, password);
      setStoredUserId(newUserId);
      notify.success("Account created! Welcome to Pixel Pets.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.message || "Registration failed.";
      setErrorMsg(msg);
      notify.error(msg);
      // put focus on username for correction
      usernameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout headerProps={{ title: "REGISTER" }}>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Create Account</h1>
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
          ref={emailRef}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
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
          autoComplete="new-password"
          disabled={loading}
          required
        />
        {errorMsg && <p>{errorMsg}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>Already have an account?</p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Login
        </button>
      </form>
    </AppLayout>
  );
}

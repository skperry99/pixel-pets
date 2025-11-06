import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateUser, deleteUserApi } from "../api";

export default function Settings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // handle password separately for security
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(""); // success message
  const [error, setError] = useState(""); // error message
  const [loading, setLoading] = useState(false); // disable buttons while processing

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const updatedUser = await updateUser(userId, {
        username,
        email,
      });
      setMessage("Profile updated!");
      if (updatedUser.username) setUsername(updatedUser.username);
      if (updatedUser.email) setEmail(updatedUser.email);
    } catch (err) {
      setError(err.message || "Profile update failed!");
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await updateUser(userId, { password });
      setMessage("Password changed!");
      setPassword("");
    } catch (err) {
      setError(err.message || "Password change failed!");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>{(message || error) && <p>{message || error}</p>}</div>
      <form onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        <p>Leave field blank to keep current value</p>
        <input
          type="text"
          placeholder="New username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="New email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form onSubmit={changePassword}>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
      <div>
        <h2>Warning: This action is irreversible.</h2>
        <p>
          Deleting your account will permanently remove your user and all pets.
        </p>
        <button
          onClick={async () => {
            if (!confirm("Are you sure you want to delete your account?"))
              return;
            if (!confirm("Really delete? This cannot be undone.")) return;
            try {
              setLoading(true);
              await deleteUserApi(userId);
              localStorage.removeItem("userId");
              navigate("/login");
            } catch (e) {
              alert(e.message || "Failed to delete account");
            }
            finally {
              setLoading(false);
            }
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

// src/pages/PetProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import StatusBarPixel from "../components/StatusBarPixel";
import Notice from "../components/Notice";
import ConfirmAction from "../components/ConfirmAction";
import { useNotice } from "../hooks/useNotice";
import { getPetById, feedPet, playWithPet, restPet, deletePet } from "../api";

export default function PetProfile() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { notify } = useNotice();

  const userId = localStorage.getItem("userId");
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inlineError, setInlineError] = useState("");
  const [busy, setBusy] = useState(null); // "feed" | "play" | "rest" | "delete" | null
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    let isActive = true;
    (async () => {
      setLoading(true);
      setInlineError("");
      try {
        const data = await getPetById(petId);
        if (!isActive) return;
        setPet(data);
        notify.info(`Loaded ${data?.name ?? "pet"}.`, 1500);
      } catch (err) {
        if (!isActive) return;
        const msg = err?.message ?? "Unable to load pet.";
        setInlineError(msg);
        notify.error(msg);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [petId, userId, navigate, notify]);

  const actionsDisabled = useMemo(
    () => loading || !pet || !!busy,
    [loading, pet, busy]
  );

  async function runAction(label, fn) {
    if (!pet || busy) return;
    setBusy(label);
    try {
      const updated = await fn(pet.id);
      setPet(updated);
      const verb =
        label === "feed" ? "Fed" : label === "play" ? "Played with" : "Rested";
      notify.success(`${verb} ${updated.name}.`, 1500);
    } catch (err) {
      notify.error(err?.message ?? `Failed to ${label} pet.`);
    } finally {
      setBusy(null);
    }
  }

  async function confirmDeleteAndNavigate() {
    if (!pet) return;
    setBusy("delete");
    try {
      await deletePet(pet.id);
      notify.success(`${pet.name} was deleted.`);
      navigate("/dashboard");
    } catch (err) {
      notify.error(err?.message ?? "Failed to delete pet.");
    } finally {
      setBusy(null);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <AppLayout headerProps={{ title: "PET PROFILE" }}>
        <p>Loading pet…</p>
      </AppLayout>
    );
  }

  if (!pet) {
    return (
      <AppLayout headerProps={{ title: "PET PROFILE" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: 12 }}>
            ← Back to Dashboard
          </Link>
          {inlineError && (
            <Notice type="error" className="pixel-toast">
              {inlineError}
            </Notice>
          )}
          {!inlineError && <p>Pet not found.</p>}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout headerProps={{ title: "PET PROFILE" }}>
      <div className="page" style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <div
          className="page-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
        >
          <h1 className="page-title" style={{ margin: 0 }}>
            {pet.name}
          </h1>
          <div className="page-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {inlineError && (
          <Notice type="error" className="pixel-toast">
            {inlineError}
          </Notice>
        )}

        <div
          className="card pet-profile"
          style={{
            background: "var(--panel-color, #1b1b1b)",
            border: "4px solid var(--border-color, #333)",
            borderRadius: 12,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "minmax(240px, 320px) 1fr",
            gap: 24,
          }}
        >
          <div
            className="pet-profile__media"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <PetSprite type={pet.type} size={256} title={`${pet.name} the ${pet.type}`} />
          </div>

          <div className="pet-profile__body">
            <div className="muted" style={{ color: "var(--text-muted, #aaa)", marginBottom: 12 }}>
              {pet.type} • Level {pet.level ?? 1}
            </div>

            <div className="stats-grid" style={{ display: "grid", gap: 12 }}>
              <StatusBarPixel label="Hunger" value={pet.hunger} kind="hunger" />
              <StatusBarPixel label="Happiness" value={pet.happiness} kind="happiness" />
              <StatusBarPixel label="Energy" value={pet.energy} kind="energy" />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button
                className="btn"
                disabled={actionsDisabled}
                onClick={() => runAction("feed", feedPet)}
              >
                {busy === "feed" ? "Feeding…" : "Feed"}
              </button>
              <button
                className="btn"
                disabled={actionsDisabled}
                onClick={() => runAction("play", playWithPet)}
              >
                {busy === "play" ? "Playing…" : "Play"}
              </button>
              <button
                className="btn"
                disabled={actionsDisabled}
                onClick={() => runAction("rest", restPet)}
              >
                {busy === "rest" ? "Resting…" : "Rest"}
              </button>

              {/* Delete */}
              {confirmDelete ? (
                <ConfirmAction
                  confirmPrompt={`Are you sure you want to delete ${pet.name}? This action cannot be undone.`}
                  confirmLabel="Yes, delete"
                  cancelLabel="No, keep"
                  busy={busy === "delete"}
                  onConfirm={confirmDeleteAndNavigate}
                  onCancel={() => setConfirmDelete(false)}
                />
              ) : (
                <button
                  className="btn"
                  disabled={actionsDisabled}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </button>
              )}
            </div>

            <div className="meta" style={{ marginTop: 16, color: "var(--text-muted, #aaa)" }}>
              <div>Adopted: {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : "—"}</div>
              <div>Pet ID: {pet.id}</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
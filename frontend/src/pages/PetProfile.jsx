import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import StatusBarPixel from "../components/StatusBarPixel";
import Notice from "../components/Notice";
import ConfirmAction from "../components/ConfirmAction";
import { useNotice } from "../hooks/useNotice";
import { getPetById, feedPet, playWithPet, restPet, deletePet } from "../api";
import { getStoredUserId } from "../utils/auth";

export default function PetProfile() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { notify } = useNotice();

  const userId = getStoredUserId();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inlineError, setInlineError] = useState("");
  const [busy, setBusy] = useState(null); // "feed" | "play" | "rest" | "delete" | null
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (userId == null) {
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
        <main className="container">
          <section className="panel">
            <header className="panel__header">
              <h2 className="panel__title">Loading pet…</h2>
            </header>
            <div className="panel__body">
              <p>Please wait 🐾</p>
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  if (!pet) {
    return (
      <AppLayout headerProps={{ title: "PET PROFILE" }}>
        <main className="container">
          <section className="panel stack-md">
            <header className="panel__header">
              <h2 className="panel__title">Pet not found</h2>
            </header>
            <div className="panel__body stack-md">
              <Link to="/dashboard" className="btn btn--ghost">
                ← Back to Dashboard
              </Link>
              {inlineError && (
                <Notice type="error" className="pixel-toast">
                  {inlineError}
                </Notice>
              )}
              {!inlineError && <p>We couldn’t find that pet.</p>}
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout headerProps={{ title: "PET PROFILE" }}>
      <main className="container stack-lg">
        {/* Header actions */}
        <section className="panel">
          <header className="panel__header">
            <h1 className="panel__title">{pet.name}</h1>
          </header>
          <div className="panel__body">
            <div className="actions-row">
              <Link to="/dashboard" className="btn btn--ghost">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {inlineError && (
          <section className="panel">
            <div className="panel__body">
              <Notice type="error" className="pixel-toast">
                {inlineError}
              </Notice>
            </div>
          </section>
        )}

        {/* Profile content */}
        <section className="panel">
          <div className="panel__body">
            <div className="profile-grid">
              <div className="center">
                <PetSprite
                  type={pet.type}
                  size={256}
                  title={`${pet.name} the ${pet.type}`}
                  className="pet-sprite"
                />
              </div>

              <div className="stack-md">
                <div className="muted">
                  {pet.name} • Level {pet.level ?? 1}
                </div>

                <div className="stack-sm">
                  <StatusBarPixel
                    label="Fullness"
                    value={pet.fullness}
                    kind="fullness"
                  />
                  <StatusBarPixel
                    label="Happiness"
                    value={pet.happiness}
                    kind="happiness"
                  />
                  <StatusBarPixel
                    label="Energy"
                    value={pet.energy}
                    kind="energy"
                  />
                </div>

                {/* Actions */}
                <div className="actions-row">
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

                  {/* Delete flow */}
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
                      className="btn btn--danger"
                      disabled={actionsDisabled}
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Meta */}
                <div className="meta">
                  <div>
                    Adopted:{" "}
                    {pet.createdAt
                      ? new Date(pet.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                  <div>Pet ID: {pet.id}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

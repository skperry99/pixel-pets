import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPetsByUser,
  getUserProfile,
  feedPet,
  playWithPet,
  restPet,
  deletePet,
} from "../api";
import ConfirmAction from "../components/ConfirmAction";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import StatusBarPixel from "../components/StatusBarPixel";
import { burstConfetti } from "../utils/confetti";
import AdoptForm from "../components/AdoptForm";
import { useNotice } from "../hooks/useNotice";

export default function Dashboard() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? Number(rawUserId) : null;

  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // {id, username, email}
  const [confirmPetId, setConfirmPetId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const replacePet = (updated) =>
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    let alive = true;
    (async () => {
      try {
        const [p, list] = await Promise.all([
          getUserProfile(userId),
          getPetsByUser(userId),
        ]);
        if (!alive) return;
        setUserProfile(p);
        setPets(list);
      } catch (err) {
        if (!alive) return;
        notify.error(err?.message ?? "Failed to load dashboard.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [userId, navigate, notify]);

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/login");
  }

  if (loading) {
    return (
      <AppLayout headerProps={{ title: "DASHBOARD" }}>
        <p>Loading your pets…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout headerProps={{ title: "DASHBOARD" }}>
      <div>
        <h1>
          {userProfile
            ? `Welcome, ${userProfile.username}!`
            : "Your Pet Dashboard"}
        </h1>
        <p>
          {pets.length === 0
            ? "You do not have any pets yet — adopt your first friend!"
            : `You have ${pets.length} ${pets.length === 1 ? "pet" : "pets"}.`}
        </p>
        <div>
          <button onClick={() => navigate("/settings")}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <AdoptForm
        userId={Number(userId)}
        petTypes={["Cat", "Dog", "Dragon"]}
        onAdopt={(savedPet) => {
          setPets((prev) => {
            if (prev.length === 0) {
              burstConfetti();
            } // 🎉 first pet
            return [...prev, savedPet];
          });
          notify.success(`Adopted ${savedPet.name} the ${savedPet.type}!`);
        }}
      />

      {pets.length === 0 ? (
        <p>No pets yet. Try adopting one!</p>
      ) : (
        <ul>
          {pets.map((p) => (
            <li key={p.id}>
              <PetSprite
                type={p.type}
                size={120}
                title={`${p.name} the ${p.type}`}
              />
              <div>{p.name}</div>
              <div className="grid gap-2 mt-3">
                <StatusBarPixel label="Hunger" value={p.hunger} kind="hunger" />
                <StatusBarPixel
                  label="Happiness"
                  value={p.happiness}
                  kind="happiness"
                />
                <StatusBarPixel label="Energy" value={p.energy} kind="energy" />
              </div>
              <div>
                <button
                  onClick={async () => {
                    const updated = await feedPet(p.id);
                    replacePet(updated);
                  }}
                >
                  Feed
                </button>
                <button
                  onClick={async () => {
                    const updated = await playWithPet(p.id);
                    replacePet(updated);
                  }}
                >
                  Play
                </button>
                <button
                  onClick={async () => {
                    const updated = await restPet(p.id);
                    replacePet(updated);
                  }}
                >
                  Rest
                </button>
                {confirmPetId === p.id ? (
                  <ConfirmAction
                    confirmPrompt={`Are you sure you want to delete ${p.name}? This action cannot be undone.`}
                    confirmLabel="Yes, delete"
                    cancelLabel="No, keep"
                    busy={deleteId === p.id}
                    onConfirm={async () => {
                      try {
                        setDeleteId(p.id);
                        await deletePet(p.id);
                        setPets((prev) => prev.filter((x) => x.id !== p.id));
                        notify.success(`${p.name} was deleted.`);
                      } catch (err) {
                        notify.error(err.message || "Failed to delete pet.");
                      } finally {
                        setDeleteId(null);
                        setConfirmPetId(null);
                      }
                    }}
                    onCancel={() => setConfirmPetId(null)}
                  />
                ) : (
                  <button onClick={() => setConfirmPetId(p.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}

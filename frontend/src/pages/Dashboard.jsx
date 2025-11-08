import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPetsByUser,
  getUserProfile,
  feedPet,
  playWithPet,
  restPet,
  deletePet,
  createPet,
} from "../api";
import ConfirmAction from "../components/ConfirmAction";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import StatusBarPixel from "../components/StatusBarPixel";
import { burstConfetti } from "../utils/confetti";

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // {id, username, email}
  const [confirmPetId, setConfirmPetId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [newPet, setNewPet] = useState({ name: "", type: "" });
  const [adopting, setAdopting] = useState(false);

  function replacePet(updated) {
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    Promise.all([getUserProfile(userId), getPetsByUser(userId)])
      .then(([p, list]) => {
        setUserProfile(p);
        setPets(list);
      })
      .catch(console.error);
  }, [userId, navigate]);

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/login");
  }

  async function handleAdopt(e) {
    e.preventDefault();
    if (adopting) return;

    const name = newPet.name.trim();
    const type = newPet.type;
    const uid = Number(userId);

    // basic validation
    const allowed = ["Cat", "Dog", "Dragon"];
    if (!name || !allowed.includes(type) || !uid) return;

    try {
      setAdopting(true);
      const wasFirst = pets.length === 0;

      const saved = await createPet({ name, type, userId: uid });

      // append to state
      setPets((prev) => [...prev, saved]);

      // confetti if this was their first pet 🎉
      if (wasFirst) burstConfetti();

      // Reset form
      setNewPet({ name: "", type: "" });
    } catch (err) {
      console.error("Error adopting pet:", err);
    } finally {
      setAdopting(false);
    }
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

      <form onSubmit={handleAdopt}>
        <h2>Adopt a new pet</h2>

        <input
          placeholder="Pet name"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          required
        />

        <select
          value={newPet.type}
          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          required
        >
          <option value="">Select a pet type</option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Dragon">Dragon</option>
        </select>

        <button disabled={adopting}>
          {adopting ? "Adopting..." : "Adopt 🐾"}
        </button>
      </form>

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
                        <p>Pet deleted successfully!</p>;
                      } catch (error) {
                        <p>Error deleting pet: {error.message}</p>;
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

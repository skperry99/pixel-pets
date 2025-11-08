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

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // {id, username, email}
  const [confirmPetId, setConfirmPetId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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

  const [newPet, setNewPet] = useState({ name: "", type: "" });

  async function handleAdopt(e) {
    e.preventDefault();

    const name = newPet.name.trim();
    const type = newPet.type;
    const uid = Number(userId);

    if (!newPet.name || !newPet.type) return;

    const saved = await createPet({ name, type, userId: uid });

    // Refresh pets
    setPets((prev) => [...prev, saved]);

    // Reset form
    setNewPet({ name: "", type: "" });
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

        <button>Adopt 🐾</button>
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
                    const updatedPet = await feedPet(p.id);
                    setPets((prev) =>
                      prev.map((pet) =>
                        pet.id === updatedPet.id ? updatedPet : pet
                      )
                    );
                  }}
                >
                  Feed
                </button>
                <button
                  onClick={async () => {
                    const updatedPet = await playWithPet(p.id);
                    setPets((prev) =>
                      prev.map((pet) =>
                        pet.id === updatedPet.id ? updatedPet : pet
                      )
                    );
                  }}
                >
                  Play
                </button>
                <button
                  onClick={async () => {
                    const updatedPet = await restPet(p.id);
                    setPets((prev) =>
                      prev.map((pet) =>
                        pet.id === updatedPet.id ? updatedPet : pet
                      )
                    );
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

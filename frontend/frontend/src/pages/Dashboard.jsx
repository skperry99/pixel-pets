import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPetsByUser } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    getPetsByUser(userId)
      .then(setPets)
      .catch((e) => console.error(e));
  }, [userId, navigate]);

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/login");
  }

  const [newPet, setNewPet] = useState({ name: "", type: "" });

  async function handleAdopt(e) {
    e.preventDefault();
    if (!newPet.name || !newPet.type) return;

    await fetch(`${import.meta.env.VITE_API_BASE}/api/pets/adopt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPet.name,
        type: newPet.type,
        userId: userId,
      }),
    });

    // Refresh pets
    const updatedPets = await getPetsByUser(userId);
    setPets(updatedPets);

    // Reset form
    setNewPet({ name: "", type: "" });
  }

  return (
    <div>
      <div>
        <h1>Your Pet Dashboard</h1>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAdopt}
      >
        <h2>Adopt a new pet</h2>

        <input
          placeholder="Pet name"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
        />

        <input
          placeholder="Pet type (dog, cat, dragon...)"
          value={newPet.type}
          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
        />

        <button>
          Adopt 🐾
        </button>
      </form>

      {pets.length === 0 ? (
        <p>No pets yet. Try adopting one!</p>
      ) : (
        <ul>
          {pets.map((p) => (
            <li key={p.id}>
              <div>{p.name}</div>
              <div>{p.type}</div>
              <div>
                Lv {p.level} · Hunger {p.hunger} · Happy {p.happiness} · Energy {p.energy}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

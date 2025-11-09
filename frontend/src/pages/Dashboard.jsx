import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPetsByUser, getUserProfile } from "../api";
import AppLayout from "../components/AppLayout";
import PetSprite from "../components/PetSprite";
import { burstConfetti } from "../utils/confetti";
import AdoptForm from "../components/AdoptForm";
import { useNotice } from "../hooks/useNotice";
import { getStoredUserId, clearStoredUserId } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { notify } = useNotice();

  const userId = getStoredUserId();

  const [pets, setPets] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // {id, username, email}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId == null) {
      navigate("/login");
      return;
    }

    let isActive = true;
    (async () => {
      try {
        const [p, list] = await Promise.all([
          getUserProfile(Number(userId)),
          getPetsByUser(userId),
        ]);
        if (!isActive) return;
        setUserProfile(p);
        setPets(list);
      } catch (err) {
        if (!isActive) return;
        notify.error(err?.message ?? "Failed to load dashboard.");
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [userId, navigate, notify]);

  function handleLogout() {
    clearStoredUserId();
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
        userId={userId}
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
              <Link to={`/pets/${p.id}`}>
                <PetSprite
                  type={p.type}
                  size={120}
                  title={`${p.name} the ${p.type}`}
                />
              </Link>
              <div>{p.name}</div>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}

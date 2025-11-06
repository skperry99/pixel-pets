const BASE = import.meta.env.VITE_API_BASE;

export async function login(username, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Login failed (${res.status})`);
  }
  // backend returns the userId as a number
  return res.json();
}

export async function getPetsByUser(userId) {
  const res = await fetch(`${BASE}/api/pets/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch pets (${res.status})`);
  return res.json();
}
export async function addPet(pet) {
  const res = await fetch(`${BASE}/api/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pet),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Add pet failed (${res.status})`);
  }
  return res.json();  
}

export async function updatePet(petId, updates) {
  const res = await fetch(`${BASE}/api/pets/${petId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Update pet failed (${res.status})`);
  }
  return res.json();
}
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

export async function feedPet(petId) {
  const res = await fetch(`${BASE}/api/pets/${petId}/feed`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to feed pet (${res.status})`);
  return res.json();
}

export async function playWithPet(petId) {
  const res = await fetch(`${BASE}/api/pets/${petId}/play`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to play with pet (${res.status})`);
  return res.json();
}

export async function restPet(petId) {
  const res = await fetch(`${BASE}/api/pets/${petId}/rest`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to rest pet (${res.status})`);
  return res.json();
}

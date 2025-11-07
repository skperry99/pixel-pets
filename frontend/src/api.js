const BASE = import.meta.env.VITE_API_BASE;

export async function login(username, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    let errorMsg = `Login failed (${res.status})`;
    throw new Error(errorMsg);
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

export async function updateUser(id, data) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update user (${res.status})`);
  return res.json();
}

// api/auth.js
export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  const data = await res.json();
  return data.id; // return just the new user ID
}

export async function getUserProfile(userId) {
  const res = await fetch(`${BASE}/api/users/${userId}`);
  if (!res.ok) throw new Error(`Failed to load user profile (${res.status})`);
  return res.json();
}

export async function deletePet(petId) {
  const res = await fetch(`${BASE}/api/pets/${petId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete pet (${res.status})`);
}

export async function deleteUserApi(userId) {
  const res = await fetch(`${BASE}/api/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete user (${res.status})`);
}

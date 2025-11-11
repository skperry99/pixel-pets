// src/api.js
const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

/**
 * Unified request helper.
 * Always resolves to: { ok: boolean, status: number, data?: any, error?: string }
 */
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';
      return { ok: false, status: res.status, error: message, data };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, error: err?.message || 'Network error' };
  }
}

// ---------- Auth ----------
export async function login(username, password) {
  return request(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function registerUser(username, email, password) {
  return request(`/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

// ---------- Users ----------
export async function getUserProfile(userId) {
  return request(`/api/users/${userId}`);
}

export async function updateUser(id, data) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUserApi(userId) {
  return request(`/api/users/${userId}`, { method: 'DELETE' });
}

// ---------- Pets ----------
// NOTE: keeping your exact endpoints
export async function getPetsByUser(userId) {
  return request(`/api/pets/user/${userId}`);
}

export async function getPetById(petId) {
  return request(`/api/pets/${petId}`);
}

export async function createPet(petData) {
  return request(`/api/pets/adopt`, {
    method: 'POST',
    body: JSON.stringify(petData),
  });
}

export async function feedPet(petId) {
  return request(`/api/pets/${petId}/feed`, { method: 'POST' });
}

export async function playWithPet(petId) {
  return request(`/api/pets/${petId}/play`, { method: 'POST' });
}

export async function restPet(petId) {
  return request(`/api/pets/${petId}/rest`, { method: 'POST' });
}

export async function deletePet(petId) {
  return request(`/api/pets/${petId}`, { method: 'DELETE' });
}

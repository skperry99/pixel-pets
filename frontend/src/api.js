// src/api.js

// Base URL for the backend API. Prefer Vite env, fall back to local dev.
const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

/**
 * Unified request helper.
 * Always resolves to:
 *   { ok: boolean, status: number, data?: any, error?: string }
 *
 * - Parses JSON when available.
 * - Derives a friendly error message from JSON body, statusText, or a fallback string.
 */
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';

      return {
        ok: false,
        status: res.status,
        error: message,
        data,
      };
    }

    return {
      ok: true,
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err?.message || 'Network error',
    };
  }
}

// ---------- Auth ----------

/**
 * POST /api/auth/login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ ok: boolean, status: number, data?: number, error?: string }>}
 *          data is the numeric userId when ok === true
 */
export async function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

/**
 * POST /api/auth/register
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: boolean, status: number, data?: number, error?: string }>}
 *          data is the new userId when ok === true
 */
export async function registerUser(username, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

// ---------- Users ----------

/**
 * GET /api/users/:userId
 * Fetch a single user's profile (DTO: { id, username, email }).
 */
export async function getUserProfile(userId) {
  return request(`/api/users/${userId}`);
}

/**
 * PUT /api/users/:id
 * Accepts a partial update object, e.g. { username, email } or { password }.
 */
export async function updateUser(id, data) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/users/:userId
 * Deletes the given user and returns ok/error.
 */
export async function deleteUserApi(userId) {
  return request(`/api/users/${userId}`, { method: 'DELETE' });
}

// ---------- Pets ----------
// NOTE: endpoints match backend PetController exactly

/**
 * GET /api/pets/user/:userId
 * Fetch all pets for a user.
 */
export async function getPetsByUser(userId) {
  return request(`/api/pets/user/${userId}`);
}

/**
 * GET /api/pets/:petId
 * Fetch a single pet by id.
 */
export async function getPetById(petId) {
  return request(`/api/pets/${petId}`);
}

/**
 * POST /api/pets/adopt
 * Adopt a new pet for a user.
 * @param {{ name: string, type: string, userId: number }} petData
 */
export async function createPet(petData) {
  return request('/api/pets/adopt', {
    method: 'POST',
    body: JSON.stringify(petData),
  });
}

/**
 * POST /api/pets/:petId/feed
 * Feed the pet and return updated stats.
 */
export async function feedPet(petId) {
  return request(`/api/pets/${petId}/feed`, { method: 'POST' });
}

/**
 * POST /api/pets/:petId/play
 * Play with the pet and return updated stats.
 */
export async function playWithPet(petId) {
  return request(`/api/pets/${petId}/play`, { method: 'POST' });
}

/**
 * POST /api/pets/:petId/rest
 * Rest the pet and return updated stats.
 */
export async function restPet(petId) {
  return request(`/api/pets/${petId}/rest`, { method: 'POST' });
}

/**
 * DELETE /api/pets/:petId
 * Delete a pet.
 */
export async function deletePet(petId) {
  return request(`/api/pets/${petId}`, { method: 'DELETE' });
}

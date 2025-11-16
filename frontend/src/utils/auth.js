/**
 * Simple localStorage helpers for storing the current user id.
 * - Always stored as a string key "userId"
 * - getStoredUserId() returns a positive number or null
 */

/**
 * Read the current user id from localStorage.
 * @returns {number|null} user id as a number, or null if missing/invalid
 */
export function getStoredUserId() {
  const raw = localStorage.getItem('userId');
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Persist the user id to localStorage.
 * @param {number|string} id – user id to store
 */
export function setStoredUserId(id) {
  localStorage.setItem('userId', String(id));
}

/**
 * Remove the stored user id (used on logout).
 */
export function clearStoredUserId() {
  localStorage.removeItem('userId');
}

export function getStoredUserId() {
  const raw = localStorage.getItem('userId');
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function setStoredUserId(id) {
  localStorage.setItem('userId', String(id));
}

export function clearStoredUserId() {
  localStorage.removeItem('userId');
}

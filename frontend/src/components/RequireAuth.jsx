// src/components/RequireAuth.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUserId } from '../utils/auth';

/**
 * Route guard for authenticated-only pages.
 *
 * - Reads the stored userId from local storage.
 * - If missing/invalid, redirects to /login and preserves the
 *   attempted location in state ({ from }) so you can redirect
 *   back after login if desired.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const rawId = getStoredUserId();
  const userId = Number(rawId);

  // Treat non-numeric, NaN, or <= 0 as "not authenticated"
  if (!Number.isFinite(userId) || userId <= 0) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

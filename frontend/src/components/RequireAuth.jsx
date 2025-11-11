import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUserId } from '../utils/auth';

export default function RequireAuth({ children }) {
  const id = getStoredUserId();
  const loc = useLocation();
  if (id == null) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}

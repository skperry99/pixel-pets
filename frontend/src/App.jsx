// src/App.jsx
// Top-level app routing for Pixel Pets.
// Public routes: Landing, Login, Register
// Protected routes: Dashboard, Settings, PetProfile

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import PetProfile from './pages/PetProfile';
import NotFound from './pages/NotFound';

import ErrorBoundary from './components/ErrorBoundary';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/pets/:petId"
            element={
              <RequireAuth>
                <PetProfile />
              </RequireAuth>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

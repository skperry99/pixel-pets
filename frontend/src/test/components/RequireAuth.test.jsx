import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RequireAuth from '../../components/RequireAuth';

// Mock the auth util so we can control the stored userId
jest.mock('../../utils/auth', () => ({
  getStoredUserId: jest.fn(),
}));

import { getStoredUserId } from '../../utils/auth';

function Protected() {
  return <div>Secret Dashboard</div>;
}

function Login() {
  return <div>Login Page</div>;
}

describe('RequireAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /login when there is no stored user id', () => {
    getStoredUserId.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Protected />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders children when a valid user id exists', () => {
    getStoredUserId.mockReturnValue(42);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Protected />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/secret dashboard/i)).toBeInTheDocument();
  });
});

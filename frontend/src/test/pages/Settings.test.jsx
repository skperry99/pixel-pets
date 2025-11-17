// src/test/pages/Settings.test.jsx
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ---- Mocks ----

const mockGetUserProfile = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUserApi = jest.fn();

jest.mock('../../api', () => ({
  getUserProfile: (...args) => mockGetUserProfile(...args),
  updateUser: (...args) => mockUpdateUser(...args),
  deleteUserApi: (...args) => mockDeleteUserApi(...args),
}));

const mockGetStoredUserId = jest.fn();
const mockClearStoredUserId = jest.fn();

jest.mock('../../utils/auth', () => ({
  getStoredUserId: () => mockGetStoredUserId(),
  clearStoredUserId: () => mockClearStoredUserId(),
}));

const mockNotify = {
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

jest.mock('../../hooks/useNotice', () => ({
  useNotice: () => ({ notify: mockNotify }),
}));

jest.mock('../../components/AppLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="app-layout">{children}</div>,
}));

import Settings from '../../pages/Settings';

function renderWithRouter(ui, initialEntries = ['/settings']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/settings" element={ui} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Settings page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /login when there is no stored user id', async () => {
    mockGetStoredUserId.mockReturnValue(null);

    renderWithRouter(<Settings />, ['/settings']);

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
    expect(mockGetUserProfile).not.toHaveBeenCalled();
  });

  test('loads user profile and shows header with username', async () => {
    mockGetStoredUserId.mockReturnValue(123);
    mockGetUserProfile.mockResolvedValue({
      ok: true,
      data: { username: 'Sarah', email: 'sarah@example.com' },
    });

    renderWithRouter(<Settings />, ['/settings']);

    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Wait for async profile load to populate the form values
    await waitFor(() => {
      expect(usernameInput).toHaveValue('Sarah');
      expect(emailInput).toHaveValue('sarah@example.com');
    });

    expect(screen.getByRole('heading', { level: 1, name: "Sarah's Profile" })).toBeInTheDocument();
  });

  test('shows an error if Update Profile is submitted with empty fields', async () => {
    mockGetStoredUserId.mockReturnValue(999);
    mockGetUserProfile.mockResolvedValue({
      ok: true,
      data: { username: 'PixelUser', email: 'pixel@example.com' },
    });

    renderWithRouter(<Settings />, ['/settings']);

    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /update profile/i }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/username and email are required/i);

    expect(mockNotify.error).toHaveBeenCalledWith(
      expect.stringMatching(/username and email are required/i),
    );
  });
});

// src/test/pages/NotFound.test.jsx
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock AppLayout so we don't bring in NavBar/ThemeToggle/etc.
jest.mock('../../components/AppLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="app-layout">{children}</div>,
}));

// Track confetti calls
const mockBurstConfetti = jest.fn();

jest.mock('../../utils/confetti', () => ({
  burstConfetti: (...args) => mockBurstConfetti(...args),
}));

import NotFound from '../../pages/NotFound';

describe('NotFound page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders 404 message and actions, and fires confetti', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>,
    );

    // Big 404 code
    expect(screen.getByText('404')).toBeInTheDocument();

    // Lead copy
    expect(
      screen.getByText(/this path wandered off the map\. the pixels got lost/i),
    ).toBeInTheDocument();

    // Actions
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();

    // Konami-style ✨ on mount
    expect(mockBurstConfetti).toHaveBeenCalled();
  });
});

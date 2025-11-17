import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingCard from '../../components/LoadingCard';

describe('LoadingCard', () => {
  test('renders default title and loading text', () => {
    render(<LoadingCard />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.getByText(/loading… please wait/i)).toBeInTheDocument();
  });

  test('renders custom title when provided', () => {
    render(<LoadingCard title="Fetching pets…" />);

    expect(screen.getByText('Fetching pets…')).toBeInTheDocument();
  });
});

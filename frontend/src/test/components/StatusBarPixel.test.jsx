// src/components/StatusBarPixel.test.jsx
import { render, screen } from '@testing-library/react';
import StatusBarPixel from '../../components/StatusBarPixel';

describe('StatusBarPixel', () => {
  it('renders label and percentage', () => {
    render(<StatusBarPixel label="Fullness" kind="fullness" value={42} />);

    // visible text
    expect(screen.getByText(/Fullness: 42%/i)).toBeInTheDocument();

    // ARIA progressbar
    const bar = screen.getByRole('progressbar', { name: /Fullness/i });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows low hint when value is below 25', () => {
    render(<StatusBarPixel label="Energy" kind="energy" value={10} />);

    expect(screen.getByText(/low/i)).toBeInTheDocument();
  });
});

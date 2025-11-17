// src/components/Notice.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Notice from '../../components/Notice';

describe('Notice', () => {
  it('renders message text and uses correct role for non-error types', () => {
    render(
      <Notice type="success" autoHideMs={null}>
        Saved successfully!
      </Notice>,
    );

    // success → role="status", aria-live="polite"
    const notice = screen.getByRole('status');
    expect(notice).toBeInTheDocument();
    expect(notice).toHaveTextContent(/saved successfully!/i);
  });

  it('uses role="alert" for error type', () => {
    render(
      <Notice type="error" autoHideMs={null}>
        Something broke.
      </Notice>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/something broke/i);
  });

  it('calls onClose after autoHideMs elapses', () => {
    jest.useFakeTimers();

    const onClose = jest.fn();

    render(
      <Notice type="success" autoHideMs={1000} onClose={onClose}>
        Closing soon…
      </Notice>,
    );

    // Not yet
    jest.advanceTimersByTime(999);
    expect(onClose).not.toHaveBeenCalled();

    // After full delay
    jest.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('pauses auto-hide while hovered', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    const onClose = jest.fn();

    render(
      <Notice type="info" autoHideMs={1000} onClose={onClose}>
        Hover me
      </Notice>,
    );

    const notice = screen.getByRole('status');

    // Hover to pause timer
    await user.hover(notice);

    // Even if time passes, it should NOT close while paused
    jest.advanceTimersByTime(1500);
    expect(onClose).not.toHaveBeenCalled();

    // Unhover so it can resume
    await user.unhover(notice);

    // Let the resumed timer fire
    jest.advanceTimersByTime(1000);
    expect(onClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('closes when Escape key is pressed', () => {
    const onClose = jest.fn();

    render(
      <Notice type="warn" autoHideMs={null} onClose={onClose}>
        Esc to dismiss
      </Notice>,
    );

    // Notice's effect attaches a keydown handler to window
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

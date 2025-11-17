// src/components/NoticeProvider.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoticeProvider } from '../../components/NoticeProvider';
import { useNotice } from '../../hooks/useNotice';

// Helper component that uses the context
function DemoTrigger() {
  const { notify } = useNotice();

  return (
    <button type="button" onClick={() => notify.success('Pixel saved!')}>
      Trigger success toast
    </button>
  );
}

describe('NoticeProvider', () => {
  it('renders children and shows a success toast when notify.success is called', async () => {
    const user = userEvent.setup();

    render(
      <NoticeProvider>
        <DemoTrigger />
      </NoticeProvider>,
    );

    // Child content is rendered
    const trigger = screen.getByRole('button', { name: /trigger success toast/i });
    expect(trigger).toBeInTheDocument();

    // Trigger a toast
    await user.click(trigger);

    // Toast should appear (success → role="status")
    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent(/pixel saved!/i);
  });

  it('deduplicates identical toasts fired in a short window', async () => {
    const user = userEvent.setup();

    render(
      <NoticeProvider>
        <DemoTrigger />
      </NoticeProvider>,
    );

    const trigger = screen.getByRole('button', { name: /trigger success toast/i });

    // Fire the same toast twice quickly (< DEDUPE_WINDOW_MS = 1500)
    await user.click(trigger);
    await user.click(trigger);

    const toasts = await screen.findAllByRole('status');
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toHaveTextContent(/pixel saved!/i);
  });
});

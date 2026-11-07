import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaveProgressDialog from '../components/SaveProgressDialog';
import ReviewPrompt from '../components/ReviewPrompt';

function Harness({ review }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <button>Background action</button>
      {open && (review
        ? <ReviewPrompt conversation={{ title: 'Protein', reviewPolicy: '7d' }} onDismiss={close} onExtend={close} onKeepUntilDeleted={close} onDelete={close} />
        : <SaveProgressDialog onClose={close} onSave={close} />)}
    </>
  );
}

describe.each([['save', false], ['review', true]])('%s dialog keyboard access', (_, review) => {
  test('moves focus inside when opened', async () => {
    render(<Harness review={review} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  test('contains forward and backward Tab navigation', async () => {
    render(<Harness review={review} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('dialog');
    const close = within(dialog).getByRole('button', { name: 'Close' });
    const last = within(dialog).getByRole('button', { name: review ? 'Delete now' : 'Save Progress' });
    last.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  test('Escape dismisses and restores focus to the opener', async () => {
    render(<Harness review={review} />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(opener);
    within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  test('closing with the button restores focus to the opener', async () => {
    render(<Harness review={review} />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(opener);
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }));
    expect(opener).toHaveFocus();
  });
});

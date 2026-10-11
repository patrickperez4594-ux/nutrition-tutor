import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeScreen from '../components/WelcomeScreen';

test('offers personalization and direct chat paths', () => {
  render(<WelcomeScreen onPersonalize={() => {}} onStartChatting={() => {}} onSaved={() => {}} />);
  expect(screen.getByRole('button', { name: /Personalize My Tutor/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Start Chatting/i })).toBeInTheDocument();
});

test('direct chat does not require personalization', async () => {
  const onStartChatting = jest.fn();
  render(<WelcomeScreen onPersonalize={() => {}} onStartChatting={onStartChatting} onSaved={() => {}} />);
  await userEvent.click(screen.getByRole('button', { name: /Start Chatting/i }));
  expect(onStartChatting).toHaveBeenCalledTimes(1);
});

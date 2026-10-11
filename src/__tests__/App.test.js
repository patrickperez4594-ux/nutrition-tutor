import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the AI Nutrition Tutor product entry screen', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Learn nutrition without judgment/i })).toBeInTheDocument();
});

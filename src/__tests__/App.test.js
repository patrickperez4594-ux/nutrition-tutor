import { render, screen } from '@testing-library/react';
import App from '../App';

// Flags are passed explicitly so the result does not depend on a developer's local .env.
test('renders the AI Nutrition Tutor product entry screen', () => {
  render(<App flags={{ kefiShell: false }} />);
  expect(screen.getByRole('heading', { name: /Learn nutrition without judgment/i })).toBeInTheDocument();
});

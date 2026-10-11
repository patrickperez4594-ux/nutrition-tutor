import { render, screen } from '@testing-library/react';
import PrivacyNotice from '../components/PrivacyNotice';

test('explains local saving and AI processing without a HIPAA claim', () => {
  render(<PrivacyNotice />);
  expect(screen.getByText(/saved on this device/i)).toBeInTheDocument();
  expect(screen.getByText(/sent to the AI service/i)).toBeInTheDocument();
  expect(screen.queryByText(/HIPAA compliant/i)).not.toBeInTheDocument();
});

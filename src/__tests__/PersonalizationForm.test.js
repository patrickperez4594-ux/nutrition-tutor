import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalizationForm from '../components/PersonalizationForm';
import { emptyPersonalization, normalizePersonalization } from '../lib/personalization';

test('normalizes optional personalization', () => {
  expect(normalizePersonalization({ goal: '  protein ', learningStyle: 'simple', foodContext: ' vegetarian ' })).toEqual({
    goal: 'protein', learningStyle: 'simple', foodContext: 'vegetarian', otherContext: ''
  });
  expect(emptyPersonalization().goal).toBe('');
});

test('submits one compact page', async () => {
  const onComplete = jest.fn();
  render(<PersonalizationForm onComplete={onComplete} onCancel={() => {}} />);
  await userEvent.click(screen.getByLabelText('Protein'));
  await userEvent.click(screen.getByLabelText('Simple and brief'));
  await userEvent.type(screen.getByLabelText(/Food preferences or restrictions/i), 'Vegetarian');
  await userEvent.click(screen.getByRole('button', { name: /Start My Tutor/i }));
  expect(onComplete).toHaveBeenCalledWith({ goal: 'protein', learningStyle: 'simple', foodContext: 'Vegetarian', otherContext: '' });
});

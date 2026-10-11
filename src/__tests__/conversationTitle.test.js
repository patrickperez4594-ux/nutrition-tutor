import { deriveConversationTitle } from '../lib/conversationTitle';

test('derives a short title from the first user topic', () => {
  expect(deriveConversationTitle([{ role: 'user', content: 'Can you help me understand protein?' }])).toBe('Understand Protein');
});

test('uses a safe fallback', () => {
  expect(deriveConversationTitle([])).toBe('Nutrition Conversation');
});

test('limits titles to 48 characters', () => {
  const title = deriveConversationTitle([{ role: 'user', content: 'I want to understand how to build inexpensive balanced vegetarian meals for a whole week' }]);
  expect(title.length).toBeLessThanOrEqual(48);
});

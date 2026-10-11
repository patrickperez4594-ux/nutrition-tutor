import {
  STORAGE_KEY, deleteConversation, extendReview, isReviewDue, keepUntilDeleted,
  loadSavedConversations, nextReviewAt, renameConversation, saveConversation
} from '../lib/savedConversations';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => data.has(k) ? data.get(k) : null,
    setItem: (k,v) => data.set(k, v),
    removeItem: (k) => data.delete(k)
  };
}

const base = {
  id: 'a', title: 'Protein', messages: [], createdAt: '2026-08-10T00:00:00.000Z',
  updatedAt: '2026-08-10T00:00:00.000Z', reviewPolicy: '7d', reviewAt: '2026-08-17T00:00:00.000Z'
};

test('saves, renames, and deletes one conversation', () => {
  const storage = memoryStorage();
  expect(saveConversation(base, storage).ok).toBe(true);
  expect(loadSavedConversations(storage).conversations).toHaveLength(1);
  expect(renameConversation('a', 'Protein Basics', storage).conversations[0].title).toBe('Protein Basics');
  expect(deleteConversation('a', storage).conversations).toHaveLength(0);
});

test('review date never automatically deletes a conversation', () => {
  const storage = memoryStorage();
  saveConversation(base, storage);
  const loaded = loadSavedConversations(storage);
  expect(loaded.conversations).toHaveLength(1);
  expect(isReviewDue(base, new Date('2026-08-18T00:00:00.000Z'))).toBe(true);
});

test('supports 7 day, 30 day, and indefinite policies', () => {
  const now = new Date('2026-08-10T00:00:00.000Z');
  expect(nextReviewAt('7d', now)).toBe('2026-08-17T00:00:00.000Z');
  expect(nextReviewAt('30d', now)).toBe('2026-09-09T00:00:00.000Z');
  expect(nextReviewAt('indefinite', now)).toBeNull();
  expect(keepUntilDeleted(base, now).reviewAt).toBeNull();
  expect(extendReview(base, now).reviewAt).toBe('2026-08-17T00:00:00.000Z');
});

test('corrupt storage fails safely', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, '{bad json');
  expect(loadSavedConversations(storage).ok).toBe(false);
});

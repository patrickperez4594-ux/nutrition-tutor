export const STORAGE_KEY = 'nutritionTutor.savedConversations.v1';
const DAY_MS = 24 * 60 * 60 * 1000;

function failure(error = 'Saved progress is unavailable in this browser.') {
  return { ok: false, conversations: [], error };
}

export function nextReviewAt(policy, now = new Date()) {
  if (policy === 'indefinite') return null;
  const days = policy === '7d' ? 7 : policy === '30d' ? 30 : null;
  return days ? new Date(now.getTime() + days * DAY_MS).toISOString() : null;
}

export function loadSavedConversations(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, conversations: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return failure();
    return { ok: true, conversations: parsed };
  } catch (_) {
    return failure();
  }
}

function write(conversations, storage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return { ok: true, conversations };
  } catch (_) {
    return failure();
  }
}

export function saveConversation(conversation, storage = window.localStorage) {
  const loaded = loadSavedConversations(storage);
  if (!loaded.ok) return loaded;
  const rest = loaded.conversations.filter((item) => item.id !== conversation.id);
  return write([conversation, ...rest], storage);
}

export function renameConversation(id, title, storage = window.localStorage) {
  const loaded = loadSavedConversations(storage);
  if (!loaded.ok) return loaded;
  const clean = String(title || '').trim().slice(0, 60);
  if (!clean) return { ok: false, conversations: loaded.conversations, error: 'Please enter a title.' };
  const updated = loaded.conversations.map((item) => item.id === id ? { ...item, title: clean, updatedAt: new Date().toISOString() } : item);
  return write(updated, storage);
}

export function deleteConversation(id, storage = window.localStorage) {
  const loaded = loadSavedConversations(storage);
  if (!loaded.ok) return loaded;
  return write(loaded.conversations.filter((item) => item.id !== id), storage);
}

export function isReviewDue(conversation, now = new Date()) {
  return Boolean(conversation?.reviewAt && new Date(conversation.reviewAt).getTime() <= now.getTime());
}

export function extendReview(conversation, now = new Date()) {
  return { ...conversation, reviewAt: nextReviewAt(conversation.reviewPolicy, now), updatedAt: now.toISOString() };
}

export function keepUntilDeleted(conversation, now = new Date()) {
  return { ...conversation, reviewPolicy: 'indefinite', reviewAt: null, updatedAt: now.toISOString() };
}

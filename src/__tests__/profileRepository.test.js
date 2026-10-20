import { normalizeProfile } from '../domain/profile';
import { PROFILE_STORAGE_KEY, clearProfile, loadProfile, saveProfile } from '../repositories/profileRepository';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    _data: data
  };
}

function brokenStorage() {
  return {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); }
  };
}

test('does not write anything unless the user opted in', () => {
  const storage = memoryStorage();
  const result = saveProfile(normalizeProfile({ goals: { intents: ['protein'] } }), storage);
  expect(result).toEqual({ ok: true, persisted: false });
  expect(storage._data.size).toBe(0);
});

test('persists and reloads when remember-on-device is chosen', () => {
  const storage = memoryStorage();
  const profile = normalizeProfile({
    goals: { intents: ['protein'] },
    restrictions: [{ id: 'a', label: 'peanuts', kind: 'allergy' }],
    privacy: { rememberOnDevice: true }
  });
  expect(saveProfile(profile, storage)).toEqual({ ok: true, persisted: true });
  const loaded = loadProfile(storage);
  expect(loaded.ok).toBe(true);
  expect(loaded.profile).toEqual(profile);
});

test('turning remember off deletes the stored copy', () => {
  const storage = memoryStorage();
  const remembered = normalizeProfile({ privacy: { rememberOnDevice: true } });
  saveProfile(remembered, storage);
  expect(storage._data.has(PROFILE_STORAGE_KEY)).toBe(true);
  saveProfile({ ...remembered, privacy: { rememberOnDevice: false } }, storage);
  expect(storage._data.has(PROFILE_STORAGE_KEY)).toBe(false);
});

test('missing storage entry loads as no profile', () => {
  expect(loadProfile(memoryStorage())).toEqual({ ok: true, profile: null });
});

test('corrupt or blocked storage fails safely without throwing', () => {
  const storage = memoryStorage();
  storage.setItem(PROFILE_STORAGE_KEY, '{not json');
  expect(loadProfile(storage).ok).toBe(false);
  expect(loadProfile(brokenStorage()).ok).toBe(false);
  expect(saveProfile(normalizeProfile({ privacy: { rememberOnDevice: true } }), brokenStorage()).ok).toBe(false);
  expect(clearProfile(brokenStorage()).ok).toBe(false);
});

test('stored data is normalized on load', () => {
  const storage = memoryStorage();
  storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ learning: { teachingStyle: 'yell' }, restrictions: [{ label: 'soy', kind: '??' }] }));
  const { profile } = loadProfile(storage);
  expect(profile.learning.teachingStyle).toBe('auto');
  expect(profile.restrictions[0]).toMatchObject({ label: 'soy', kind: 'allergy' });
  expect(profile.privacy.rememberOnDevice).toBe(true);
});

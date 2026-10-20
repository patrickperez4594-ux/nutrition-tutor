import { normalizeProfile } from '../domain/profile';

export const PROFILE_STORAGE_KEY = 'kefi.profile.v1';
const UNAVAILABLE = 'Kefi could not save to this device. Your current session still works.';

function defaultStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function loadProfile(storage = defaultStorage()) {
  try {
    const raw = storage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ok: true, profile: null };
    const profile = normalizeProfile(JSON.parse(raw));
    // A stored copy only exists because the user opted in; keep that choice explicit after load.
    return { ok: true, profile: { ...profile, privacy: { rememberOnDevice: true } } };
  } catch (_) {
    return { ok: false, profile: null, error: UNAVAILABLE };
  }
}

export function clearProfile(storage = defaultStorage()) {
  try {
    storage.removeItem(PROFILE_STORAGE_KEY);
    return { ok: true };
  } catch (_) {
    return { ok: false, error: UNAVAILABLE };
  }
}

// Writes only when the user chose "Remember on this device". Otherwise any previously stored
// copy is removed so the device never holds preferences the user no longer wants remembered.
export function saveProfile(profile, storage = defaultStorage()) {
  const normalized = normalizeProfile(profile);
  if (!normalized.privacy.rememberOnDevice) {
    const cleared = clearProfile(storage);
    return { ...cleared, persisted: false };
  }
  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
    return { ok: true, persisted: true };
  } catch (_) {
    return { ok: false, persisted: false, error: UNAVAILABLE };
  }
}

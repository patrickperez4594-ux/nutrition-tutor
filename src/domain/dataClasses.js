export const DATA_CLASS = Object.freeze({
  TEMPORARY_SESSION: 'temporary_session',
  LOCAL_SAVED: 'local_saved',
  AI_PROCESSING: 'ai_processing',
  EXPLICITLY_RETAINED: 'explicitly_retained'
});

export function isPersistentDataClass(value) {
  return value === DATA_CLASS.LOCAL_SAVED || value === DATA_CLASS.EXPLICITLY_RETAINED;
}

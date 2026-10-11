import { DATA_CLASS, isPersistentDataClass } from '../domain/dataClasses';

test('defines the four approved Kefi data classes', () => {
  expect(DATA_CLASS).toEqual({
    TEMPORARY_SESSION: 'temporary_session',
    LOCAL_SAVED: 'local_saved',
    AI_PROCESSING: 'ai_processing',
    EXPLICITLY_RETAINED: 'explicitly_retained'
  });
});

test('only saved/retained classes are persistent', () => {
  expect(isPersistentDataClass(DATA_CLASS.TEMPORARY_SESSION)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.AI_PROCESSING)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.LOCAL_SAVED)).toBe(true);
  expect(isPersistentDataClass(DATA_CLASS.EXPLICITLY_RETAINED)).toBe(true);
});

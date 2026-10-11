const { describeError } = require('../safeError');

test('describes provider errors by status, code, and type only', () => {
  const error = Object.assign(new Error('429 You have no credits remaining for org-secret.'), {
    status: 429,
    code: 'insufficient_quota',
    type: 'insufficient_quota'
  });
  expect(describeError(error)).toBe('status=429 code=insufficient_quota type=insufficient_quota');
});

test('never includes the error message', () => {
  expect(describeError(new Error('Incorrect API key provided: sk-abc****wxyz'))).toBe('unclassified error');
});

test('drops code or type values that are not simple tokens', () => {
  const error = { status: 401, code: 'sk-fake', type: 'see https://example.com/key=sk-fake' };
  expect(describeError(error)).toBe('status=401');
});

test('ignores out-of-range statuses and non-error values', () => {
  expect(describeError({ status: 'sk-abc' })).toBe('unclassified error');
  expect(describeError(null)).toBe('unclassified error');
  expect(describeError('sk-fake')).toBe('unclassified error');
});

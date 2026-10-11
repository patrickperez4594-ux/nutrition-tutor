// Provider error messages can echo request details, including masked API-key
// fragments. Only allowlisted structured fields are ever logged.
const SAFE_TOKEN = /^[a-z_]{1,64}$/;

function safeToken(value) {
  return typeof value === 'string' && SAFE_TOKEN.test(value) ? value : null;
}

function describeError(error) {
  const parts = [];
  const status = Number(error?.status);
  if (Number.isInteger(status) && status >= 100 && status <= 599) parts.push(`status=${status}`);
  const code = safeToken(error?.code);
  if (code) parts.push(`code=${code}`);
  const type = safeToken(error?.type);
  if (type) parts.push(`type=${type}`);
  return parts.length ? parts.join(' ') : 'unclassified error';
}

module.exports = { describeError };

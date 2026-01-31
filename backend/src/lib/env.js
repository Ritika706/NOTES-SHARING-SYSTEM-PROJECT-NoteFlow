function envBool(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw == null) return defaultValue;

  const v = String(raw).trim().toLowerCase();
  if (!v) return defaultValue;

  if (['1', 'true', 'yes', 'y', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(v)) return false;

  return defaultValue;
}

function envString(name, defaultValue = '') {
  const raw = process.env[name];
  if (raw == null) return defaultValue;
  const v = String(raw).trim();
  return v || defaultValue;
}

module.exports = { envBool, envString };

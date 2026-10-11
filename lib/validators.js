const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 6;

export function clean(value, max = 300) {
  return String(value ?? '').trim().slice(0, max);
}

export function normalizeEmail(email) {
  return clean(email, 254).toLowerCase();
}

export function isValidEmail(email) {
  return EMAIL_RE.test(email);
}

/** Accepts 10-digit Indian mobile numbers, optionally prefixed with +91 / 0, spaces or dashes allowed. */
export function normalizePhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

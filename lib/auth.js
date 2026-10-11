import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env');
}

export const AUTH_COOKIE = 'yutira_token';

export function signJwt(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function sha256(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

/** Constant-time string comparison (avoids leaking the admin password via timing). */
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function getAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds
  };
}

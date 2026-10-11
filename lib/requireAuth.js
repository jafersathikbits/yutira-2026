import { cookies } from 'next/headers';
import { verifyJwt, AUTH_COOKIE } from '@/lib/auth';

export function getAuthPayload() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function requireAuth() {
  const payload = getAuthPayload();
  if (!payload) throw httpError('Unauthorized', 401);
  return payload;
}

/** A logged-in participant (not the admin account, whose `sub` is an email, not a user id). */
export function requireUser() {
  const payload = requireAuth();
  if (payload.role !== 'user') throw httpError('This action is only available to participants.', 403);
  return payload;
}

export function requireAdmin() {
  const payload = requireAuth();
  if (payload.role !== 'admin') throw httpError('Forbidden', 403);
  return payload;
}

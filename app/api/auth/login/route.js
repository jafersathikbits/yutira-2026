import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signJwt, getAuthCookieOptions, safeEqual, AUTH_COOKIE } from '@/lib/auth';
import { withErrors, readJson, jsonError } from '@/lib/api';
import { normalizeEmail } from '@/lib/validators';

const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

export const POST = withErrors(async (req) => {
  const { email, password } = await readJson(req);
  if (!email || !password || typeof password !== 'string') {
    return jsonError('Email and password are required');
  }

  const emailLower = normalizeEmail(email);

  // Admin shortcut (single admin login)
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  if (adminEmail && adminPassword && emailLower === adminEmail && safeEqual(password, adminPassword)) {
    const token = signJwt({ sub: adminEmail, role: 'admin' }, '12h');
    // Cookie lifetime matches the 12h token, so the browser doesn't keep a dead cookie for 7 days.
    cookies().set(AUTH_COOKIE, token, getAuthCookieOptions(ADMIN_SESSION_SECONDS));
    return NextResponse.json({ ok: true, role: 'admin' });
  }

  await dbConnect();

  const user = await User.findOne({ email: emailLower }).select('passwordHash emailVerified').lean();
  // Check the password before revealing verification status, so unknown users can't probe accounts.
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!ok) return jsonError('Invalid email or password', 401);
  if (!user.emailVerified) {
    return jsonError('Please verify your email before logging in. Check your inbox (and spam folder).', 403);
  }

  const token = signJwt({ sub: user._id.toString(), role: 'user' }, '7d');
  cookies().set(AUTH_COOKIE, token, getAuthCookieOptions());

  return NextResponse.json({ ok: true, role: 'user' });
});

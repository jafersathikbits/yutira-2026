import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sha256 } from '@/lib/auth';
import { withErrors, readJson, jsonError } from '@/lib/api';
import { MIN_PASSWORD_LENGTH } from '@/lib/validators';

export const POST = withErrors(async (req) => {
  const { token, password } = await readJson(req);
  if (!token || !password || typeof password !== 'string') {
    return jsonError('Missing token or password');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return jsonError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  await dbConnect();

  const user = await User.findOne({
    resetTokenHash: sha256(token),
    resetTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) return jsonError('This reset link is invalid or has expired. Please request a new one.');

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  return NextResponse.json({ ok: true });
});

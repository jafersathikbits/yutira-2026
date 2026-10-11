import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthPayload } from '@/lib/requireAuth';
import { withErrors, jsonError, isValidObjectId } from '@/lib/api';
import { PUBLIC_USER_FIELDS, toPublicUser } from '@/lib/publicUser';

// Per-user data: never pre-render or cache.
export const dynamic = 'force-dynamic';

export const GET = withErrors(async () => {
  const payload = getAuthPayload();
  if (!payload) return jsonError('Unauthorized', 401);

  if (payload.role === 'admin') {
    return NextResponse.json({ role: 'admin', email: payload.sub });
  }

  if (!isValidObjectId(payload.sub)) return jsonError('Unauthorized', 401);

  await dbConnect();

  const user = await User.findById(payload.sub).select(PUBLIC_USER_FIELDS).lean();
  if (!user) return jsonError('User not found', 404);

  return NextResponse.json({ role: 'user', ...toPublicUser(user) });
});

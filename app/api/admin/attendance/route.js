import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/requireAuth';
import { withErrors, readJson, jsonError, isValidObjectId } from '@/lib/api';
import { PUBLIC_USER_FIELDS, toPublicUser } from '@/lib/publicUser';

export const POST = withErrors(async (req) => {
  requireAdmin();
  const { userId, day, value } = await readJson(req);
  if (!isValidObjectId(userId) || !['day1', 'day2'].includes(day)) {
    return jsonError('Invalid request');
  }

  await dbConnect();

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { [`attendance.${day}`]: !!value } },
    { new: true, projection: PUBLIC_USER_FIELDS }
  ).lean();
  if (!user) return jsonError('Participant not found', 404);

  return NextResponse.json({ ok: true, user: toPublicUser(user) });
});

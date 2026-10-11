import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import User from '@/models/User';
import { requireUser } from '@/lib/requireAuth';
import { withErrors, jsonError } from '@/lib/api';
import { toPublicPaper } from '@/lib/publicUser';

// Per-user data: never pre-render or cache.
export const dynamic = 'force-dynamic';

export const GET = withErrors(async () => {
  const payload = requireUser();

  await dbConnect();

  const user = await User.findById(payload.sub).select('yutiraId').lean();
  if (!user) return jsonError('User not found', 404);

  const paper = user.yutiraId ? await PaperSubmission.findOne({ yutiraId: user.yutiraId }).lean() : null;

  // 200 with `paper: null` instead of a 404, so "no submission yet" isn't treated as an error.
  return NextResponse.json({ paper: toPublicPaper(paper) });
});

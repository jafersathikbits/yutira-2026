import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';
import { withErrors } from '@/lib/api';
import { PUBLIC_USER_FIELDS, toPublicUser, toPublicPaper } from '@/lib/publicUser';

// Per-user data: never pre-render or cache.
export const dynamic = 'force-dynamic';

export const GET = withErrors(async (req) => {
  requireAdmin();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().slice(0, 100);

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  await dbConnect();

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const users = await User.find({
    $or: [{ yutiraId: regex }, { name: regex }, { email: regex }, { phone: regex }]
  })
    .select(PUBLIC_USER_FIELDS)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // One query for all matching papers instead of one per participant.
  const ids = users.map((u) => u.yutiraId).filter(Boolean);
  const papers = ids.length ? await PaperSubmission.find({ yutiraId: { $in: ids } }).lean() : [];
  const paperById = new Map(papers.map((p) => [p.yutiraId, toPublicPaper(p)]));

  const results = users.map((u) => ({ ...toPublicUser(u), paper: paperById.get(u.yutiraId) || null }));

  return NextResponse.json({ results });
});

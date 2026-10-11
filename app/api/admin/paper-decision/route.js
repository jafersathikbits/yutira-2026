import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';
import { withErrors, readJson, jsonError } from '@/lib/api';
import { clean } from '@/lib/validators';
import { toPublicPaper } from '@/lib/publicUser';

export const POST = withErrors(async (req) => {
  requireAdmin();
  const { yutiraId, status, remarks } = await readJson(req);

  if (!yutiraId || typeof yutiraId !== 'string' || !['submitted', 'accepted', 'rejected'].includes(status)) {
    return jsonError('Invalid request');
  }

  await dbConnect();

  const paper = await PaperSubmission.findOneAndUpdate(
    { yutiraId },
    { $set: { status, remarks: clean(remarks, 1000) } },
    { new: true }
  ).lean();

  if (!paper) return jsonError('No submission found for this YUTIRA ID', 404);

  return NextResponse.json({ ok: true, paper: toPublicPaper(paper) });
});

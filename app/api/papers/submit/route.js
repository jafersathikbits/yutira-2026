import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import User from '@/models/User';
import { requireUser } from '@/lib/requireAuth';
import { paperPresentation } from '@/lib/data';
import { withErrors, readJson, jsonError } from '@/lib/api';
import { clean, isHttpUrl } from '@/lib/validators';
import { toPublicPaper } from '@/lib/publicUser';

export const POST = withErrors(async (req) => {
  const payload = requireUser();
  const body = await readJson(req);
  const title = clean(body.title, 300);
  const degree = clean(body.degree, 120);
  const yearOfStudy = clean(body.yearOfStudy, 10);
  const otherAuthors = clean(body.otherAuthors, 1000);
  const pdfUrl = clean(body.pdfUrl, 1000);

  if (!title || !degree || !yearOfStudy || !otherAuthors || !pdfUrl) {
    return jsonError('Missing fields');
  }
  if (!isHttpUrl(pdfUrl)) {
    return jsonError('Please paste a valid link starting with https:// (e.g. a Google Drive share link).');
  }

  // Deadline check
  if (Date.now() > new Date(paperPresentation.deadlineISO).getTime()) {
    return jsonError('Abstract submission deadline has passed.', 403);
  }

  await dbConnect();

  const user = await User.findById(payload.sub).select('yutiraId email name').lean();
  if (!user) return jsonError('User not found', 404);

  if (!user.yutiraId) return jsonError('Your YUTIRA ID is not generated yet.');

  const existing = await PaperSubmission.findOne({ yutiraId: user.yutiraId }).select('status').lean();
  if (existing && existing.status !== 'submitted') {
    return jsonError(`Your abstract has already been ${existing.status}. Contact the organisers to make changes.`, 409);
  }

  const saved = await PaperSubmission.findOneAndUpdate(
    { yutiraId: user.yutiraId },
    {
      $set: {
        userEmail: user.email,
        userName: user.name,
        title,
        degree,
        yearOfStudy,
        otherAuthors,
        pdfUrl,
        status: 'submitted'
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json({ paper: toPublicPaper(saved) });
});

import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';
import { withErrors } from '@/lib/api';
import { PUBLIC_USER_FIELDS } from '@/lib/publicUser';

// Per-user data: never pre-render or cache.
export const dynamic = 'force-dynamic';

// Prevent spreadsheet formula injection: cells starting with = + - @ are executed by Excel.
function safeCell(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  const s = String(value);
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

export const GET = withErrors(async () => {
  requireAdmin();
  await dbConnect();

  const [users, papers] = await Promise.all([
    User.find({}).select(PUBLIC_USER_FIELDS).sort({ createdAt: -1 }).lean(),
    PaperSubmission.find({}).select('yutiraId title status pdfUrl').lean()
  ]);
  const paperById = new Map(papers.map((p) => [p.yutiraId, p]));

  const records = users.map((u) => {
    const paper = paperById.get(u.yutiraId);
    return {
      yutiraId: u.yutiraId || '',
      name: u.name,
      email: u.email,
      phone: u.phone,
      college: u.college,
      department: u.department,
      year: u.year,
      isPSG: !!u.isPSG,
      emailVerified: !!u.emailVerified,
      generalSelected: !!u.general?.selected,
      generalPayment: u.general?.paymentStatus,
      workshopSelected: !!u.workshop?.selected,
      workshopPayment: u.workshop?.paymentStatus,
      attendanceDay1: !!u.attendance?.day1,
      attendanceDay2: !!u.attendance?.day2,
      paperTitle: paper?.title || '',
      paperStatus: paper?.status || '',
      paperPdfUrl: paper?.pdfUrl || '',
      createdAt: u.createdAt
    };
  });

  const csv = stringify(records, { header: true, cast: { string: safeCell, date: safeCell, boolean: (v) => (v ? 'Yes' : 'No') } });
  const stamp = new Date().toISOString().slice(0, 10);

  // BOM so Excel opens UTF-8 names correctly.
  return new NextResponse('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="yutira-registrations-${stamp}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
});

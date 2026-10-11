import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sha256 } from '@/lib/auth';
import { assignYutiraId } from '@/lib/yutiraIdGenerator';
import { sendMail, h2, p, button, small, escapeHtml, linkText } from '@/lib/mailer';
import { PAYMENT_LINK } from '@/lib/data';

// Per-user data: never pre-render or cache.
export const dynamic = 'force-dynamic';

function redirectTo(req, verified) {
  return NextResponse.redirect(new URL(`/login?verified=${verified}`, req.url));
}

export async function GET(req) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return redirectTo(req, 0);

  try {
    await dbConnect();

    const user = await User.findOne({
      verificationTokenHash: sha256(token),
      verificationTokenExpiresAt: { $gt: new Date() }
    });

    if (!user) return redirectTo(req, 0);
    if (user.emailVerified) return redirectTo(req, 1);

    user.emailVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpiresAt = undefined;

    if (user.yutiraId) {
      await user.save();
    } else {
      await assignYutiraId(user);
    }

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const contentHtml =
      h2('Registration verified — your YUTIRA ID is ready') +
      p(`Hi <b>${escapeHtml(user.name)}</b>,`) +
      p(`Your YUTIRA ID: <b>${escapeHtml(user.yutiraId)}</b>`) +
      p('Payment link (as per instructions):') +
      button(PAYMENT_LINK, 'Open Payment Link') +
      p('<b>Important:</b> Fill the same <b>Name</b> and <b>Mobile number</b> that you used for registration while paying.') +
      small(`After payment, it will be verified manually by the faculty advisor. You can login anytime at ${linkText(`${baseUrl}/login`)}.`);

    try {
      await sendMail({
        to: user.email,
        subject: 'Yutira 2026 — Registration verified (YUTIRA ID inside)',
        title: 'Registration Verified',
        preheader: 'Your YUTIRA ID and payment link',
        contentHtml
      });
    } catch (e) {
      console.error(e);
    }

    return redirectTo(req, 1);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/login?verified=error', req.url));
  }
}

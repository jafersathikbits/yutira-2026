import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { makeToken, sha256 } from '@/lib/auth';
import { sendMail, button, h2, p, small, escapeHtml } from '@/lib/mailer';
import { psgEmailSuffix, REGISTRATION_CLOSE_ISO } from '@/lib/data';
import { withErrors, readJson, jsonError } from '@/lib/api';
import {
  clean,
  normalizeEmail,
  isValidEmail,
  normalizePhone,
  isValidPhone,
  MIN_PASSWORD_LENGTH
} from '@/lib/validators';

const VERIFY_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export const POST = withErrors(async (req) => {
  if (Date.now() > new Date(REGISTRATION_CLOSE_ISO).getTime()) {
    return jsonError('Registrations are closed (after 26 March 2026).', 403);
  }

  const body = await readJson(req);
  const name = clean(body.name, 120);
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const college = clean(body.college, 300);
  const department = clean(body.department, 120);
  const year = clean(body.year, 10);
  const password = typeof body.password === 'string' ? body.password : '';
  const general = !!body.general;
  const workshop = !!body.workshop;

  if (!name || !email || !phone || !college || !department || !year || !password) {
    return jsonError('Missing required fields');
  }
  if (!isValidEmail(email)) return jsonError('Please enter a valid email address.');
  if (!isValidPhone(phone)) return jsonError('Please enter a valid 10-digit mobile number.');
  if (password.length < MIN_PASSWORD_LENGTH) {
    return jsonError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!general && !workshop) {
    return jsonError('Select at least one: General registration and/or Workshop');
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing?.emailVerified) {
    return jsonError('Email already registered. Please login or reset password.', 409);
  }

  const token = makeToken();
  const verification = {
    verificationTokenHash: sha256(token),
    verificationTokenExpiresAt: new Date(Date.now() + VERIFY_TTL_MS)
  };

  let user;
  if (existing) {
    // Registered before but never verified (e.g. the email was lost or the link expired):
    // send a fresh link. Details/password are NOT overwritten, so nobody can hijack
    // an unverified account by re-registering with its email.
    existing.set(verification);
    user = await existing.save();
  } else {
    try {
      user = await User.create({
        name,
        email,
        phone,
        college,
        department,
        year,
        isPSG: email.endsWith(psgEmailSuffix),
        passwordHash: await bcrypt.hash(password, 10),
        general: { selected: general },
        workshop: { selected: workshop },
        ...verification,
        emailVerified: false
      });
    } catch (err) {
      if (err?.code === 11000) {
        return jsonError('Email already registered. Please login or reset password.', 409);
      }
      throw err;
    }
  }

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  const contentHtml =
    h2('Verify your email to complete registration') +
    p(`Hi <b>${escapeHtml(user.name)}</b>,`) +
    p('Please verify your email to complete your Yutira 2026 registration. After verification, you will receive your YUTIRA ID and the payment link.') +
    button(verifyUrl, 'Verify Email') +
    small('This link expires in 24 hours.');

  try {
    await sendMail({
      to: user.email,
      subject: 'Yutira 2026 — Verify your email',
      title: 'Verify your email',
      preheader: 'Complete your Yutira 2026 registration',
      contentHtml
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      ok: true,
      emailSent: false,
      message: 'Registered, but we could not send the verification email. Please try registering again in a few minutes or contact the organisers.'
    });
  }

  if (existing) {
    return NextResponse.json({
      ok: true,
      emailSent: true,
      resent: true,
      message:
        'This email was already registered but not verified. We have sent a fresh verification link. Use the password you chose the first time (or reset it from the login page).'
    });
  }

  return NextResponse.json({ ok: true, emailSent: true });
});

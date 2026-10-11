import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE, getAuthCookieOptions } from '@/lib/auth';

export async function POST() {
  cookies().set(AUTH_COOKIE, '', getAuthCookieOptions(0));
  return NextResponse.json({ ok: true });
}

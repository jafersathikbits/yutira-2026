'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import PasswordInput from '@/components/PasswordInput';
import { api } from '@/lib/http';

const verifiedMessages = {
  1: { type: 'success', text: 'Email verified! Your YUTIRA ID and payment link have been emailed to you. Log in to view your dashboard.' },
  0: { type: 'error', text: 'This verification link is invalid or has expired. If you already verified, just log in. Otherwise register again with the same email to get a fresh link.' },
  error: { type: 'error', text: 'We could not verify your email right now. Please try the link again in a few minutes.' }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show the result of the email-verification redirect (/login?verified=1|0|error).
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('verified');
    if (v !== null && verifiedMessages[v]) {
      setStatus({ type: verifiedMessages[v].type, message: verifiedMessages[v].text });
    }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
      setLoading(false);
    }
  }

  return (
    <Section title="Login" subtitle="PSG students can login using their college mail. Others can login using registered email.">
      <div className="card p-6 md:p-8 max-w-xl">
        {status ? (
          <Alert type={status.type} className="mb-5">
            {status.message}
          </Alert>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label">
                Password
              </label>
              <Link className="text-xs text-white/60 hover:text-gold" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p className="text-sm text-white/70 text-center">
            New here?{' '}
            <Link className="link" href="/register">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </Section>
  );
}

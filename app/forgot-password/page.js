'use client';

import { useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import { api } from '@/lib/http';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
      setStatus({ type: 'success', message: 'If the email exists, a reset link has been sent. It expires in 30 minutes.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section title="Forgot Password" subtitle="Enter your registered email and we'll send you a reset link.">
      <div className="card p-6 md:p-8 max-w-xl">
        {status ? (
          <Alert type={status.type} className="mb-5">
            {status.message}
          </Alert>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Registered email
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

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
          <p className="text-sm text-center">
            <Link className="link text-white/70" href="/login">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </Section>
  );
}

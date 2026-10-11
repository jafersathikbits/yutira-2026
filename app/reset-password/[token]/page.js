'use client';

import { useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import PasswordInput from '@/components/PasswordInput';
import { api } from '@/lib/http';

export default function ResetPasswordPage({ params }) {
  const token = params.token;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api('/api/auth/reset-password', { method: 'POST', body: { token, password } });
      setDone(true);
      setStatus({ type: 'success', message: 'Password updated. You can login now.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section title="Reset Password">
      <div className="card p-6 md:p-8 max-w-xl">
        {status ? (
          <Alert type={status.type} className="mb-5">
            {status.message}
          </Alert>
        ) : null}

        {done ? (
          <Link href="/login" className="btn-primary w-full">
            Go to login
          </Link>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="label">
                New password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-white/50">At least 6 characters.</p>
            </div>
            <div>
              <label htmlFor="confirm" className="label">
                Confirm new password
              </label>
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

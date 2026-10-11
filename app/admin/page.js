'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import StatusBadge from '@/components/StatusBadge';
import { api, logout } from '@/lib/http';

function Toggle({ on, onLabel, offLabel, busy, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-white/15 p-0.5 text-xs" role="group">
      <button
        type="button"
        disabled={busy || on}
        onClick={() => onChange(true)}
        aria-pressed={on}
        className={`px-2.5 py-1 rounded-md transition ${on ? 'bg-green-500/25 text-green-100' : 'text-white/70 hover:bg-white/10'}`}
      >
        {onLabel}
      </button>
      <button
        type="button"
        disabled={busy || !on}
        onClick={() => onChange(false)}
        aria-pressed={!on}
        className={`px-2.5 py-1 rounded-md transition ${!on ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'}`}
      >
        {offLabel}
      </button>
    </div>
  );
}

function ParticipantCard({ user, onChange, notify }) {
  const [busy, setBusy] = useState(false);

  async function run(fn) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      notify({ type: 'error', message: e.message });
    } finally {
      setBusy(false);
    }
  }

  const setPayment = (kind, paid) =>
    run(async () => {
      const { user: updated } = await api('/api/admin/payment', { method: 'POST', body: { userId: user._id, kind, paid } });
      onChange({ ...updated, paper: user.paper });
      notify({ type: 'success', message: `${user.name}: ${kind} payment marked ${paid ? 'paid' : 'pending'}.` });
    });

  const setAttendance = (day, value) =>
    run(async () => {
      const { user: updated } = await api('/api/admin/attendance', { method: 'POST', body: { userId: user._id, day, value } });
      onChange({ ...updated, paper: user.paper });
      notify({ type: 'success', message: `${user.name}: ${day === 'day1' ? 'Day 1' : 'Day 2'} ${value ? 'marked' : 'unmarked'}.` });
    });

  const decidePaper = (status) =>
    run(async () => {
      const remarks = window.prompt('Remarks (optional):', user.paper?.remarks || '');
      if (remarks === null) return; // cancelled
      const { paper } = await api('/api/admin/paper-decision', {
        method: 'POST',
        body: { yutiraId: user.yutiraId, status, remarks }
      });
      onChange({ ...user, paper });
      notify({ type: 'success', message: `${user.name}: paper ${status === 'submitted' ? 'reset' : status}.` });
    });

  const payments = [
    ['general', 'General', user.general],
    ['workshop', 'Workshop', user.workshop]
  ];

  return (
    <article className={`card p-5 ${busy ? 'opacity-70' : ''}`} aria-busy={busy}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{user.name}</h3>
            <span className="chip border-gold/30 bg-gold/10 text-gold-soft">{user.yutiraId || 'No ID yet'}</span>
            {!user.emailVerified ? <span className="chip border-red-400/30 bg-red-500/10 text-red-100">Email not verified</span> : null}
            {user.isPSG ? <span className="chip border-white/15 bg-white/5 text-white/70">PSG</span> : null}
          </div>
          <div className="mt-1 text-sm text-white/70 break-words">
            <a className="hover:text-gold" href={`mailto:${user.email}`}>{user.email}</a> •{' '}
            <a className="hover:text-gold" href={`tel:${user.phone}`}>{user.phone}</a>
          </div>
          <div className="text-sm text-white/60 break-words">{user.college}</div>
          <div className="text-sm text-white/60">
            {user.department} • Year {user.year}
          </div>
        </div>
        <div className="text-xs text-white/50 shrink-0">Registered {new Date(user.createdAt).toLocaleString('en-IN')}</div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="font-semibold">Payment</div>
          {payments.map(([kind, label, p]) => (
            <div key={kind} className="mt-3 flex items-center justify-between gap-2">
              <span className={p?.selected ? '' : 'text-white/40'}>
                {label}
                {!p?.selected ? <span className="block text-[11px]">not selected</span> : null}
              </span>
              <Toggle
                on={p?.paymentStatus === 'paid'}
                onLabel="Paid"
                offLabel="Pending"
                busy={busy}
                onChange={(paid) => setPayment(kind, paid)}
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="font-semibold">Attendance</div>
          {[
            ['day1', 'Day 1'],
            ['day2', 'Day 2']
          ].map(([day, label]) => (
            <div key={day} className="mt-3 flex items-center justify-between gap-2">
              <span>{label}</span>
              <Toggle
                on={!!user.attendance?.[day]}
                onLabel="Present"
                offLabel="Absent"
                busy={busy}
                onChange={(value) => setAttendance(day, value)}
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold">Paper</span>
            {user.paper ? <StatusBadge status={user.paper.status} /> : null}
          </div>
          {user.paper ? (
            <>
              <div className="mt-2 text-xs text-white/75 line-clamp-2" title={user.paper.title}>
                {user.paper.title}
              </div>
              {user.paper.remarks ? <div className="mt-1 text-xs text-white/50">Remarks: {user.paper.remarks}</div> : null}
              <a className="link mt-1 inline-block text-xs" href={user.paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
              <div className="mt-3 flex flex-wrap gap-2">
                <button disabled={busy} onClick={() => decidePaper('accepted')} className="btn-sm rounded-lg px-2.5 py-1 text-xs bg-green-500/15 border border-green-400/30 hover:bg-green-500/25 disabled:opacity-50">
                  Accept
                </button>
                <button disabled={busy} onClick={() => decidePaper('rejected')} className="btn-sm rounded-lg px-2.5 py-1 text-xs bg-red-500/15 border border-red-400/30 hover:bg-red-500/25 disabled:opacity-50">
                  Reject
                </button>
                <button disabled={busy} onClick={() => decidePaper('submitted')} className="btn-sm rounded-lg px-2.5 py-1 text-xs bg-white/5 border border-white/15 hover:bg-white/10 disabled:opacity-50">
                  Reset
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2 text-xs text-white/50">No submission yet.</div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AdminPage() {
  const [me, setMe] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState(null);
  const lastQuery = useRef('');
  const noticeTimer = useRef(null);

  useEffect(() => {
    api('/api/me')
      .then((data) => {
        if (data.role === 'admin') setMe(data);
        else window.location.href = '/dashboard';
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }, []);

  const notify = useCallback((n) => {
    setNotice(n);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  }, []);

  async function search(e) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    lastQuery.current = q;
    setSearching(true);
    setNotice(null);
    try {
      const data = await api(`/api/admin/search?q=${encodeURIComponent(q)}`);
      // Ignore stale responses if another search started meanwhile.
      if (lastQuery.current === q) setResults(data.results || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) window.location.href = '/login';
      else notify({ type: 'error', message: err.message });
    } finally {
      setSearching(false);
    }
  }

  const updateUser = useCallback((updated) => {
    setResults((list) => list.map((u) => (u._id === updated._id ? updated : u)));
  }, []);

  if (!me) {
    return (
      <Section title="Admin">
        <div className="card p-6 animate-pulse h-32" />
      </Section>
    );
  }

  return (
    <Section
      title="Admin Dashboard"
      subtitle="Search participants, verify payments, mark attendance, manage paper decisions."
      actions={
        <>
          <a href="/api/admin/export" className="btn-ghost btn-sm" download>
            Export CSV
          </a>
          <button onClick={logout} className="btn-ghost btn-sm">
            Logout
          </button>
        </>
      }
    >
      <div className="card p-5 md:p-6">
        <div className="text-xs text-white/55">Logged in as {me.email}</div>
        <form onSubmit={search} className="mt-3 flex flex-col sm:flex-row gap-3" role="search">
          <input
            type="search"
            className="input mt-0 flex-1"
            placeholder="Search by YUTIRA ID / name / email / phone"
            aria-label="Search participants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={searching || !query.trim()}>
            {searching ? 'Searching…' : 'Search'}
          </button>
        </form>

        <div className="mt-3 min-h-[1.5rem]" aria-live="polite">
          {notice ? <Alert type={notice.type}>{notice.message}</Alert> : null}
          {!notice && results ? (
            <div className="text-xs text-white/55">
              Found {results.length}
              {results.length === 50 ? ' (showing first 50 — refine your search)' : ''}
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-4">
          {results?.map((u) => (
            <ParticipantCard key={u._id} user={u} onChange={updateUser} notify={notify} />
          ))}
          {results && results.length === 0 ? <div className="text-sm text-white/60">No results.</div> : null}
          {!results ? (
            <div className="text-sm text-white/50">Search for a participant to manage payments, attendance and papers.</div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

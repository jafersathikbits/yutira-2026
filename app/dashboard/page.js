'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import StatusBadge from '@/components/StatusBadge';
import years from '@/lib/years';
import { externalParticipantNotice, fees, PAYMENT_LINK, paperPresentation } from '@/lib/data';
import { api, logout } from '@/lib/http';

const DEGREES = ['B.E Civil Engineering', 'M.E Structural Engineering', 'M.E Infrastructural Engineering', 'Other'];

const emptyPaperForm = {
  title: '',
  degree: DEGREES[0],
  yearOfStudy: years[0],
  otherAuthors: 'NA',
  pdfUrl: ''
};

function Skeleton() {
  return (
    <Section title="Dashboard">
      <div className="grid lg:grid-cols-3 gap-4 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="card h-40" />
          <div className="card h-48" />
        </div>
        <div className="card h-40" />
      </div>
    </Section>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost btn-sm py-1"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard not available (e.g. non-HTTPS); ignore.
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function DashboardPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [paper, setPaper] = useState(null);
  const [editing, setEditing] = useState(false);
  const [paperForm, setPaperForm] = useState(emptyPaperForm);
  const [paperStatus, setPaperStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    setDeadlinePassed(Date.now() > new Date(paperPresentation.deadlineISO).getTime());
    (async () => {
      try {
        const data = await api('/api/me');
        if (data.role === 'admin') {
          window.location.href = '/admin';
          return;
        }
        setMe(data);
        const { paper: p } = await api('/api/papers/mine');
        setPaper(p);
      } catch (e) {
        setErr(e.status === 401 ? 'Please log in to view your dashboard.' : e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setField = (key) => (e) => setPaperForm((f) => ({ ...f, [key]: e.target.value }));

  function startEdit() {
    setPaperForm({
      title: paper.title,
      degree: paper.degree || DEGREES[0],
      yearOfStudy: paper.yearOfStudy || years[0],
      otherAuthors: paper.otherAuthors || 'NA',
      pdfUrl: paper.pdfUrl
    });
    setPaperStatus(null);
    setEditing(true);
  }

  async function submitPaper(e) {
    e.preventDefault();
    setPaperStatus(null);
    setSubmitting(true);
    try {
      const { paper: saved } = await api('/api/papers/submit', { method: 'POST', body: paperForm });
      setPaper(saved);
      setEditing(false);
      setPaperStatus({ type: 'success', message: 'Abstract submitted successfully.' });
    } catch (e) {
      setPaperStatus({ type: 'error', message: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton />;

  if (err) {
    return (
      <Section title="Dashboard">
        <div className="card p-6 max-w-xl">
          <Alert type="error">{err}</Alert>
          <Link href="/login" className="btn-primary mt-4">
            Go to login
          </Link>
        </div>
      </Section>
    );
  }

  const generalFee = me.isPSG ? fees.general_psg : fees.general_other;
  const payments = [
    { key: 'general', label: 'General Registration', fee: generalFee, data: me.general },
    { key: 'workshop', label: 'Workshop', fee: fees.workshop, data: me.workshop }
  ].filter((p) => p.data?.selected);
  const anyPending = payments.some((p) => p.data.paymentStatus !== 'paid');
  const showForm = !deadlinePassed && (!paper || editing);

  return (
    <Section
      title={`Welcome, ${me.name}`}
      subtitle="Your registration, payment, paper submission, and attendance."
      actions={
        <button onClick={logout} className="btn-ghost btn-sm">
          Logout
        </button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/55">Your YUTIRA ID</div>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold tracking-wide text-gold">{me.yutiraId || '—'}</span>
                  {me.yutiraId ? <CopyButton text={me.yutiraId} /> : null}
                </div>
              </div>
              <dl className="text-sm text-white/70 sm:text-right">
                <dt className="sr-only">Email</dt>
                <dd>{me.email}</dd>
                <dt className="sr-only">Phone</dt>
                <dd>{me.phone}</dd>
              </dl>
            </div>

            {!me.isPSG ? (
              <Alert type="info" className="mt-4">
                {externalParticipantNotice}
              </Alert>
            ) : null}
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Payments <span className="font-normal text-white/55">(verified by faculty advisor)</span></h2>
            <ul className="mt-4 divide-y divide-white/10 text-sm">
              {payments.map((p) => (
                <li key={p.key} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-white/90 font-medium">{p.label}</div>
                    <div className="text-white/60">Fee: ₹{p.fee}</div>
                  </div>
                  <StatusBadge status={p.data.paymentStatus} />
                </li>
              ))}
            </ul>

            {anyPending ? (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <a className="btn-primary btn-sm" href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
                  Open payment link
                </a>
                <span className="text-xs text-white/60">
                  Fill the <span className="text-white">same name</span> and{' '}
                  <span className="text-white">mobile number</span> you used for registration.
                  {payments.length > 1 ? ' General and workshop fees must be paid separately.' : ''}
                </span>
              </div>
            ) : (
              <div className="mt-4 text-xs text-green-200">All payments verified. See you at Yutira!</div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Paper Presentation Abstract Submission</h2>
              {paper && !editing ? <StatusBadge status={paper.status} /> : null}
            </div>

            {paperStatus ? (
              <Alert type={paperStatus.type} className="mt-4">
                {paperStatus.message}
              </Alert>
            ) : null}

            {paper && !editing ? (
              <div className="mt-4 text-sm text-white/80 space-y-1.5">
                <div>
                  <span className="text-white/55">Title:</span> {paper.title}
                </div>
                {paper.remarks ? (
                  <div>
                    <span className="text-white/55">Remarks:</span> {paper.remarks}
                  </div>
                ) : null}
                <div className="pt-2 flex flex-wrap gap-2">
                  <a className="btn-ghost btn-sm" href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View uploaded PDF
                  </a>
                  {paper.status === 'submitted' && !deadlinePassed ? (
                    <button type="button" className="btn-ghost btn-sm" onClick={startEdit}>
                      Edit submission
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {!paper && deadlinePassed ? (
              <p className="mt-3 text-sm text-white/60">The abstract submission deadline has passed.</p>
            ) : null}

            {showForm ? (
              <form onSubmit={submitPaper} className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="label">
                    Title of the Paper
                  </label>
                  <input id="title" className="input" value={paperForm.title} onChange={setField('title')} required maxLength={300} />
                </div>

                <div>
                  <label htmlFor="degree" className="label">
                    Degree
                  </label>
                  <select id="degree" className="input" value={paperForm.degree} onChange={setField('degree')}>
                    {DEGREES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="yearOfStudy" className="label">
                    Year of Study
                  </label>
                  <select id="yearOfStudy" className="input" value={paperForm.yearOfStudy} onChange={setField('yearOfStudy')}>
                    {years.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="otherAuthors" className="label">
                    Details of other Authors
                  </label>
                  <textarea
                    id="otherAuthors"
                    rows={3}
                    className="input"
                    value={paperForm.otherAuthors}
                    onChange={setField('otherAuthors')}
                    required
                    maxLength={1000}
                  />
                  <div className="mt-1 text-xs text-white/55">
                    Format: &quot;Name - Year of Study, Degree - Contact Number&quot;. Type NA if not applicable.
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="pdfUrl" className="label">
                    Abstract PDF URL
                  </label>
                  <input
                    id="pdfUrl"
                    type="url"
                    className="input"
                    placeholder="https://drive.google.com/…  (set sharing to 'Anyone with the link')"
                    value={paperForm.pdfUrl}
                    onChange={setField('pdfUrl')}
                    required
                  />
                  <div className="mt-2 text-xs text-white/55">
                    Not sure about the format?{' '}
                    <a className="link" href="/docs/sample-abstract.pdf" target="_blank" rel="noopener noreferrer">
                      View sample abstract
                    </a>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                  <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                    {submitting ? 'Submitting…' : editing ? 'Save changes' : 'Submit Abstract'}
                  </button>
                  {editing ? (
                    <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold">Attendance</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {[
                ['Day 1', me.attendance.day1],
                ['Day 2', me.attendance.day2]
              ].map(([day, marked]) => (
                <li key={day} className="flex items-center justify-between">
                  <span>{day}</span>
                  <StatusBadge status={marked ? 'yes' : 'no'} label={marked ? 'Marked' : 'Not marked'} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/55">Attendance is marked by the helpdesk/admin.</p>
          </div>

          <div className="card p-6 text-sm text-white/75">
            <h2 className="font-semibold text-white">Your details</h2>
            <dl className="mt-3 space-y-1.5">
              <div>
                <dt className="text-white/50 text-xs">College</dt>
                <dd>{me.college}</dd>
              </div>
              <div>
                <dt className="text-white/50 text-xs">Branch • Year</dt>
                <dd>
                  {me.department} • {me.year}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Note</h2>
            <p className="mt-2 text-sm text-white/80 leading-7">
              If you are paying, please fill the <span className="text-white">same name</span> and{' '}
              <span className="text-white">mobile number</span> that you used for registration.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

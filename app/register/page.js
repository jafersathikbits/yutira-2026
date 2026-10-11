'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import Alert from '@/components/Alert';
import PasswordInput from '@/components/PasswordInput';
import colleges from '@/lib/colleges';
import departments from '@/lib/departments';
import years from '@/lib/years';
import { fees, psgEmailSuffix, REGISTRATION_CLOSE_ISO } from '@/lib/data';
import { api } from '@/lib/http';

const OTHER_COLLEGE = '__other__';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  college: '',
  otherCollege: '',
  department: '',
  year: '',
  password: '',
  general: true,
  workshop: false
};

function isClosed() {
  return Date.now() > new Date(REGISTRATION_CLOSE_ISO).getTime();
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState('');
  // Evaluated after mount: the page is pre-rendered at build time, so checking the clock during render
  // would freeze the "closed" state at build time and cause hydration mismatches.
  const [closed, setClosed] = useState(false);

  useEffect(() => setClosed(isClosed()), []);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const isPSG = form.email.trim().toLowerCase().endsWith(psgEmailSuffix);

  const feePreview =
    (form.general ? (isPSG ? fees.general_psg : fees.general_other) : 0) + (form.workshop ? fees.workshop : 0);

  const filteredColleges = useMemo(() => {
    const q = collegeFilter.trim().toLowerCase();
    if (!q) return colleges;
    return colleges.filter((c) => c.toLowerCase().includes(q));
  }, [collegeFilter]);

  const nothingSelected = !form.general && !form.workshop;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (isClosed()) {
      setClosed(true);
      setStatus({ type: 'error', message: 'Registrations are closed (after 26 March 2026).' });
      return;
    }
    if (nothingSelected) {
      setStatus({ type: 'error', message: 'Select at least one: General registration and/or Workshop.' });
      return;
    }

    setSubmitting(true);
    try {
      const { otherCollege, ...rest } = form;
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: { ...rest, college: form.college === OTHER_COLLEGE ? otherCollege : form.college }
      });

      if (data?.emailSent === false) {
        setStatus({ type: 'warning', message: data.message });
      } else {
        setStatus({
          type: 'success',
          message:
            data?.message ||
            `Registration initiated! We've sent a verification link to ${form.email.trim()}. Open it to complete your registration (check spam too).`
        });
        setForm(initialForm);
        setCollegeFilter('');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section
      eyebrow="Join us"
      title="Register for Yutira 2026"
      subtitle="Event registration last date: 26 March 2026. General registration covers all events + paper presentation. Workshop is separate."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6 md:p-8 lg:col-span-2">
          {closed ? (
            <Alert type="error" className="mb-5">
              Registrations are closed.
            </Alert>
          ) : null}

          {status ? (
            <Alert type={status.type} className="mb-5">
              {status.message}
            </Alert>
          ) : null}

          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <label htmlFor="name" className="label">
                Name <span className="text-red-300">*</span> <span className="text-white/50">(as per your college ID)</span>
              </label>
              <input id="name" autoComplete="name" className="input" value={form.name} onChange={set('name')} required maxLength={120} />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email <span className="text-red-300">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                value={form.email}
                onChange={set('email')}
                required
              />
              {isPSG ? (
                <div className="mt-1 text-xs text-green-200">PSG email detected — PSG general fee will apply.</div>
              ) : (
                <div className="mt-1 text-xs text-white/55">External participants can use any email.</div>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone number <span className="text-red-300">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="input"
                placeholder="10-digit mobile number"
                pattern="(\+?91[ \-]?|0)?[6-9]\d{4}[ \-]?\d{5}"
                title="Enter a valid 10-digit Indian mobile number"
                value={form.phone}
                onChange={set('phone')}
                required
              />
              <div className="mt-1 text-xs text-white/55">Use the same number while paying.</div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password <span className="text-red-300">*</span>
              </label>
              <PasswordInput
                id="password"
                value={form.password}
                onChange={set('password')}
                minLength={6}
                autoComplete="new-password"
              />
              <div className="mt-1 text-xs text-white/55">At least 6 characters.</div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="college" className="label">
                College/University <span className="text-red-300">*</span>
              </label>
              <input
                type="search"
                className="input"
                placeholder={`Type to filter ${colleges.length} colleges…`}
                aria-label="Filter colleges"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
              />
              <select id="college" className="input" value={form.college} onChange={set('college')} required>
                <option value="" disabled>
                  {filteredColleges.length ? 'Select…' : 'No match — choose "not listed" below'}
                </option>
                {filteredColleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {form.college && form.college !== OTHER_COLLEGE && !filteredColleges.includes(form.college) ? (
                  <option value={form.college}>{form.college}</option>
                ) : null}
                <option value={OTHER_COLLEGE}>My college is not listed above</option>
              </select>
              {form.college === OTHER_COLLEGE ? (
                <input
                  className="input"
                  placeholder="Enter your college name"
                  aria-label="Your college name"
                  value={form.otherCollege}
                  onChange={set('otherCollege')}
                  required
                  maxLength={300}
                />
              ) : null}
            </div>

            <div>
              <label htmlFor="department" className="label">
                Branch <span className="text-red-300">*</span>
              </label>
              <select id="department" className="input" value={form.department} onChange={set('department')} required>
                <option value="" disabled>
                  Select…
                </option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="label">
                Year <span className="text-red-300">*</span>
              </label>
              <select id="year" className="input" value={form.year} onChange={set('year')} required>
                <option value="" disabled>
                  Select a year
                </option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="md:col-span-2 rounded-2xl border border-white/15 bg-white/[0.03] p-4">
              <legend className="px-1 font-semibold">Choose registration</legend>
              <div className="mt-1 grid sm:grid-cols-2 gap-3 text-sm">
                <label
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                    form.general ? 'border-gold/50 bg-gold/10' : 'border-white/15 hover:bg-white/5'
                  }`}
                >
                  <input type="checkbox" className="mt-0.5 accent-[#ffc83d] h-4 w-4" checked={form.general} onChange={set('general')} />
                  <span>
                    <span className="block font-medium">General Registration</span>
                    <span className="text-white/60">
                      Events + Paper Presentation • ₹{isPSG ? fees.general_psg : fees.general_other}
                    </span>
                  </span>
                </label>
                <label
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                    form.workshop ? 'border-gold/50 bg-gold/10' : 'border-white/15 hover:bg-white/5'
                  }`}
                >
                  <input type="checkbox" className="mt-0.5 accent-[#ffc83d] h-4 w-4" checked={form.workshop} onChange={set('workshop')} />
                  <span>
                    <span className="block font-medium">Workshop</span>
                    <span className="text-white/60">OpenBIM • ₹{fees.workshop}</span>
                  </span>
                </label>
              </div>
              {form.general && form.workshop ? (
                <div className="mt-3 text-xs text-yellow-100/90">
                  Note: You selected both, so payment must be done separately (as per instructions).
                </div>
              ) : null}
              {nothingSelected ? (
                <div className="mt-3 text-xs text-red-200">Select at least one option.</div>
              ) : null}
              <div className="mt-3 text-sm">
                Fee preview: <span className="font-semibold text-gold">₹{feePreview}</span>
              </div>
            </fieldset>

            <div className="md:col-span-2">
              <button disabled={submitting || closed || nothingSelected} className="btn-primary w-full" type="submit">
                {submitting ? 'Submitting…' : 'Register'}
              </button>
              <p className="mt-3 text-xs text-white/55 text-center">
                After email verification, you will receive your YUTIRA ID and payment link in email. Already registered?{' '}
                <Link className="link" href="/login">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="card p-5">
            <h2 className="font-semibold">How it works</h2>
            <ol className="mt-3 space-y-3 text-sm text-white/75">
              {[
                'Fill this form and submit',
                'Verify your email from the link we send',
                'Receive your YUTIRA ID and payment link',
                'Pay using the same name & mobile number',
                'Payment is verified manually by the faculty advisor'
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-5 text-sm text-white/75">
            <h2 className="font-semibold text-white">Fees</h2>
            <ul className="mt-3 space-y-1.5">
              <li className="flex justify-between">
                <span>General (PSG Tech)</span>
                <span className="text-white">₹{fees.general_psg}</span>
              </li>
              <li className="flex justify-between">
                <span>General (other colleges)</span>
                <span className="text-white">₹{fees.general_other}</span>
              </li>
              <li className="flex justify-between">
                <span>Workshop</span>
                <span className="text-white">₹{fees.workshop}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}

import Link from 'next/link';
import Section from '@/components/Section';
import InfoList from '@/components/InfoList';
import ContactList from '@/components/ContactList';
import { paperPresentation } from '@/lib/data';

export const metadata = { title: 'Paper Presentation' };

const deadline = new Date(paperPresentation.deadlineISO).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata'
});

export default function PaperPage() {
  const topics = paperPresentation.topic.split('\n');
  const rules = paperPresentation.rules.split('\n');

  return (
    <Section eyebrow="Present" title="Paper Presentation" subtitle="Submit your abstract PDF and track the status in your dashboard.">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-3">Topics</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {topics.map((t) => (
                <li key={t} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-white/85">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-3">Rules</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80 leading-7 marker:text-gold">
              {rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-2">Submission</h2>
            <p className="text-sm text-white/80 leading-7">
              Register, verify your email, then submit your abstract as a PDF link from your{' '}
              <Link className="link" href="/dashboard">
                dashboard
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="chip bg-gold/15 border-gold/30 text-gold-soft">Deadline: {deadline}</span>
              <a className="link" href="/docs/sample-abstract.pdf" target="_blank" rel="noopener noreferrer">
                View sample abstract
              </a>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="card p-5">
            <h2 className="font-semibold">Schedule</h2>
            <InfoList
              items={[
                ['Date', `${paperPresentation.date} ${paperPresentation.month} 2026`],
                ['Time', paperPresentation.time],
                ['Venue', paperPresentation.hall],
                ['Team size', paperPresentation.teamSize]
              ]}
            />
          </div>

          <div className="card p-5">
            <h2 className="font-semibold">Contacts</h2>
            <ContactList contacts={[paperPresentation.contact1, paperPresentation.contact2]} />
            <div className="mt-3 text-sm text-white/70">
              Email:{' '}
              <a className="link" href={`mailto:${paperPresentation.eventMail}`}>
                {paperPresentation.eventMail}
              </a>
            </div>
          </div>

          <Link href="/register" className="btn-primary w-full">
            Register
          </Link>
        </aside>
      </div>
    </Section>
  );
}

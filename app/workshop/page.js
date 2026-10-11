import Link from 'next/link';
import Section from '@/components/Section';
import InfoList from '@/components/InfoList';
import ContactList from '@/components/ContactList';
import { workshop, fees } from '@/lib/data';

export const metadata = { title: 'Workshop' };

export default function WorkshopPage() {
  return (
    <Section eyebrow="Learn" title="Workshop" subtitle="Workshop registration fee is separate from general registration.">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 md:p-6">
            <h2 className="text-xl font-semibold">{workshop.workName}</h2>
            <p className="mt-2 text-sm text-white/80 leading-7">{workshop.desc}</p>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-3">Sessions</h2>
            <ol className="grid sm:grid-cols-2 gap-2 text-sm text-white/85">
              {workshop.sessions.map((s, i) => (
                <li key={s.title} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                  <span className="text-gold font-semibold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{s.title}</span>
                  {s.duration ? <span className="text-white/55">{s.duration}</span> : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-2">Learning outcome</h2>
            <p className="text-sm text-white/80 leading-7">{workshop.learningOutcome}</p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="card p-5">
            <h2 className="font-semibold">Schedule</h2>
            <InfoList
              items={[
                ['Date', `${workshop.date} ${workshop.month} 2026`],
                ['Time', workshop.time],
                ['Venue', workshop.hall],
                ['Fee', `₹${fees.workshop}`]
              ]}
            />
          </div>

          <div className="card p-5">
            <h2 className="font-semibold">Presented by</h2>
            <p className="mt-2 text-sm text-white/80">{workshop.presentedBy}</p>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold">Contacts</h2>
            <ContactList
              contacts={[
                [workshop.c1Name, workshop.c1Num],
                [workshop.c2Name, workshop.c2Num]
              ]}
            />
          </div>

          <a
            href="/docs/OpenBIM_and_Intelligent_Building_Modelling.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost w-full"
          >
            Workshop brochure (PDF)
          </a>
          <Link href="/register" className="btn-primary w-full">
            Register for the workshop
          </Link>
        </aside>
      </div>
    </Section>
  );
}

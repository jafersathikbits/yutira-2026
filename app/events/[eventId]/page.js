import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '@/components/Section';
import InfoList from '@/components/InfoList';
import ContactList from '@/components/ContactList';
import { events } from '@/lib/data';

// Pre-render every event page at build time instead of on each request.
export function generateStaticParams() {
  return events.map((e) => ({ eventId: e.eventId }));
}

export const dynamicParams = false;

function findEvent(eventId) {
  return events.find((e) => e.eventId === eventId);
}

export function generateMetadata({ params }) {
  const event = findEvent(params.eventId);
  return event ? { title: event.eventName, description: event.one_line_desc } : { title: 'Event not found' };
}

export default function EventDetailPage({ params }) {
  const event = findEvent(params.eventId);
  if (!event) notFound();

  const rounds = [1, 2, 3]
    .map((n) => ({ title: event[`round_title_${n}`], desc: event[`round_desc_${n}`] }))
    .filter((r) => r.title);

  return (
    <Section eyebrow={event.category ? `${event.category} event` : 'Event'} title={event.eventName} subtitle={event.one_line_desc}>
      <Link href="/events" className="inline-block -mt-2 mb-6 text-sm text-white/60 hover:text-gold transition">
        ← All events
      </Link>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-white/80 text-sm leading-7">{event.description}</p>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-4">Rounds</h2>
            <ol className="space-y-5 text-sm text-white/80 leading-7">
              {rounds.map((r, i) => (
                <li key={r.title} className="flex gap-4">
                  <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-gold/15 border border-gold/30 text-gold font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{r.title}</div>
                    <div className="whitespace-pre-line">{r.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="font-semibold mb-2">Rules</h2>
            <p className="whitespace-pre-line text-sm text-white/80 leading-7">{event.eventRules}</p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="card p-5">
            <h2 className="font-semibold">Schedule</h2>
            <InfoList
              items={[
                ['Date', `${event.date} ${event.month} 2026`],
                ['Time', event.timing],
                ['Venue', event.hall],
                ['Team size', event.teamSize]
              ]}
            />
          </div>

          <div className="card p-5">
            <h2 className="font-semibold">Prizes</h2>
            <InfoList
              items={[
                ['Winner', `₹${event.prizes.winner.toLocaleString('en-IN')}`],
                ['1st Runner-up', `₹${event.prizes.first_runner_up.toLocaleString('en-IN')}`],
                ['2nd Runner-up', `₹${event.prizes.second_runner_up.toLocaleString('en-IN')}`]
              ]}
            />
          </div>

          <div className="card p-5">
            <h2 className="font-semibold">Contacts</h2>
            <ContactList
              contacts={[
                [event.contact_name_1, event.contact_mobile_1],
                [event.contact_name_2, event.contact_mobile_2]
              ]}
            />
          </div>

          <Link href="/register" className="btn-primary w-full">
            Register
          </Link>
        </aside>
      </div>
    </Section>
  );
}

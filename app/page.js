import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import Section from '@/components/Section';
import { EVENT_COUNTDOWN_TARGET_ISO, events, fees, workshop } from '@/lib/data';

const schedule = [
  {
    day: 'Day 1',
    date: '27.03.2026',
    items: [
      ['Inauguration', '09:00 AM - 10:00 AM'],
      ['Survey Smarts', '10:00 AM - 12:00 PM'],
      ['Build Bound Challenge', '01:00 PM - 04:00 PM'],
      ['Paper Presentation', '10:00 AM - 04:00 PM']
    ]
  },
  {
    day: 'Day 2',
    date: '28.03.2026',
    items: [
      ['Cipher Craft', '09:00 AM - 12:00 PM'],
      ['Build Battle', '01:00 PM - 03:00 PM'],
      ['Workshop', '09:00 AM - 01:00 PM'],
      ['Felicitation', '03:00 PM - 04:00 PM']
    ]
  }
];

const totalPrizes = events.reduce(
  (sum, e) => sum + e.prizes.winner + e.prizes.first_runner_up + e.prizes.second_runner_up,
  0
);

const stats = [
  { value: String(events.length), label: 'Technical events' },
  { value: '1', label: 'Hands-on workshop' },
  { value: '1', label: 'Paper presentation' },
  { value: `₹${(totalPrizes / 1000).toFixed(0)}K+`, label: 'Prize pool' }
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-8 md:pt-12 pb-10">
        <div className="card relative overflow-hidden p-6 md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
          />
          <div className="relative grid md:grid-cols-2 items-center gap-8 md:gap-10">
            <Image
              src="/yutira-logo-home.jpeg"
              alt="Yutira 2026"
              width={1659}
              height={1659}
              sizes="(min-width: 768px) 420px, 80vw"
              className="mx-auto w-full max-w-[420px] h-auto rounded-3xl border border-white/15 shadow-2xl shadow-black/40"
              priority
            />

            <div className="text-center md:text-left">
              <div className="eyebrow">National level technical symposium</div>
              <div className="mt-3 text-sm text-white/70">March 27 &amp; 28, 2026 • PSG College of Technology</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Bridging Ideas,
                <span className="block text-gold">Building Realities</span>
              </h1>
              <p className="mt-4 text-white/70 leading-7">
                Organised by the Department of Civil Engineering, PSG College of Technology.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/register" className="btn-primary">
                  Register Now
                </Link>
                <Link href="/events" className="btn-ghost">
                  View Events
                </Link>
              </div>
              <div className="mt-4 text-xs text-white/55">
                General registration ₹{fees.general_psg} (PSG Tech) / ₹{fees.general_other} (others) • Workshop ₹
                {fees.workshop}
              </div>
            </div>
          </div>

          <div className="relative mt-10 pt-8 border-t border-white/10">
            <Countdown targetISO={EVENT_COUNTDOWN_TARGET_ISO} />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl md:text-3xl font-bold text-gold">{s.value}</dd>
              <dd className="text-xs md:text-sm text-white/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section title="Quick Schedule" eyebrow="Two days">
        <div className="grid md:grid-cols-2 gap-4">
          {schedule.map((d) => (
            <div key={d.day} className="card p-5 md:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{d.day}</h2>
                <span className="text-sm text-white/60">{d.date}</span>
              </div>
              <ul className="mt-4 divide-y divide-white/10 text-sm">
                {d.items.map(([name, time]) => (
                  <li key={name} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-white/90">{name}</span>
                    <span className="text-white/60 tabular-nums text-right">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What's on" eyebrow="Highlights">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/events" className="card card-hover p-6">
            <div className="text-lg font-semibold">Technical Events</div>
            <p className="mt-2 text-sm text-white/70 leading-6">
              {events.map((e) => e.eventName.split(':')[0].split(' - ')[0]).join(', ')}.
            </p>
            <div className="mt-4 text-sm text-gold">Explore events →</div>
          </Link>
          <Link href="/workshop" className="card card-hover p-6">
            <div className="text-lg font-semibold">Workshop</div>
            <p className="mt-2 text-sm text-white/70 leading-6">{workshop.workName}.</p>
            <div className="mt-4 text-sm text-gold">Workshop details →</div>
          </Link>
          <Link href="/paper" className="card card-hover p-6 sm:col-span-2 lg:col-span-1">
            <div className="text-lg font-semibold">Paper Presentation</div>
            <p className="mt-2 text-sm text-white/70 leading-6">
              Submit your abstract from the dashboard and present on campus if shortlisted.
            </p>
            <div className="mt-4 text-sm text-gold">Submission guidelines →</div>
          </Link>
        </div>
      </Section>
    </div>
  );
}

import Link from 'next/link';

export default function EventCard({ item, type }) {
  const href = type === 'event' ? `/events/${item.eventId}` : type === 'workshop' ? '/workshop' : '/paper';
  const prizePool = item.prizes
    ? item.prizes.winner + item.prizes.first_runner_up + item.prizes.second_runner_up
    : 0;

  return (
    <Link href={href} className="card card-hover p-5 flex flex-col gap-4 group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold group-hover:text-gold-soft transition">{item.eventName || item.workName}</h2>
          <p className="mt-1 text-sm text-white/70">{item.one_line_desc || item.desc || ''}</p>
        </div>
        {item.category ? (
          <span className="chip bg-gold/15 border-gold/30 text-gold-soft shrink-0">{item.category}</span>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/70">
        <dt className="text-white/50">Date</dt>
        <dd className="text-white/90">
          {item.date} {item.month || ''}
        </dd>
        <dt className="text-white/50">Time</dt>
        <dd className="text-white/90">{item.timing || item.time || ''}</dd>
        <dt className="text-white/50">Venue</dt>
        <dd className="text-white/90">{item.hall}</dd>
        {item.teamSize ? (
          <>
            <dt className="text-white/50">Team size</dt>
            <dd className="text-white/90">{item.teamSize}</dd>
          </>
        ) : null}
      </dl>

      <div className="mt-auto flex items-center justify-between text-sm">
        {prizePool ? (
          <span className="text-white/70">
            Prizes worth <span className="text-gold font-semibold">₹{prizePool.toLocaleString('en-IN')}</span>
          </span>
        ) : (
          <span />
        )}
        <span className="text-gold group-hover:translate-x-0.5 transition">View details →</span>
      </div>
    </Link>
  );
}

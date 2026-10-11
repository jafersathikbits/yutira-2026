const tones = {
  paid: 'border-green-400/30 bg-green-500/15 text-green-100',
  accepted: 'border-green-400/30 bg-green-500/15 text-green-100',
  yes: 'border-green-400/30 bg-green-500/15 text-green-100',
  pending: 'border-yellow-300/30 bg-yellow-500/15 text-yellow-100',
  submitted: 'border-sky-300/30 bg-sky-500/15 text-sky-100',
  rejected: 'border-red-400/30 bg-red-500/15 text-red-100',
  no: 'border-white/15 bg-white/5 text-white/60',
  'not registered': 'border-white/15 bg-white/5 text-white/60'
};

export default function StatusBadge({ status, label }) {
  const key = String(status || '').toLowerCase();
  return <span className={`chip capitalize ${tones[key] || tones.no}`}>{label || status}</span>;
}

/** Small "label: value" list used in the side cards of the event, workshop and paper pages. */
export default function InfoList({ items }) {
  return (
    <dl className="mt-3 space-y-2 text-sm">
      {items
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-white/55 shrink-0">{label}</dt>
            <dd className="text-white/90 text-right">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

export function telHref(phone) {
  return `tel:+91${String(phone).replace(/\D/g, '').slice(-10)}`;
}

export default function ContactList({ contacts }) {
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {contacts
        .filter(([name]) => name)
        .map(([name, phone]) => (
          <li key={name} className="flex justify-between gap-4">
            <span className="text-white/90">{name}</span>
            <a className="text-white/70 hover:text-gold transition tabular-nums" href={telHref(phone)}>
              {phone}
            </a>
          </li>
        ))}
    </ul>
  );
}

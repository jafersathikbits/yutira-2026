import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  { href: '/events', label: 'Events' },
  { href: '/workshop', label: 'Workshop' },
  { href: '/paper', label: 'Paper Presentation' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' }
];

const secretaries = [
  { name: 'Rahul G V', phone: '93448 13153' },
  { name: 'Vinoth Kumar S', phone: '80728 99952' }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink/40">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/yutira-logo.jpeg" alt="Yutira 2026" width={75} height={44} className="rounded-xl h-11 w-auto" />
            <div>
              <div className="font-semibold">Yutira 2026</div>
              <div className="text-sm text-white/60">
                Department of Civil Engineering, <br /> PSG College of Technology
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">March 27 &amp; 28, 2026 • Coimbatore</p>
        </div>

        <div className="text-sm text-white/70">
          <div className="font-semibold text-white mb-3">Quick Links</div>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-gold transition" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-white/70">
          <div className="font-semibold text-white mb-3">Secretaries</div>
          <ul className="space-y-3">
            {secretaries.map((s) => (
              <li key={s.name}>
                <div className="text-white/90">{s.name}</div>
                <a className="hover:text-gold transition" href={`tel:+91${s.phone.replace(/\s/g, '')}`}>
                  {s.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-white/50 border-t border-white/10">© 2026 Yutira 2026</div>
    </footer>
  );
}

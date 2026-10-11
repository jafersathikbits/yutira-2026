import Section from '@/components/Section';
import { telHref } from '@/components/ContactList';

export const metadata = { title: 'Contact' };

const secretaries = [
  { name: 'Rahul G V', phone: '93448 13153' },
  { name: 'Vinoth Kumar S', phone: '80728 99952' }
];

export default function ContactPage() {
  return (
    <Section eyebrow="Get in touch" title="Contact Us" subtitle="Reach us through Instagram or Email">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6 space-y-5">
          <div>
            <h2 className="font-semibold">Instagram</h2>
            <a
              className="link mt-2 inline-block text-sm text-white/80 break-all"
              href="https://www.instagram.com/cea_ici_psgtech/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @cea_ici_psgtech
            </a>
          </div>

          <div>
            <h2 className="font-semibold">Email</h2>
            <a className="link mt-2 inline-block text-sm text-white/80" href="mailto:cea.civil@psgtech.ac.in">
              cea.civil@psgtech.ac.in
            </a>
          </div>

          <div>
            <h2 className="font-semibold">Venue</h2>
            <p className="mt-2 text-sm text-white/80">
              Department of Civil Engineering, PSG College of Technology, Peelamedu, Coimbatore
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Secretaries</h2>
          <ul className="mt-3 text-sm text-white/80 space-y-3">
            {secretaries.map((s) => (
              <li key={s.name} className="flex justify-between gap-4">
                <span className="text-white/90 font-medium">{s.name}</span>
                <a className="hover:text-gold transition tabular-nums" href={telHref(s.phone)}>
                  {s.phone}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h2 className="font-semibold">Developer</h2>
            <div className="mt-2 text-sm text-white/80 flex justify-between gap-4">
              <span className="text-white/90 font-medium">Jafer Sathik B</span>
              <a className="hover:text-gold transition tabular-nums" href={telHref('8428122334')}>
                8428122334
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

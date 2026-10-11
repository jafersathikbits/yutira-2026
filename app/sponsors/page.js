import Image from 'next/image';
import Section from '@/components/Section';
import { titleSponsors } from '@/lib/data';

export const metadata = { title: 'Sponsors' };

export default function SponsorsPage() {
  return (
    <Section eyebrow="Thank you" title="Title Sponsors" subtitle="We thank our sponsors for supporting Yutira 2026.">
      <div className="grid md:grid-cols-2 gap-4">
        {titleSponsors.map((s) => (
          <figure key={s.name} className="card card-hover p-5 md:p-6 flex flex-col items-center gap-4">
            <div className="w-full rounded-2xl bg-white p-4 grid place-items-center aspect-[16/9]">
              <Image
                src={s.logo}
                alt={`${s.name} logo`}
                width={s.width}
                height={s.height}
                sizes="(min-width: 768px) 520px, 90vw"
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="text-sm font-medium text-white/85 text-center">{s.name}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

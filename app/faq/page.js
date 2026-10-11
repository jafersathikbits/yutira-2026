import Link from 'next/link';
import Section from '@/components/Section';
import { fees } from '@/lib/data';

export const metadata = { title: 'FAQ' };

const faqs = [
  {
    q: 'What is Yutira?',
    a: 'Yutira 2026 is a National level Technical Symposium conducted by the Department of Civil Engineering, PSG College of Technology. It encompasses 4 events, a workshop and a paper presentation.'
  },
  {
    q: 'Who can participate in Yutira?',
    a: 'The contest is open for all Undergraduate and Postgraduate students from AICTE approved Technical Higher Educational Institutions of India.'
  },
  {
    q: 'What is the fee to participate in Yutira?',
    a: `The general registration fee is Rs. ${fees.general_psg} for PSG Tech students and Rs. ${fees.general_other} for students from other colleges. No separate registration fee is required to participate in each event and paper presentations. However, participants have to pay separately to participate in workshops.`
  },
  {
    q: 'Do we have to pay separately for attending workshops?',
    a: "Yes, you have to pay separately for each workshop. The general registration fee doesn't cover workshop participation."
  },
  {
    q: 'Will registration fees be refunded?',
    a: 'No, we follow a non refund policy at any cost *'
  }
];

export default function FAQPage() {
  return (
    <Section eyebrow="Help" title="Frequently Asked Questions">
      <div className="space-y-3 max-w-3xl">
        {faqs.map((f, i) => (
          <details key={f.q} className="card group p-0 open:border-gold/30" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="text-gold transition group-open:rotate-45 text-xl leading-none">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 -mt-1 text-sm text-white/80 leading-7">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-white/60">
        Still have a question?{' '}
        <Link className="link" href="/contact">
          Contact us
        </Link>
        .
      </p>
    </Section>
  );
}

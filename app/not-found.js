import Link from 'next/link';
import Section from '@/components/Section';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <Section title="Page not found" subtitle="The page you are looking for doesn't exist or has moved.">
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/events" className="btn-ghost">
          View events
        </Link>
      </div>
    </Section>
  );
}

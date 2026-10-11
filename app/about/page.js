import Section from '@/components/Section';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <Section eyebrow="Who we are" title="About Us" subtitle="Department • Association • Student Chapter">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-6">
          <h2 className="font-semibold mb-2 text-gold-soft">Department of Civil Engineering</h2>
          <p className="text-sm text-white/80 leading-7">
            The Department of Civil Engineering at PSG College of Technology, Coimbatore, is one of the oldest and well-established
            departments in the institution. It was established in the year 1953. It offers undergraduate, postgraduate, and
            doctorate programs in various specializations of civil engineering. With a focus on both theoretical and practical
            learning, the department is supported by modern laboratories and experienced faculty.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-2 text-gold-soft">Civil Engineering Association</h2>
          <p className="text-sm text-white/80 leading-7">
            The Civil Engineering Association at PSG College of Technology is a student-led organization dedicated to fostering
            interest and excellence in civil engineering. It provides a platform for students to engage in technical workshops,
            seminars, and site visits, enhancing their practical skills and industry knowledge.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-2 text-gold-soft">ICI Students Chapter PSGCT</h2>
          <p className="text-sm text-white/80 leading-7">
            The Indian Concrete Institute (ICI) Student Chapter at PSG College of Technology is part of the larger ICI network,
            which promotes education and awareness in concrete technology and construction practices. The chapter is designed to
            cater to the needs of civil engineering students by organizing technical workshops, seminars, and guest lectures.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default function Section({ title, subtitle, eyebrow, actions, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {eyebrow ? <div className="eyebrow mb-2">{eyebrow}</div> : null}
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-3xl text-white/70 leading-7">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

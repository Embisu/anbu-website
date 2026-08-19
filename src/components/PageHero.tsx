import Reveal from "./Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-100/70 bg-cloud">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="container-x relative py-16 sm:py-20">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="text-balance mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-800 sm:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-500">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}

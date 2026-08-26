import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`mt-2 sm:mt-3 text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl ${
          light ? "text-white" : "text-navy-800"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 sm:mt-4 text-pretty text-sm sm:text-base lg:text-lg leading-relaxed ${light ? "text-navy-100" : "text-navy-500"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

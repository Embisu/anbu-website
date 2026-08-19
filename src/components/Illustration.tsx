/* On-brand SVG illustrations (no external images needed). */

export function GrowthArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 420" className={className} role="img" aria-label="Growth analytics illustration">
      <defs>
        <linearGradient id="ga-orange" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f5501e" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff8a4c" />
        </linearGradient>
        <linearGradient id="ga-navy" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#012f87" />
          <stop offset="1" stopColor="#1a44a1" />
        </linearGradient>
      </defs>

      {/* soft backdrop */}
      <rect x="24" y="40" width="472" height="340" rx="28" fill="#f6f8fc" />
      <circle cx="440" cy="70" r="52" fill="#ffdccd" opacity="0.7" />
      <circle cx="70" cy="360" r="40" fill="#d5e1f4" opacity="0.7" />

      {/* dashboard card */}
      <rect x="56" y="80" width="300" height="220" rx="20" fill="#ffffff" stroke="#d5e1f4" />
      {/* bars */}
      <g>
        <rect x="86" y="210" width="34" height="60" rx="8" fill="url(#ga-navy)" />
        <rect x="134" y="180" width="34" height="90" rx="8" fill="url(#ga-navy)" opacity="0.85" />
        <rect x="182" y="150" width="34" height="120" rx="8" fill="url(#ga-orange)" />
        <rect x="230" y="120" width="34" height="150" rx="8" fill="url(#ga-orange)" />
        <rect x="278" y="96" width="34" height="174" rx="8" fill="url(#ga-orange)" />
      </g>
      {/* trend line */}
      <polyline
        points="103,206 151,176 199,150 247,120 295,100"
        fill="none"
        stroke="#012f87"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="295" cy="100" r="7" fill="#fff" stroke="#f5501e" strokeWidth="4" />

      {/* floating mark badge */}
      <g transform="translate(360,250)">
        <rect x="0" y="0" width="120" height="120" rx="26" fill="url(#ga-navy)" />
        <path
          d="M34 44c14-10 30-8 44 0-10 2-18 8-22 18-4-10-12-16-22-18Z"
          fill="#ffffff"
        />
        <path
          d="M30 58c18 4 30 16 34 34 4-18 16-30 34-34-14-4-26 2-34 12-8-10-20-16-34-12Z"
          fill="#f5501e"
        />
      </g>

      {/* dots */}
      <circle cx="400" cy="150" r="6" fill="#f5501e" />
      <circle cx="430" cy="200" r="4" fill="#012f87" />
      <circle cx="410" cy="120" r="4" fill="#012f87" opacity="0.5" />
    </svg>
  );
}

/** Large, very faint ANBU shuriken used as a brand watermark on dark sections. */
export function MarkWatermark({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/mark-white.svg"
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute select-none opacity-[0.05] ${className}`}
    />
  );
}

/** Compact analytics chart sized for a wide, short panel (e.g. the hero card). */
export function MiniChart({ className = "" }: { className?: string }) {
  const bars = [
    { x: 28, h: 26, c: "rgba(255,255,255,0.35)" },
    { x: 68, h: 38, c: "rgba(255,255,255,0.45)" },
    { x: 108, h: 34, c: "rgba(255,255,255,0.35)" },
    { x: 148, h: 52, c: "#f5501e" },
    { x: 188, h: 64, c: "#f5501e" },
    { x: 228, h: 78, c: "#ff8a4c" },
  ];
  return (
    <svg viewBox="0 0 300 120" className={className} role="img" aria-label="Growth chart">
      {/* grid lines */}
      {[30, 55, 80].map((y) => (
        <line key={y} x1="16" y1={y} x2="284" y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      ))}
      {/* bars */}
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y={100 - b.h} width="22" height={b.h} rx="6" fill={b.c} />
      ))}
      {/* trend line */}
      <polyline
        points="39,74 79,62 119,66 159,48 199,36 239,22"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="239" cy="22" r="6" fill="#ffffff" />
      <circle cx="239" cy="22" r="3" fill="#f5501e" />
      {/* baseline */}
      <line x1="16" y1="100" x2="284" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    </svg>
  );
}

export function BlobDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 C 240 120, 480 0, 720 40 S 1200 120, 1440 50 L1440 120 L0 120 Z" fill="#f6f8fc" />
    </svg>
  );
}

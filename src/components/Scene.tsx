/* Themed SVG scene illustrations, designed to overlay on a brand-gradient background.
   White / translucent shapes with orange accents. No external images. */
import type { ReactNode } from "react";

export type SceneVariant =
  | "game"
  | "performance"
  | "influencer"
  | "social"
  | "seo"
  | "web"
  | "branding"
  | "strategy"
  | "ecommerce";

const W = "#ffffff";
const O = "#f5501e";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g opacity="0.12" fill={W}>
        <circle cx="330" cy="60" r="70" />
        <circle cx="70" cy="220" r="48" />
      </g>
      {children}
    </svg>
  );
}

function scenes(variant: SceneVariant) {
  switch (variant) {
    case "game":
      return (
        <g>
          <rect x="120" y="96" width="170" height="96" rx="46" fill={W} />
          <circle cx="165" cy="144" r="9" fill="#012f87" />
          <rect x="156" y="135" width="18" height="18" rx="4" transform="rotate(45 165 144)" fill="#012f87" opacity="0" />
          <path d="M158 144h14M165 137v14" stroke="#012f87" strokeWidth="6" strokeLinecap="round" />
          <circle cx="238" cy="132" r="8" fill={O} />
          <circle cx="258" cy="152" r="8" fill="#012f87" />
          <path d="M300 70l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill={O} />
        </g>
      );
    case "performance":
      return (
        <g>
          <rect x="96" y="70" width="210" height="120" rx="16" fill={W} />
          <rect x="120" y="140" width="20" height="30" rx="5" fill="#012f87" />
          <rect x="152" y="122" width="20" height="48" rx="5" fill="#012f87" opacity="0.85" />
          <rect x="184" y="104" width="20" height="66" rx="5" fill={O} />
          <rect x="216" y="86" width="20" height="84" rx="5" fill={O} />
          <polyline points="130,138 162,120 194,102 226,84 262,72" fill="none" stroke="#012f87" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="262" cy="72" r="7" fill={W} stroke={O} strokeWidth="4" />
        </g>
      );
    case "influencer":
      return (
        <g>
          <rect x="110" y="80" width="150" height="104" rx="18" fill={W} />
          <path d="M170 108l40 24-40 24z" fill={O} />
          <circle cx="290" cy="96" r="26" fill={W} />
          <path d="M290 82l4.5 9 10 1.5-7 7 1.6 10-9-4.7-9 4.7 1.6-10-7-7 10-1.5z" fill={O} />
          <rect x="250" y="150" width="70" height="30" rx="15" fill={W} opacity="0.85" />
          <circle cx="266" cy="165" r="4" fill="#012f87" />
          <circle cx="284" cy="165" r="4" fill="#012f87" />
          <circle cx="302" cy="165" r="4" fill="#012f87" />
        </g>
      );
    case "social":
      return (
        <g>
          <path d="M110 96c0-13 11-24 24-24h72c13 0 24 11 24 24v34c0 13-11 24-24 24h-58l-26 22v-22h12z" fill={W} />
          <circle cx="150" cy="112" r="6" fill="#012f87" />
          <circle cx="174" cy="112" r="6" fill="#012f87" />
          <circle cx="198" cy="112" r="6" fill="#012f87" />
          <path d="M300 150c-18-10-30-22-30-38a18 18 0 0134-8 18 18 0 0134 8c0 16-12 28-30 38l-4 2z" fill={O} />
        </g>
      );
    case "seo":
      return (
        <g>
          <rect x="96" y="78" width="180" height="104" rx="14" fill={W} />
          <rect x="116" y="150" width="26" height="18" rx="4" fill="#012f87" opacity="0.85" />
          <rect x="150" y="132" width="26" height="36" rx="4" fill={O} />
          <rect x="184" y="112" width="26" height="56" rx="4" fill={O} />
          <circle cx="286" cy="120" r="30" fill="none" stroke={W} strokeWidth="12" />
          <line x1="308" y1="142" x2="332" y2="166" stroke={W} strokeWidth="12" strokeLinecap="round" />
          <circle cx="286" cy="120" r="14" fill={O} />
        </g>
      );
    case "web":
      return (
        <g>
          <rect x="96" y="72" width="208" height="128" rx="14" fill={W} />
          <rect x="96" y="72" width="208" height="26" rx="14" fill="#012f87" />
          <circle cx="114" cy="85" r="4" fill={O} />
          <circle cx="130" cy="85" r="4" fill={W} />
          <circle cx="146" cy="85" r="4" fill={W} />
          <path d="M150 128l-18 18 18 18M250 128l18 18-18 18M210 120l-24 52" stroke={O} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "branding":
      return (
        <g>
          <path d="M200 74c-40 0-72 30-72 66 0 20 16 30 32 30 8 0 12-4 12-10 0-4-2-6-4-9-2-2-3-5-3-8 0-8 7-14 15-14h10c22 0 40-16 40-38 0-26-30-27-30-27z" fill={W} />
          <circle cx="168" cy="120" r="7" fill={O} />
          <circle cx="196" cy="104" r="7" fill="#012f87" />
          <circle cx="224" cy="116" r="7" fill={O} />
          <path d="M300 150l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill={W} />
        </g>
      );
    case "strategy":
      return (
        <g>
          <circle cx="196" cy="130" r="64" fill={W} />
          <path d="M196 96l14 34-34 14 14-34z" fill={O} />
          <circle cx="196" cy="130" r="7" fill="#012f87" />
          <path d="M300 80v70" stroke={W} strokeWidth="6" strokeLinecap="round" />
          <path d="M300 82c14 2 20 10 34 6-6 8-6 16 0 24-16-4-24 4-34 2z" fill={O} />
        </g>
      );
    case "ecommerce":
      return (
        <g>
          <path d="M140 108h130l-12 74a14 14 0 01-14 12h-78a14 14 0 01-14-12z" fill={W} />
          <path d="M168 108v-8a26 26 0 0152 0v8" fill="none" stroke={W} strokeWidth="10" strokeLinecap="round" />
          <circle cx="180" cy="150" r="7" fill={O} />
          <circle cx="228" cy="150" r="7" fill="#012f87" />
          <path d="M296 96l10 10-40 40-14 4 4-14z" fill={O} />
        </g>
      );
    default:
      return null;
  }
}

export default function Scene({ variant, className = "" }: { variant: SceneVariant; className?: string }) {
  return (
    <div className={className}>
      <Frame>{scenes(variant)}</Frame>
    </div>
  );
}

const serviceVariant: Record<string, SceneVariant> = {
  compass: "strategy",
  palette: "branding",
  target: "performance",
  search: "seo",
  code: "web",
  chat: "social",
  star: "influencer",
  bolt: "game",
};

export function variantForServiceIcon(icon: string): SceneVariant {
  return serviceVariant[icon] ?? "strategy";
}

// Distinct on-brand gradient per service so the grid isn't monochrome.
// (Literal class names so Tailwind picks them up.)
const serviceGradient: Record<string, string> = {
  star: "from-orange-500 to-orange-700",
  bolt: "from-navy-600 to-navy-800",
  compass: "from-navy-700 to-orange-600",
  palette: "from-orange-500 to-navy-700",
  target: "from-navy-600 to-navy-900",
  search: "from-orange-400 to-orange-600",
  code: "from-navy-700 to-navy-900",
  chat: "from-orange-500 to-navy-600",
};

export function gradientForServiceIcon(icon: string): string {
  return serviceGradient[icon] ?? "from-navy-600 to-navy-800";
}

const projectVariant: Record<string, SceneVariant> = {
  "game-app-marketing": "game",
  "performance-marketing": "performance",
  "influencer-marketing": "influencer",
  "social-media": "social",
  "seo-content": "seo",
  "web-development": "web",
  "brand-strategy": "strategy",
  "creative-design": "branding",
};

export function variantForProject(firstServiceSlug: string | undefined): SceneVariant {
  if (!firstServiceSlug) return "strategy";
  return projectVariant[firstServiceSlug] ?? "strategy";
}

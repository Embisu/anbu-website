import type { SVGProps } from "react";

type IconName =
  | "compass" | "palette" | "target" | "search" | "code" | "chat"
  | "spark" | "heart" | "shield" | "bolt"
  | "arrow" | "arrowRight" | "check" | "menu" | "close" | "globe"
  | "mail" | "phone" | "pin" | "clock" | "star" | "quote"
  | "facebook" | "instagram" | "linkedin" | "youtube" | "behance" | "threads";

const paths: Record<IconName, JSX.Element> = {
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.5 6-4 1.5 2.5-6z" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h1a4 4 0 0 0 4-4c0-4-3.6-7.5-8-7.5Z" /><circle cx="7.5" cy="11.5" r="1" /><circle cx="10.5" cy="7.5" r="1" /><circle cx="15" cy="8" r="1" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  code: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13 5-2 14" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></>,
  heart: <path d="M12 20s-7-4.4-9.2-8.4C1.3 8.9 2.8 6 5.6 6c1.7 0 3 .9 3.9 2.2C10.4 6.9 11.7 6 13.4 6c2.8 0 4.3 2.9 2.8 5.6C19 15.6 12 20 12 20Z" />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />,
  bolt: <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />,
  pin: <><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9L12 3Z" />,
  quote: <><path d="M7 7c-2 0-3.5 1.6-3.5 3.6S5 14 7 14c0 2-1 3-2.5 3.5M17 7c-2 0-3.5 1.6-3.5 3.6S15 14 17 14c0 2-1 3-2.5 3.5" /></>,
  facebook: <path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2 0-3.5 1.5-3.5 3.7V8.5H8V11h2.5v8h3v-8H16l.5-2.5H13.5Z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.5" /><circle cx="16.5" cy="7.5" r="0.6" fill="currentColor" /></>,
  linkedin: <><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 10.5V16M8 7.6v.01M11.5 16v-3c0-1.2.8-2 1.9-2s1.9.8 1.9 2v3" /></>,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="3.5" /><path d="m11 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" /></>,
  behance: <><path d="M3 8h4a2 2 0 1 1 0 4H3zM3 12h4.3a2 2 0 1 1 0 4H3zM14 9h5" /><path d="M14.5 14.5h5.5c0-2.2-1.4-3.5-3-3.5s-3 1.4-3 3.3 1.4 3.2 3.2 3.2c1.3 0 2.2-.5 2.7-1.4" /></>,
  threads: <><path d="M12 21c-5 0-8-3.4-8-9s3-9 8-9c3.3 0 5.6 1.7 6.7 4.4" /><path d="M9.2 13.6c.5 1.5 1.9 2.3 3.4 2.2 1.9-.1 3-1.3 3-2.9 0-1.9-1.7-2.8-4-2.8-2.6 0-4 1.4-3.9 3.3.1 2.4 2 3.4 4.1 3.4 2.8 0 4.6-1.7 4.6-4.7" /></>,
};

export default function Icon({
  name,
  className = "h-6 w-6",
  ...props
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

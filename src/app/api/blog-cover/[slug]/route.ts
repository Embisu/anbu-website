import { NextRequest } from "next/server";

export const runtime = "edge";

const palettes = [
  ["#071735", "#1d3d91", "#f06a32"], ["#0b1738", "#155e75", "#ef8a45"],
  ["#111332", "#4c3b8f", "#e25d35"], ["#061d2b", "#126b7a", "#f3a33c"],
  ["#16142e", "#244b9b", "#db5b3b"], ["#10243a", "#287b8b", "#f47b45"],
];

function hash(value: string) {
  let output = 0;
  for (let i = 0; i < value.length; i += 1) output = (output * 31 + value.charCodeAt(i)) >>> 0;
  return output;
}

export function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const seed = hash(slug);
  const colors = palettes[seed % palettes.length];
  // The card already renders the full title below the image. Keep the cover typography minimal
  // so long slugs never overflow or compete with the category badge.
  const title = "";
  const motif = slug.includes("community") || slug.includes("discord") || slug.includes("moderation") || slug.includes("influencer") || slug.includes("creator") || slug.includes("ugc") || slug.includes("tiktok")
    ? `<circle cx="255" cy="260" r="58" fill="${colors[2]}"/><circle cx="430" cy="185" r="42" fill="${colors[1]}"/><circle cx="520" cy="350" r="50" fill="${colors[2]}" opacity=".8"/><path d="M300 240L392 200M300 295L470 335M455 215L500 315" stroke="#fff" stroke-width="10" opacity=".8"/><circle cx="255" cy="260" r="18" fill="#fff"/><circle cx="430" cy="185" r="14" fill="#fff"/><circle cx="520" cy="350" r="16" fill="#fff"/>`
    : slug.includes("seo") || slug.includes("search") || slug.includes("keyword") || slug.includes("analytics") || slug.includes("dashboard")
      ? `<circle cx="300" cy="255" r="112" fill="none" stroke="#fff" stroke-width="22" opacity=".9"/><path d="M380 335L510 465" stroke="${colors[2]}" stroke-width="32" stroke-linecap="round"/><rect x="170" y="120" width="420" height="48" rx="24" fill="#fff" opacity=".2"/><circle cx="220" cy="144" r="10" fill="${colors[2]}"/><path d="M650 420C730 360 760 300 840 235" stroke="${colors[2]}" stroke-width="14" fill="none"/><path d="M820 220l24 15-25 19" fill="none" stroke="${colors[2]}" stroke-width="10"/>`
      : slug.includes("aso") || slug.includes("app") || slug.includes("install") || slug.includes("review") || slug.includes("onboarding") || slug.includes("activation") || slug.includes("conversion") || slug.includes("launch") || slug.includes("checklist")
        ? `<rect x="210" y="95" width="250" height="410" rx="34" fill="#fff" opacity=".94"/><rect x="235" y="145" width="200" height="115" rx="18" fill="${colors[1]}"/><circle cx="335" cy="205" r="38" fill="${colors[2]}"/><rect x="250" y="300" width="170" height="18" rx="9" fill="${colors[1]}"/><rect x="250" y="340" width="125" height="18" rx="9" fill="${colors[1]}" opacity=".7"/><rect x="265" y="410" width="140" height="45" rx="22" fill="${colors[2]}"/><path d="M600 420h250M650 370l70-80 70 45 100-145" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>`
        : slug.includes("brand") || slug.includes("local") || slug.includes("story") || slug.includes("localization")
          ? `<path d="M220 410L320 180 430 410Z" fill="${colors[2]}"/><circle cx="330" cy="265" r="46" fill="#fff" opacity=".9"/><rect x="500" y="160" width="230" height="230" rx="115" fill="none" stroke="#fff" stroke-width="18"/><path d="M615 190v170M530 275h170" stroke="${colors[2]}" stroke-width="14"/><path d="M770 420l100-170 100 170Z" fill="${colors[1]}"/>`
          : `<rect x="165" y="180" width="400" height="260" rx="28" fill="#fff" opacity=".14"/><path d="M205 380L290 300 360 335 470 225 530 270" fill="none" stroke="${colors[2]}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><circle cx="290" cy="300" r="14" fill="#fff"/><circle cx="470" cy="225" r="14" fill="#fff"/><path d="M700 430l85-150 85 150" fill="${colors[2]}" opacity=".9"/><rect x="735" y="205" width="100" height="120" rx="16" fill="${colors[1]}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1080" cy="80" r="180" fill="${colors[2]}" opacity=".16"/><circle cx="80" cy="590" r="220" fill="#fff" opacity=".05"/><rect x="70" y="70" width="1060" height="490" rx="42" fill="#06122d" opacity=".35"/><text x="120" y="125" fill="${colors[2]}" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">ANBU INSIGHT</text>${motif}<text x="690" y="315" fill="#fff" font-family="Arial, sans-serif" font-size="31" font-weight="700">${title}</text><text x="690" y="370" fill="#fff" opacity=".78" font-family="Arial, sans-serif" font-size="19">GAME MARKETING • VIETNAM</text><rect x="690" y="415" width="250" height="5" rx="2" fill="${colors[2]}"/></svg>`;
  return new Response(svg, { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=31536000, immutable" } });
}

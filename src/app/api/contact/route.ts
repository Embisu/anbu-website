import { NextResponse } from "next/server";

// Cloudflare Pages requires the Edge runtime. `fs` is not available here,
// so leads are delivered by email (Resend). To also persist leads, connect
// Cloudflare KV/D1 or a CRM webhook where indicated below.
export const runtime = "edge";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  market?: string;
  stage?: string;
  launchDate?: string;
  briefUrl?: string;
  message?: string;
  website?: string; // honeypot
  locale?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(entry: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return false;

  const esc = (s: string) => (s || "").replace(/</g, "&lt;");
  const html = `
    <h2>New lead from ANBU website</h2>
    <ul>
      <li><strong>Name:</strong> ${esc(entry.name)}</li>
      <li><strong>Email:</strong> ${esc(entry.email)}</li>
      <li><strong>Phone:</strong> ${esc(entry.phone) || "-"}</li>
      <li><strong>Company:</strong> ${esc(entry.company) || "-"}</li>
      <li><strong>Service:</strong> ${esc(entry.service) || "-"}</li>
      <li><strong>Budget:</strong> ${esc(entry.budget) || "-"}</li>
      <li><strong>Market:</strong> ${esc(entry.market) || "-"}</li>
      <li><strong>Stage:</strong> ${esc(entry.stage) || "-"}</li>
      <li><strong>Expected launch:</strong> ${esc(entry.launchDate) || "-"}</li>
      <li><strong>Brief:</strong> ${esc(entry.briefUrl) || "-"}</li>
      <li><strong>Language:</strong> ${esc(entry.locale) || "-"}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${esc(entry.message)}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(isValidEmail(entry.email) ? { reply_to: entry.email } : {}),
      subject: `[ANBU] New lead: ${entry.name}`,
      html,
    }),
  });
  if (!res.ok) {
    console.warn("[contact] Resend responded with", res.status);
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill this
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }); // pretend success, drop spam
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const service = (body.service || "").trim();
  const message = (body.message || "").trim();

  // Require name, a way to reach us (email OR phone), a service and a message.
  if (!name || (!isValidEmail(email) && !phone) || !service || !message) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const entry = {
    name,
    email,
    phone,
    company: (body.company || "").trim(),
    service,
    budget: (body.budget || "").trim(),
    market: (body.market || "").trim(),
    stage: (body.stage || "").trim(),
    launchDate: (body.launchDate || "").trim(),
    briefUrl: (body.briefUrl || "").trim(),
    message,
    locale: (body.locale || "").trim(),
    createdAt: new Date().toISOString(),
  };

  // Visible in Cloudflare Pages Functions logs (Real-time logs / wrangler tail)
  console.log("[contact] New submission:", JSON.stringify({ name: entry.name, email: entry.email, service: entry.service }));

  try {
    const delivered = await sendEmail(entry);
    if (!delivered) {
      return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
    }
  } catch (err) {
    console.warn("[contact] email send failed:", (err as Error).message);
    return NextResponse.json({ ok: false, error: "email_delivery_failed" }, { status: 502 });
  }

  // TODO (optional): persist to Cloudflare KV/D1 or forward to a CRM webhook here.

  return NextResponse.json({ ok: true });
}

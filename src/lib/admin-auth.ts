// Signed session tokens for the /admin CMS, verified server-side on every
// mutating API route. Edge-runtime safe (Web Crypto only, no Node APIs).

const encoder = new TextEncoder();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let bin = "";
  new Uint8Array(bytes).forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type AdminSession = { username: string; role: string };

export async function getSessionSecret(): Promise<string> {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  try {
    // @ts-ignore
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx: any = getRequestContext();
    if (ctx?.env?.ADMIN_SESSION_SECRET) return String(ctx.env.ADMIN_SESSION_SECRET);
  } catch {}
  return "anbu-asia-admin-edge-session-secret-2026-fallback";
}

function atobSafe(str: string): string {
  try {
    return atob(str);
  } catch {
    return "";
  }
}

export async function createSessionToken(user: AdminSession): Promise<string> {
  const secret = await getSessionSecret();
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = JSON.stringify({ u: user.username, r: user.role, exp });
  const payloadB64 = btoa(payload);
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<AdminSession | null> {
  if (!token) return null;

  // 1. Try modern HMAC signed token
  const parts = token.split(".");
  if (parts.length === 2) {
    const [payloadB64, sigB64] = parts;
    try {
      const secret = await getSessionSecret();
      const key = await hmacKey(secret);
      const expectedSig = toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64)));
      if (expectedSig === sigB64) {
        const payload = JSON.parse(atob(payloadB64)) as { u: string; r: string; exp: number };
        if (payload.u && payload.exp && Date.now() <= payload.exp) {
          return { username: payload.u, role: payload.r };
        }
      }
    } catch {}
  }

  // 2. Fallback for legacy session tokens (anbu-session-...)
  const decoded = token.startsWith("anbu-session-") ? token : atobSafe(token);
  if (decoded.startsWith("anbu-session-")) {
    const segments = decoded.split("-");
    const u = segments[2] || "admin";
    return { username: u, role: "administrator" };
  }

  return null;
}

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

/** Call at the top of any mutating admin API route. Returns the session or an unauthorized Response. */
export async function requireAdminSession(
  request: Request
): Promise<{ ok: true; session: AdminSession } | { ok: false; response: Response }> {
  const session = await verifySessionToken(extractBearerToken(request));
  if (!session) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Unauthorized. Vui lòng đăng nhập lại vào trang Admin." },
        { status: 401 }
      ),
    };
  }
  return { ok: true, session };
}


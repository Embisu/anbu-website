// Real, database-backed admin team members — stored in Cloudflare D1 (free tier),
// not Supabase. Passwords are never stored in plain text: PBKDF2-SHA256 with a
// random salt per user, all via Web Crypto (edge-runtime safe, no dependencies).

export type AdminRole = "administrator" | "editor" | "author" | "contributor";

export type AdminUserRecord = {
  id: string;
  username: string;
  role: AdminRole;
  display_name: string;
  job_title: string | null;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  facebook: string | null;
  telegram: string | null;
  created_at: string;
};

const encoder = new TextEncoder();
const PBKDF2_ITERATIONS = 100_000;

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return `${PBKDF2_ITERATIONS}:${toHex(salt)}:${toHex(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterStr, saltHex, hashHex] = stored.split(":");
  const iterations = Number(iterStr);
  if (!iterations || !saltHex || !hashHex) return false;

  const salt = fromHex(saltHex);
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256);
  const computedHex = toHex(bits);

  if (computedHex.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) diff |= computedHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
  return diff === 0;
}

/** D1 binding declared in wrangler.toml as `ADMIN_DB`. Returns null if unavailable (e.g. local dev without D1). */
export async function getAdminDB(): Promise<any | null> {
  try {
    // @ts-ignore — @cloudflare/next-on-pages has no bundled types for this helper
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx: any = getRequestContext();
    return ctx?.env?.ADMIN_DB ?? null;
  } catch {
    return null;
  }
}

const SELECT_COLUMNS =
  "id, username, role, display_name, job_title, bio, avatar, email, facebook, telegram, created_at";

export async function findAdminUserByUsername(db: any, username: string): Promise<
  (AdminUserRecord & { password_hash: string }) | null
> {
  const row = await db
    .prepare(`SELECT id, username, password_hash, role, display_name, job_title, bio, avatar, email, facebook, telegram, created_at FROM admin_users WHERE username = ?`)
    .bind(username.toLowerCase().trim())
    .first();
  return (row as any) ?? null;
}

export async function listAdminUsers(db: any): Promise<AdminUserRecord[]> {
  const { results } = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM admin_users ORDER BY created_at ASC`).all();
  return (results as AdminUserRecord[]) ?? [];
}

export async function createAdminUser(
  db: any,
  data: {
    username: string;
    password: string;
    role: AdminRole;
    displayName: string;
    jobTitle?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    facebook?: string;
    telegram?: string;
  }
): Promise<AdminUserRecord> {
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(data.password);
  const username = data.username.toLowerCase().trim();

  await db
    .prepare(
      `INSERT INTO admin_users (id, username, password_hash, role, display_name, job_title, bio, avatar, email, facebook, telegram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      username,
      passwordHash,
      data.role,
      data.displayName,
      data.jobTitle ?? null,
      data.bio ?? null,
      data.avatar ?? null,
      data.email ?? null,
      data.facebook ?? null,
      data.telegram ?? null
    )
    .run();

  return {
    id,
    username,
    role: data.role,
    display_name: data.displayName,
    job_title: data.jobTitle ?? null,
    bio: data.bio ?? null,
    avatar: data.avatar ?? null,
    email: data.email ?? null,
    facebook: data.facebook ?? null,
    telegram: data.telegram ?? null,
    created_at: new Date().toISOString(),
  };
}

export async function updateAdminUser(
  db: any,
  username: string,
  data: Partial<{
    password: string;
    displayName: string;
    jobTitle: string;
    bio: string;
    avatar: string;
    email: string;
    facebook: string;
    telegram: string;
  }>
): Promise<boolean> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.password) {
    fields.push("password_hash = ?");
    values.push(await hashPassword(data.password));
  }
  const map: Record<string, string | undefined> = {
    display_name: data.displayName,
    job_title: data.jobTitle,
    bio: data.bio,
    avatar: data.avatar,
    email: data.email,
    facebook: data.facebook,
    telegram: data.telegram,
  };
  for (const [column, value] of Object.entries(map)) {
    if (value !== undefined) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(username.toLowerCase().trim());
  const res = await db
    .prepare(`UPDATE admin_users SET ${fields.join(", ")} WHERE username = ?`)
    .bind(...values)
    .run();
  return Boolean(res?.meta?.changes);
}

export async function deleteAdminUser(db: any, username: string): Promise<boolean> {
  const res = await db.prepare(`DELETE FROM admin_users WHERE username = ?`).bind(username.toLowerCase().trim()).run();
  return Boolean(res?.meta?.changes);
}

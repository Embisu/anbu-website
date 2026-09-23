-- Admin team members with real login credentials.
-- Passwords are never stored in plain text: password_hash holds
-- "iterations:saltHex:hashHex" produced by PBKDF2-SHA256 (see src/lib/admin-users.ts).
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('administrator', 'editor', 'author', 'contributor')),
  display_name TEXT NOT NULL,
  job_title TEXT,
  bio TEXT,
  avatar TEXT,
  email TEXT,
  facebook TEXT,
  telegram TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users (username);

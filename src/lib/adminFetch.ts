// fetch() wrapper for admin-panel calls: attaches the signed session token
// (issued at /api/admin/auth login) as a Bearer header so protected API
// routes can verify the caller is actually logged in.
export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("anbu_admin_token") : null;
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

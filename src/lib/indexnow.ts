export const INDEXNOW_KEY = "e4c9f7a18b2d41039b56f28a31e8c740";
export const INDEXNOW_HOST = "anbu.asia";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export async function submitToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status: number;
  message: string;
}> {
  if (!urls || urls.length === 0) {
    return { ok: false, status: 400, message: "No URLs provided" };
  }

  // Ensure all URLs are absolute https://anbu.asia/...
  const cleanUrls = urls.map((u) => {
    if (u.startsWith("http")) return u;
    const cleanPath = u.startsWith("/") ? u : `/${u}`;
    return `https://${INDEXNOW_HOST}${cleanPath}`;
  });

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: cleanUrls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "ANBU-IndexNow-Client/1.0",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      return {
        ok: true,
        status: res.status,
        message: `Successfully submitted ${cleanUrls.length} URL(s) to IndexNow (Bing/Yandex/Naver/Seznam).`,
      };
    }

    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      message: `IndexNow returned status ${res.status}: ${text || res.statusText}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      message: `Failed to ping IndexNow: ${err.message}`,
    };
  }
}

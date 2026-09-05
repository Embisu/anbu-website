// Script to ping IndexNow (Bing, Yandex, Naver, Seznam) with all URLs from ANBU website
const INDEXNOW_KEY = "e4c9f7a18b2d41039b56f28a31e8c740";
const INDEXNOW_HOST = "anbu.asia";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

console.log(`📡 Pinging IndexNow for ${INDEXNOW_HOST}...`);

const targetUrls = [
  `https://${INDEXNOW_HOST}/vi`,
  `https://${INDEXNOW_HOST}/en`,
  `https://${INDEXNOW_HOST}/vi/blog`,
  `https://${INDEXNOW_HOST}/en/blog`,
  `https://${INDEXNOW_HOST}/vi/services`,
  `https://${INDEXNOW_HOST}/en/services`,
  `https://${INDEXNOW_HOST}/vi/work`,
  `https://${INDEXNOW_HOST}/en/work`,
  `https://${INDEXNOW_HOST}/vi/contact`,
  `https://${INDEXNOW_HOST}/en/contact`,
  `https://${INDEXNOW_HOST}/vi/about`,
  `https://${INDEXNOW_HOST}/en/about`,
];

const payload = {
  host: INDEXNOW_HOST,
  key: INDEXNOW_KEY,
  keyLocation: INDEXNOW_KEY_LOCATION,
  urlList: targetUrls,
};

async function ping() {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "ANBU-IndexNow-CLI/1.0",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow Ping thành công! (Mã phản hồi: ${res.status})`);
      console.log(`🚀 Đã gửi thông báo ${targetUrls.length} URL tới Bing, Yandex, Naver, Seznam.`);
    } else {
      const text = await res.text();
      console.warn(`⚠️ IndexNow phản hồi mã ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối IndexNow:", err.message);
  }
}

ping();

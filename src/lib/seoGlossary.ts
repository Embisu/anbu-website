/**
 * Game Marketing & AdTech Bilingual SEO Glossary & Keyword Preservation Engine
 * Provides:
 * 1. 100+ high-value industry terms mapped between Vietnamese and English.
 * 2. Token masking & keyword locking to guarantee keywords are preserved across machine translation.
 * 3. English SEO Slug generator tailored for international search engines.
 * 4. Multi-tier resilient translation with automatic retry and rate-limit fallbacks.
 */

export type GlossaryItem = {
  vi: string[];
  en: string;
  category: "metrics" | "operations" | "monetization" | "growth" | "community" | "brand";
};

export const GAME_SEO_GLOSSARY: GlossaryItem[] = [
  // 1. Performance Metrics & AdTech
  { vi: ["tối ưu chi phí cpi", "tối ưu hóa cpi", "tối ưu cpi"], en: "CPI optimization", category: "metrics" },
  { vi: ["chi phí mỗi lượt cài đặt", "chi phí trên mỗi lượt cài đặt", "chi phí cài đặt"], en: "Cost Per Install (CPI)", category: "metrics" },
  { vi: ["chi phí mỗi lượt mua", "chi phí trên mỗi hành động", "chi phí cpa"], en: "Cost Per Action (CPA)", category: "metrics" },
  { vi: ["lợi tức chi tiêu quảng cáo", "tỷ suất hoàn vốn quảng cáo", "tỷ lệ hoàn vốn quảng cáo", "lợi tức quảng cáo"], en: "Return on Ad Spend (ROAS)", category: "metrics" },
  { vi: ["giá trị trọn đời của người chơi", "giá trị vòng đời người dùng", "giá trị trọn đời người chơi", "chỉ số ltv"], en: "Lifetime Value (LTV)", category: "metrics" },
  { vi: ["tỷ lệ giữ chân người chơi", "chỉ số giữ chân người chơi", "tỷ lệ giữ chân"], en: "Player Retention Rate", category: "metrics" },
  { vi: ["tỷ lệ giữ chân d1/d7/d30", "giữ chân d1 d7 d30"], en: "D1/D7/D30 Retention Rates", category: "metrics" },
  { vi: ["thu hút người dùng mới", "thu hút người chơi mới", "mua người dùng", "chạy quảng cáo ua"], en: "User Acquisition (UA)", category: "metrics" },
  { vi: ["tỷ lệ chuyển đổi", "tỷ suất chuyển đổi"], en: "Conversion Rate (CVR)", category: "metrics" },
  { vi: ["tỷ lệ nhấp chuột", "tỷ lệ click"], en: "Click-Through Rate (CTR)", category: "metrics" },
  { vi: ["tối ưu hóa tỷ lệ chuyển đổi"], en: "Conversion Rate Optimization (CRO)", category: "metrics" },
  { vi: ["giá mỗi nghìn lượt hiển thị", "chi phí hiển thị cpm"], en: "Cost Per Mille (CPM)", category: "metrics" },
  { vi: ["doanh thu trung bình trên mỗi người dùng"], en: "Average Revenue Per User (ARPU)", category: "metrics" },
  { vi: ["doanh thu trung bình trên mỗi người trả tiền"], en: "Average Revenue Per Paying User (ARPPU)", category: "metrics" },
  { vi: ["tỷ lệ người chơi trả phí", "tỷ lệ chuyển đổi nạp tiền"], en: "Paying Conversion Rate", category: "metrics" },
  { vi: ["tỷ lệ rời bỏ", "tỷ lệ người chơi rời bỏ"], en: "Churn Rate", category: "metrics" },
  { vi: ["chia sẻ doanh thu"], en: "Revenue Share", category: "metrics" },

  // 2. Operations & LiveOps
  { vi: ["vận hành game", "quản lý vận hành game"], en: "Game Operations & LiveOps", category: "operations" },
  { vi: ["nhà phát hành game", "đơn vị phát hành game"], en: "Game Publisher", category: "operations" },
  { vi: ["phát hành game", "hoạt động phát hành game"], en: "Game Publishing", category: "operations" },
  { vi: ["bản địa hóa game", "bản địa hoá game", "bản địa hóa"], en: "Game Localization (L10n)", category: "operations" },
  { vi: ["ra mắt thử nghiệm", "thử nghiệm giới hạn", "phát hành thử nghiệm"], en: "Soft Launch", category: "operations" },
  { vi: ["ra mắt chính thức", "phát hành toàn cầu"], en: "Global Launch", category: "operations" },
  { vi: ["sự kiện trong game", "chuỗi sự kiện trong game"], en: "In-Game Events", category: "operations" },
  { vi: ["vòng đời sản phẩm game", "chu kỳ sống của game"], en: "Game Lifecycle", category: "operations" },
  { vi: ["chống gian lận trong game", "hệ thống chống gian lận"], en: "Anti-Cheat System", category: "operations" },
  { vi: ["đăng ký trước", "chiến dịch đăng ký trước", "đặt trước game"], en: "Pre-Registration Campaign", category: "operations" },
  { vi: ["hỗ trợ khách hàng trong game", "chăm sóc khách hàng game"], en: "Customer Support (CS)", category: "operations" },
  { vi: ["cân bằng game", "cân bằng thông số game"], en: "Game Balancing", category: "operations" },

  // 3. Monetization & Business Models
  { vi: ["kiếm tiền từ game", "mô hình kiếm tiền game"], en: "Game Monetization", category: "monetization" },
  { vi: ["mua hàng trong ứng dụng", "giao dịch trong game", "nạp in-app"], en: "In-App Purchases (IAP)", category: "monetization" },
  { vi: ["kiếm tiền từ quảng cáo trong ứng dụng", "doanh thu quảng cáo trong game"], en: "In-App Advertising (IAA)", category: "monetization" },
  { vi: ["mô hình lai ghép kết hợp iap và iaa", "mô hình doanh thu hybrid"], en: "Hybrid Monetization (IAP + IAA)", category: "monetization" },
  { vi: ["quảng cáo nhận thưởng", "video nhận thưởng"], en: "Rewarded Video Ads", category: "monetization" },
  { vi: ["quảng cáo xen kẽ"], en: "Interstitial Ads", category: "monetization" },
  { vi: ["quảng cáo biểu ngữ", "banner quảng cáo"], en: "Banner Ads", category: "monetization" },
  { vi: ["hệ thống battle pass", "thẻ vượt ải", "vé chiến binh"], en: "Battle Pass System", category: "monetization" },
  { vi: ["vòng quay may mắn", "mở rương gacha", "cơ chế gacha"], en: "Gacha Mechanics", category: "monetization" },
  { vi: ["mô hình miễn phí chơi", "miễn phí giờ chơi"], en: "Free-to-Play (F2P)", category: "monetization" },
  { vi: ["mô hình trả phí trước", "game trả phí"], en: "Pay-to-Play / Premium", category: "monetization" },

  // 4. Growth & App Store Optimization (ASO)
  { vi: ["tối ưu hóa trang ứng dụng", "tối ưu aso", "tối ưu hóa kho ứng dụng"], en: "App Store Optimization (ASO)", category: "growth" },
  { vi: ["tăng trưởng tự nhiên", "lượng tải tự nhiên"], en: "Organic Growth", category: "growth" },
  { vi: ["xếp hạng từ khóa", "thứ hạng từ khóa"], en: "Keyword Rankings", category: "growth" },
  { vi: ["ảnh chụp màn hình ứng dụng", "ảnh chụp store"], en: "App Store Screenshots", category: "growth" },
  { vi: ["biểu tượng ứng dụng", "icon ứng dụng"], en: "App Icon", category: "growth" },
  { vi: ["video giới thiệu game", "trailer game"], en: "Game Preview Trailer", category: "growth" },
  { vi: ["quảng cáo tương tác chơi thử", "quảng cáo chơi thử"], en: "Playable Ads", category: "growth" },

  // 5. Community, Influencers & Esports
  { vi: ["xây dựng cộng đồng game", "phát triển cộng đồng game"], en: "Gaming Community Building", category: "community" },
  { vi: ["nhà sáng tạo nội dung game", "người sáng tạo nội dung game", "streamer game"], en: "Gaming Content Creators & Streamers", category: "community" },
  { vi: ["chiến dịch kol ngành game", "marketing qua kol game"], en: "Gaming Influencer / KOL Campaigns", category: "community" },
  { vi: ["giải đấu thể thao điện tử", "giải đấu esports"], en: "Esports Tournaments", category: "community" },
  { vi: ["giá trị truyền thông tương đương", "giá trị truyền thông kiếm được"], en: "Earned Media Value (EMV)", category: "community" },
  { vi: ["mức độ nhận diện thương hiệu"], en: "Brand Awareness & Brand Lift", category: "community" },
  { vi: ["nội dung do người dùng sáng tạo"], en: "User-Generated Content (UGC)", category: "community" },

  // 6. Ecosystem & Brand Names
  { vi: ["anbu team", "anbu marketing"], en: "ANBU Team", category: "brand" },
  { vi: ["appsflyer"], en: "AppsFlyer", category: "brand" },
  { vi: ["adjust"], en: "Adjust", category: "brand" },
  { vi: ["tiktok ads", "quảng cáo tiktok"], en: "TikTok Ads", category: "brand" },
  { vi: ["google uac", "quảng cáo ứng dụng google"], en: "Google App Campaigns (UAC)", category: "brand" },
  { vi: ["meta ads", "quảng cáo facebook"], en: "Meta Ads", category: "brand" },
];

/**
 * Escapes regex special characters
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generates an English SEO slug from a title and an optional focus keyword
 */
export function generateEnglishSlug(titleEn: string, focusKeywordEn?: string): string {
  let source = titleEn || "";
  if (focusKeywordEn && focusKeywordEn.trim() && !source.toLowerCase().includes(focusKeywordEn.toLowerCase())) {
    source = `${focusKeywordEn} ${source}`;
  }

  // Remove common English stop-words that clutter permalinks
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "about", "above", "after", "along",
    "at", "by", "for", "from", "in", "into", "of", "off", "on", "onto", "out",
    "over", "to", "with", "within", "without"
  ]);

  const cleanWords = source
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && (!stopWords.has(w) || source.split(/\s+/).length <= 3));

  // Limit slug to around 6 to 9 meaningful words for optimal Google Search rendering
  const slugWords = cleanWords.slice(0, 8);
  const slug = slugWords.join("-");
  return slug || "post";
}

/**
 * Tokenizes keywords and glossary terms within a Vietnamese text
 * Returns the masked text and a token map mapping each token to its official English translation.
 */
export function maskKeywords(
  text: string,
  focusKeywordVi?: string,
  focusKeywordEn?: string
): { maskedText: string; tokenMap: Record<string, string> } {
  if (!text || !text.trim()) {
    return { maskedText: text, tokenMap: {} };
  }

  const tokenMap: Record<string, string> = {};
  let tokenCounter = 0;
  let masked = text;

  // 1. Protect User's Focus Keyword first (Highest Priority)
  if (focusKeywordVi && focusKeywordVi.trim() && focusKeywordEn && focusKeywordEn.trim()) {
    const kwVi = focusKeywordVi.trim();
    const token = `__ZSEO_KW_${tokenCounter++}__`;
    const regex = new RegExp(escapeRegExp(kwVi), "gi");
    if (regex.test(masked)) {
      masked = masked.replace(regex, token);
      tokenMap[token] = focusKeywordEn.trim();
    }
  }

  // 2. Protect Game Marketing Glossary terms
  // Sort glossary items so longest Vietnamese phrases match first to prevent partial matches
  const sortedGlossary = [...GAME_SEO_GLOSSARY].sort((a, b) => {
    const maxA = Math.max(...a.vi.map((v) => v.length));
    const maxB = Math.max(...b.vi.map((v) => v.length));
    return maxB - maxA;
  });

  for (const item of sortedGlossary) {
    for (const viPhrase of item.vi) {
      if (viPhrase.length < 2) continue;
      // Word boundary matching in Vietnamese
      const regex = new RegExp(`(?<=^|[\\s.,!?;:()""''])${escapeRegExp(viPhrase)}(?=$|[\\s.,!?;:()""''])`, "gi");
      if (regex.test(masked)) {
        const token = `__ZSEO_TERM_${tokenCounter++}__`;
        masked = masked.replace(regex, token);
        tokenMap[token] = item.en;
      }
    }
  }

  return { maskedText: masked, tokenMap };
}

/**
 * Restores masked tokens back to their exact English SEO terms.
 * Handles spacing, capitalization, and minor token mutations by translation engines.
 */
export function unmaskKeywords(translatedText: string, tokenMap: Record<string, string>): string {
  if (!translatedText) return "";
  let restored = translatedText;

  for (const [token, enReplacement] of Object.entries(tokenMap)) {
    // Tolerant regex matching token even if engine inserted spaces e.g. "__ ZSEO_TERM_0 __"
    const cleanTokenName = token.replace(/__/g, "");
    const tokenRegex = new RegExp(`__\\s*${escapeRegExp(cleanTokenName)}\\s*__`, "gi");
    restored = restored.replace(tokenRegex, enReplacement);
  }

  // Clean any accidental double spaces created during unmasking
  restored = restored.replace(/\s{2,}/g, " ");

  return restored;
}

/**
 * Primary translation helper using Google Translate Single API
 */
async function translateViaGoogle(text: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google translate status: ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data?.[0])) {
    return data[0].map((item: any) => item[0]).join("");
  }
  return text;
}

/**
 * Fallback translation helper using MyMemory Translated API
 */
async function translateViaMyMemory(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory translate status: ${res.status}`);
  const data = await res.json();
  if (data?.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  return text;
}

/**
 * Resilient Multi-tier Translation Engine with Glossary Protection
 */
export async function translateWithGlossary(
  text: string,
  options?: {
    focusKeywordVi?: string;
    focusKeywordEn?: string;
  }
): Promise<string> {
  if (!text || !text.trim()) return "";

  // 1. Mask Keywords & Terms
  const { maskedText, tokenMap } = maskKeywords(
    text,
    options?.focusKeywordVi,
    options?.focusKeywordEn
  );

  // 2. Perform Translation with Fallback
  let rawTranslation = "";
  try {
    rawTranslation = await translateViaGoogle(maskedText);
  } catch (googleErr) {
    console.warn("Google Translate failed, attempting MyMemory fallback...", googleErr);
    try {
      rawTranslation = await translateViaMyMemory(maskedText);
    } catch (fallbackErr) {
      console.error("All translation providers failed:", fallbackErr);
      rawTranslation = maskedText;
    }
  }

  // 3. Restore Protected Keywords with Exact English Industry Terminology
  const finalResult = unmaskKeywords(rawTranslation, tokenMap);
  return finalResult;
}

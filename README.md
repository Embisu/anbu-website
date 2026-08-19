# ANBU — Website Agency (Next.js)

Website chính thức của **ANBU** — agency toàn diện (thương hiệu · marketing · công nghệ).
Song ngữ **Tiếng Việt / English**, thiết kế hiện đại, backend thật (API xử lý form) và tối ưu **SEO** tối đa.

---

## ✨ Tính năng chính

- **Song ngữ VI/EN** với định tuyến `/vi` và `/en`, tự động chuyển hướng theo ngôn ngữ trình duyệt, có nút chuyển ngôn ngữ và thẻ `hreflang` chuẩn SEO.
- **6 nhóm trang đầy đủ**: Trang chủ, Dịch vụ (+ trang chi tiết từng dịch vụ), Dự án/Case study (+ chi tiết), Về ANBU, Blog (+ bài viết chi tiết), Liên hệ, cùng Chính sách bảo mật & Điều khoản.
- **Backend thật**: API route `/api/contact` nhận form, validate, chống spam (honeypot), lưu lead vào file và **gửi email tự động** (qua Resend nếu cấu hình).
- **SEO tối đa**: Server-Side Rendering, metadata riêng từng trang, `sitemap.xml` động, `robots.txt`, dữ liệu có cấu trúc (JSON-LD: Organization, Service, BlogPosting, CreativeWork), Open Graph + Twitter Card, `hreflang`, ảnh OG thương hiệu.
- **Hiệu năng**: Next.js 14 App Router, `next/font` (tối ưu font), `next/image`, hiệu ứng reveal khi cuộn nhẹ nhàng, tôn trọng `prefers-reduced-motion`.
- **Thương hiệu ANBU**: dùng đúng logo, màu navy `#012f87` và cam `#f5501e`, favicon & app icon từ bộ logo pack của bạn.

---

## 🛠 Công nghệ

| Thành phần | Lựa chọn |
|---|---|
| Framework | Next.js 14 (App Router) |
| Ngôn ngữ | TypeScript |
| Giao diện | Tailwind CSS |
| Đa ngôn ngữ | i18n tự triển khai (dictionary + middleware) |
| Email lead | Resend API (tuỳ chọn) |
| Font | Be Vietnam Pro (hỗ trợ đầy đủ tiếng Việt) |

---

## 🚀 Cách chạy

Yêu cầu: **Node.js 18.17+** (khuyến nghị Node 20).

> ⚠️ Nếu trong thư mục đã có sẵn `node_modules` hoặc `.next` (rỗng/không đầy đủ) từ trước, hãy **xoá chúng đi** rồi mới cài, để tránh lỗi:
> ```bash
> # Windows PowerShell
> Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue
> ```

```bash
# 1. Cài đặt thư viện
npm install

# 2. Tạo file cấu hình môi trường
copy .env.example .env.local        # Windows
# cp .env.example .env.local        # macOS/Linux

# 3. Chạy môi trường phát triển
npm run dev
# Mở http://localhost:3000  (tự chuyển đến /vi hoặc /en)

# 4. Build production
npm run build
npm start
```

---

## ⚙️ Cấu hình môi trường (`.env.local`)

```env
# URL công khai của site — DÙNG CHO SEO (sitemap, canonical, OG). Không có "/" ở cuối.
NEXT_PUBLIC_SITE_URL=https://anbu.vn

# (Tuỳ chọn) Gửi email lead qua Resend — https://resend.com
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=hello@anbu.vn
CONTACT_FROM_EMAIL=website@anbu.vn
```

**Về form liên hệ:**
- Nếu **không** cấu hình Resend: form vẫn hoạt động, lead được ghi vào `data/submissions.json` và in ra log server.
- Nếu **có** cấu hình Resend: mỗi lead sẽ được gửi email về `CONTACT_TO_EMAIL`.
- Có thể thay Resend bằng nhà cung cấp khác bằng cách sửa hàm `sendEmail` trong `src/app/api/contact/route.ts`.

---

## 📁 Cấu trúc thư mục

```
src/
├─ app/
│  ├─ [locale]/            # Toàn bộ trang, có tiền tố ngôn ngữ (/vi, /en)
│  │  ├─ layout.tsx        # Layout gốc: font, header, footer, metadata, JSON-LD Organization
│  │  ├─ page.tsx          # Trang chủ
│  │  ├─ services/         # Dịch vụ (list + [slug] chi tiết)
│  │  ├─ work/             # Dự án / case study (list + [slug])
│  │  ├─ blog/             # Blog (list + [slug])
│  │  ├─ about/ contact/ privacy/ terms/
│  │  └─ not-found.tsx
│  ├─ api/contact/route.ts # Backend xử lý form liên hệ
│  ├─ sitemap.ts           # sitemap.xml động
│  ├─ robots.ts            # robots.txt
│  ├─ manifest.ts          # PWA manifest
│  └─ icon.png / apple-icon.png
├─ components/             # Header, Footer, cards, ContactForm, Icon, Reveal, ...
├─ content/                # NỘI DUNG (chỉnh ở đây): services, projects, posts, team, ...
├─ i18n/                   # Cấu hình ngôn ngữ + từ điển messages/vi.ts, en.ts
├─ lib/                    # seo.ts (metadata helper), utils.ts
└─ middleware.ts           # Định tuyến & tự phát hiện ngôn ngữ
```

---

## ✏️ Cách chỉnh sửa nội dung

Bạn **không cần đụng tới code giao diện** — chỉ sửa các file trong `src/content/`:

- **Thông tin công ty** (email, hotline, địa chỉ, mạng xã hội, số liệu): `src/content/site.ts`
- **Dịch vụ**: `src/content/services.ts`
- **Dự án / case study**: `src/content/projects.ts`
- **Bài viết blog**: `src/content/posts.ts`
- **Đội ngũ**: `src/content/team.ts`
- **Cảm nhận khách hàng**: `src/content/testimonials.ts`
- **Chữ giao diện (nút, nhãn, menu…)**: `src/i18n/messages/vi.ts` và `en.ts`

Mỗi nội dung có 2 ngôn ngữ dạng `{ vi: "...", en: "..." }`. Cứ điền cả hai là site tự hiển thị đúng theo ngôn ngữ.

---

## 🌐 Triển khai (deploy)

Dự án đã được cấu hình sẵn cho **Cloudflare Pages** (adapter `@cloudflare/next-on-pages`, Edge runtime). Xem hướng dẫn bấm-từng-bước chi tiết trong **[DEPLOY.md](./DEPLOY.md)**.

Tóm tắt nhanh (Cách qua GitHub):
1. Đưa mã nguồn lên GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → chọn repo.
3. Build command `npx @cloudflare/next-on-pages@1`, output `.vercel/output/static`.
4. Thêm biến môi trường + bật compatibility flag `nodejs_compat` → Deploy.

Hoặc deploy bằng lệnh: `npx wrangler login` rồi `npm run pages:deploy`.

> Lưu ý: trên Edge (Cloudflare) không ghi được file, nên lead từ form được gửi qua **Resend** (email). Muốn lưu lead vào cơ sở dữ liệu, nối **Cloudflare KV/D1** tại chỗ đánh dấu `TODO` trong `src/app/api/contact/route.ts`.

---

## ✅ Checklist SEO đã tích hợp sẵn

- [x] SSR + metadata riêng cho từng trang (title, description, canonical)
- [x] `hreflang` cho VI/EN + `x-default`
- [x] `sitemap.xml` động (bao gồm mọi trang + dịch vụ + dự án + bài viết)
- [x] `robots.txt`
- [x] JSON-LD: Organization, Service, BlogPosting, CreativeWork, ItemList
- [x] Open Graph + Twitter Card + ảnh OG thương hiệu
- [x] Favicon, apple-touch-icon, PWA manifest
- [x] HTML ngữ nghĩa, thẻ heading hợp lý, `alt` cho ảnh, skip-to-content, hỗ trợ bàn phím

Sau khi deploy, nhớ khai báo `sitemap.xml` trong **Google Search Console** để được index nhanh.

---

© ANBU Agency. Được thiết kế & phát triển cho thương hiệu muốn bứt phá.

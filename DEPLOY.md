# 🚀 Deploy website ANBU lên Cloudflare Pages

Dự án đã được cấu hình sẵn để chạy trên **Cloudflare Pages** (dùng adapter `@cloudflare/next-on-pages`, chạy trên Edge runtime của Cloudflare). Có 2 cách: qua **Dashboard + GitHub** (khuyên dùng, tự động deploy mỗi lần cập nhật) hoặc qua **lệnh Wrangler**.

---

## ✅ Chuẩn bị

1. Cài **Node.js 20**: https://nodejs.org
2. Có tài khoản **Cloudflare** (miễn phí): https://dash.cloudflare.com
3. Trong thư mục `anbu-website`, chạy thử build Cloudflare:
   ```bash
   npm install
   npm run pages:build
   ```
   Thành công sẽ tạo thư mục `.vercel/output/static`.

> Lưu ý quan trọng: bắt buộc bật cờ **`nodejs_compat`** (đã khai trong `wrangler.toml`, và cần chọn lại trong Dashboard ở Cách 1 — xem bên dưới).

---

## Cách 1 — Cloudflare Dashboard + GitHub (khuyên dùng)

**Bước 1. Đưa mã nguồn lên GitHub**
- Tạo repo `anbu-website` trên GitHub (dùng GitHub Desktop cho nhanh, hoặc lệnh):
  ```bash
  git init
  git add .
  git commit -m "ANBU website"
  git branch -M main
  git remote add origin https://github.com/<tên-bạn>/anbu-website.git
  git push -u origin main
  ```

**Bước 2. Tạo project trên Cloudflare Pages**
1. Vào https://dash.cloudflare.com → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
2. Chọn repo `anbu-website`.
3. Cấu hình build:
   | Mục | Giá trị |
   |---|---|
   | Framework preset | **Next.js** |
   | Build command | `npx @cloudflare/next-on-pages@1` |
   | Build output directory | `.vercel/output/static` |
4. **Environment variables** — thêm:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://anbu.asia` (hoặc URL pages.dev tạm) |
   | `RESEND_API_KEY` | *(tuỳ chọn, để nhận email lead)* |
   | `CONTACT_TO_EMAIL` | `dat.phan@anbu.asia` |
   | `CONTACT_FROM_EMAIL` | `website@anbu.asia` |
5. Bấm **Save and Deploy**.

**Bước 3. Bật `nodejs_compat`** (rất quan trọng, nếu không API/SSR sẽ lỗi)
- Vào project → **Settings → Functions → Compatibility flags**.
- Ở cả **Production** và **Preview**, thêm flag: `nodejs_compat`.
- Đặt **Compatibility date** ≥ `2024-09-23`.
- Vào **Deployments** → **Retry deployment** để build lại.

Sau ~2 phút bạn có link chạy thật dạng `anbu-website.pages.dev`.

**Bước 4. Gắn tên miền anbu.asia**
- Project → **Custom domains** → **Set up a custom domain** → nhập `anbu.asia`.
- Nếu tên miền đã ở Cloudflare: chỉ cần bấm thêm là xong. Nếu chưa: làm theo hướng dẫn cập nhật nameserver/DNS.
- Cập nhật lại `NEXT_PUBLIC_SITE_URL=https://anbu.asia` → redeploy.

---

## Cách 2 — Deploy bằng lệnh Wrangler (không cần GitHub)

```bash
# 1. Đăng nhập Cloudflare (mở trình duyệt xác thực)
npx wrangler login

# 2. Build + deploy 1 lệnh
npm run pages:deploy
```

Lần đầu Wrangler sẽ hỏi tạo project — chọn tên `anbu-website`. Các lần sau chỉ cần chạy lại `npm run pages:deploy`.

Đặt biến môi trường qua lệnh (hoặc trong Dashboard):
```bash
npx wrangler pages secret put RESEND_API_KEY
# nhập giá trị khi được hỏi
```
Với biến công khai `NEXT_PUBLIC_SITE_URL`, đặt trong Dashboard (Settings → Environment variables) để chắc chắn được nhúng lúc build.

---

## 🔎 Kiểm tra local giống Cloudflare (tuỳ chọn)

```bash
npm run pages:preview
# mở http://localhost:8788
```

---

## 📌 Sau khi deploy

- Khai báo `https://anbu.asia/sitemap.xml` trong **Google Search Console**.
- Gửi thử form liên hệ để chắc email lead về đúng hộp thư (cần đã đặt `RESEND_API_KEY`).
- Sửa nội dung trong `src/content/` → push GitHub → Cloudflare tự deploy bản mới.

---

## ⚙️ Ghi chú kỹ thuật (đã cấu hình sẵn)

- `wrangler.toml`: khai `pages_build_output_dir` và `nodejs_compat`.
- `next.config.mjs`: `images.unoptimized = true` (Cloudflare không dùng image optimizer của Next).
- `src/app/api/contact/route.ts`: chạy `runtime = "edge"`, gửi lead qua Resend (tương thích Cloudflare). Muốn lưu lead vào database, có thể nối **Cloudflare KV/D1** tại chỗ đã đánh dấu `TODO` trong file.

---

## 🤝 Muốn tôi deploy giúp trực tiếp?

Cloudflare cần bạn đăng nhập tài khoản (bước xác thực này phiên tự động không tự chạy được). Tôi có thể thao tác thay bạn nếu bạn **cài extension “Claude in Chrome”** và đã đăng nhập sẵn Cloudflare + GitHub trên trình duyệt — khi đó tôi sẽ tự bấm các bước ở Cách 1 giúp bạn. Cứ báo tôi nhé.

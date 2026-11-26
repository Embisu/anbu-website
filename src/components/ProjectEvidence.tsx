import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { t } from "@/content/site";
import type { ProjectEvidence as Evidence } from "@/content/projectEvidence";
import Reveal from "./Reveal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatPressDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return locale === "vi"
    ? `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`
    : `${d} ${MONTHS[m - 1]} ${y}`;
}

function localizeMetric(text: string | undefined, locale: Locale): string | undefined {
  if (!text || locale !== "vi") return text;
  return text
    .replace(/\bsubscribers\b/g, "subscriber")
    .replace(/\bviews\b/g, "lượt xem")
    .replace(/\breactions\b/g, "tương tác");
}

function Block({ eyebrow, title, children }: { eyebrow: string; title?: string; children: ReactNode }) {
  return (
    <section className="container-x pb-14 sm:pb-16">
      <Reveal>
        <h2 className="eyebrow">{eyebrow}</h2>
        {title && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-500">{title}</p>}
        <div className="mt-6">{children}</div>
      </Reveal>
    </section>
  );
}

const linkClass =
  "inline-flex items-center rounded-full border border-navy-100 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-700 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700";

export default function ProjectEvidence({ evidence, locale }: { evidence: Evidence; locale: Locale }) {
  const vi = locale === "vi";
  const { signals, signalsNote, creators, press, scope, media } = evidence;

  return (
    <>
      {signals && signals.length > 0 && (
        <Block eyebrow={vi ? "Tín hiệu tiếp cận công khai" : "Public reach signals"}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signals.map((s) => (
              <div
                key={`${s.value}-${t(s.label, locale)}`}
                className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white shadow-[0_24px_60px_-28px_rgba(1,47,135,0.6)]"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/25" />
                <div className="relative font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{s.value}</div>
                <div className="relative mt-2 text-sm font-semibold">{t(s.label, locale)}</div>
                {s.note && <div className="relative mt-2 text-xs leading-relaxed text-white/65">{t(s.note, locale)}</div>}
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs italic leading-relaxed text-navy-400">
            {signalsNote
              ? t(signalsNote, locale)
              : vi
              ? "Số liệu công khai tại thời điểm tra cứu (11/2026), làm tròn xuống. Lượt xem là số của cả video. Số liệu ghi “của game” là chỉ số của sản phẩm, không phải kết quả riêng của ANBU."
              : "Public figures at time of research (Nov 2026), rounded down. Views are whole-video counts. Figures marked “game-level” describe the product, not ANBU's own results."}
          </p>
        </Block>
      )}

      {creators && creators.length > 0 && (
        <Block eyebrow={vi ? "Creator & nội dung" : "Creators & content"}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((c) => {
              const hasStats = Boolean(c.reach || c.clicks);
              return (
              <div key={c.name} className="flex flex-col rounded-3xl border border-navy-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-navy-800">{c.name}</h3>
                  <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                    {c.platform}
                  </span>
                </div>
                {(c.audience || (!hasStats && c.views)) && (
                  <p className="mt-1 text-xs font-semibold text-navy-400">
                    {[
                      localizeMetric(c.audience, locale),
                      hasStats ? undefined : localizeMetric(c.views, locale),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {hasStats && (
                  <dl className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-cloud p-3 text-center">
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{vi ? "Tiếp cận" : "Reach"}</dt>
                      <dd className="font-display text-sm font-extrabold text-navy-800">{c.reach ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{vi ? "Lượt xem" : "Views"}</dt>
                      <dd className="font-display text-sm font-extrabold text-navy-800">{c.views ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{vi ? "Lượt click" : "Clicks"}</dt>
                      <dd className="font-display text-sm font-extrabold text-navy-800">{c.clicks ?? "—"}</dd>
                    </div>
                  </dl>
                )}
                {c.note && <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-500">{t(c.note, locale)}</p>}
                {c.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.links.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {typeof link.label === "string" ? link.label : t(link.label, locale)} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </Block>
      )}

      {press && press.length > 0 && (
        <Block eyebrow={vi ? "Báo chí" : "Press coverage"}>
          <ul className="grid gap-3 md:grid-cols-2">
            {press.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-orange-300"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600">
                    {p.outlet} · {formatPressDate(p.date, locale)}
                  </span>
                  <span className="mt-1.5 font-semibold leading-snug text-navy-800 group-hover:text-orange-700">
                    {t(p.title, locale)} <span aria-hidden="true">↗</span>
                  </span>
                  {locale === "en" && (
                    <span className="mt-1 text-xs italic leading-snug text-navy-400" lang="vi">
                      {p.title.vi}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {scope && scope.length > 0 && (
        <Block eyebrow={vi ? "Hạng mục triển khai thêm" : "Additional workstreams"}>
          <div className="grid gap-5 lg:grid-cols-2">
            {scope.map((group) => (
              <div key={t(group.title, locale)} className="rounded-3xl border border-navy-100 bg-cloud p-6">
                <h3 className="font-display text-lg font-bold text-navy-800">{t(group.title, locale)}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={t(item.title, locale)} className="rounded-2xl bg-white p-4">
                      <p className="font-semibold text-navy-700">{t(item.title, locale)}</p>
                      <p className="mt-1 text-sm leading-relaxed text-navy-500">{t(item.text, locale)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}

      {media && media.length > 0 && (
        <Block eyebrow={vi ? "Hình ảnh & video chiến dịch" : "Campaign media"}>
          <div className="grid gap-6 md:grid-cols-2">
            {media.map((m) => (
              <figure key={m.src} className="overflow-hidden rounded-3xl border border-navy-100 bg-white">
                <div className={`${m.ratio === "1:1" ? "aspect-square" : "aspect-video"} bg-navy-900`}>
                  {m.type === "video" ? (
                    <video
                      controls
                      playsInline
                      preload="none"
                      poster={m.poster}
                      className="h-full w-full object-cover"
                      aria-label={t(m.title, locale)}
                    >
                      <source src={m.src} type="video/mp4" />
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.src} alt={t(m.title, locale)} loading="lazy" className="h-full w-full object-cover" />
                  )}
                </div>
                <figcaption className="p-5">
                  <p className="font-display text-base font-bold text-navy-800">{t(m.title, locale)}</p>
                  {m.caption && <p className="mt-1 text-sm leading-relaxed text-navy-500">{t(m.caption, locale)}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </Block>
      )}
    </>
  );
}

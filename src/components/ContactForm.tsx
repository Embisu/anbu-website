"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Icon from "./Icon";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = { name?: string; contact?: string; service?: string; message?: string };

export default function ContactForm({
  locale,
  dict,
  services,
  budgets,
}: {
  locale: Locale;
  dict: Dictionary;
  services: { slug: string; label: string }[];
  budgets: string[];
}) {
  const f = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return; // guard against double submit
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Field-level validation: name, (email OR phone), service, message required.
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const fieldErrors: FieldErrors = {};
    if (!String(data.name || "").trim()) fieldErrors.name = f.errName;
    if (!validEmail && !phone) fieldErrors.contact = f.errContact;
    if (!String(data.service || "").trim()) fieldErrors.service = f.errService;
    if (!String(data.message || "").trim()) fieldErrors.message = f.errMessage;

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("error");
      setErrorMsg(f.required);
      return;
    }

    setErrors({});
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("request failed");
      const analyticsWindow = window as Window & { dataLayer?: unknown[] };
      analyticsWindow.dataLayer?.push({ event: "generate_lead", service: String(data.service || ""), market: String(data.market || "") });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(f.error);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-navy-100 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white">
          <Icon name="check" className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-navy-800">{f.successTitle}</h3>
        <p className="mt-2 text-navy-500">{f.success}</p>
        <p className="mt-1 text-sm text-navy-400">{f.nextStep}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          {f.sendAnother}
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy-800 outline-none transition-colors placeholder:text-navy-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
  const errCls = "border-red-300 focus:border-red-400 focus:ring-red-100";
  const FieldError = ({ id, msg }: { id: string; msg?: string }) =>
    msg ? (
      <span id={id} className="mt-1.5 block text-xs font-medium text-red-600">
        {msg}
      </span>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-navy-100 bg-white p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.name} *</span>
          <input
            name="name"
            required
            placeholder={f.namePh}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={`${inputCls} ${errors.name ? errCls : ""}`}
          />
          <FieldError id="err-name" msg={errors.name} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.email}</span>
          <input
            name="email"
            type="email"
            placeholder={f.emailPh}
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "err-contact" : undefined}
            className={`${inputCls} ${errors.contact ? errCls : ""}`}
          />
          <FieldError id="err-contact" msg={errors.contact} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.phone}</span>
          <input
            name="phone"
            type="tel"
            placeholder={f.phonePh}
            aria-invalid={!!errors.contact}
            className={`${inputCls} ${errors.contact ? errCls : ""}`}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.company}</span>
          <input name="company" placeholder={f.companyPh} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.service} *</span>
          <select
            name="service"
            defaultValue=""
            required
            aria-required="true"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "err-service" : undefined}
            className={`${inputCls} ${errors.service ? errCls : ""}`}
          >
            <option value="" disabled>{f.servicePh}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.label}>{s.label}</option>
            ))}
          </select>
          <FieldError id="err-service" msg={errors.service} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.budget}</span>
          <select name="budget" defaultValue="" className={inputCls}>
            <option value="" disabled>{f.budgetPh}</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{locale === "vi" ? "Thị trường triển khai" : "Target market"}</span>
          <select name="market" defaultValue="" className={inputCls}>
            <option value="" disabled>{locale === "vi" ? "Chọn thị trường" : "Select a market"}</option>
            {["Việt Nam", "Southeast Asia", "Global", locale === "vi" ? "Khác / Chưa xác định" : "Other / Not decided"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{locale === "vi" ? "Giai đoạn hiện tại" : "Current stage"}</span>
          <select name="stage" defaultValue="" className={inputCls}>
            <option value="" disabled>{locale === "vi" ? "Chọn giai đoạn" : "Select a stage"}</option>
            {(locale === "vi" ? ["Đang lập kế hoạch", "Chuẩn bị ra mắt", "Đã ra mắt, cần tăng trưởng", "Cần tái kích hoạt"] : ["Planning", "Preparing to launch", "Live and scaling", "Reactivation"]).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{locale === "vi" ? "Ngày dự kiến ra mắt" : "Expected launch date"}</span>
          <input name="launchDate" type="date" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-700">{locale === "vi" ? "Link brief / tài liệu" : "Brief / document link"}</span>
          <input name="briefUrl" type="url" placeholder="https://" className={inputCls} />
        </label>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-navy-400">
        {locale === "vi"
          ? "Vui lòng cung cấp ít nhất một phương thức liên hệ: email hoặc số điện thoại."
          : "Please provide at least one way for us to reach you: email or phone."}
      </p>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-semibold text-navy-700">{f.message} *</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={locale === "vi" ? "Mục tiêu chiến dịch, đối tượng, kênh dự kiến và điều bạn muốn ANBU hỗ trợ..." : "Campaign goal, audience, expected channels and how you would like ANBU to help..."}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`${inputCls} ${errors.message ? errCls : ""}`}
        />
        <FieldError id="err-message" msg={errors.message} />
      </label>

      {/* Honeypot anti-spam field (hidden from users and assistive tech) */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-60">
        {status === "loading" ? f.submitting : f.submit}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { team, type Member } from "@/content/team";

// Photo if public/team/<slug>.jpg exists, otherwise a monogram, never breaks.
function Avatar({ member }: { member: Member }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-navy-600 to-navy-800 font-display text-sm font-bold text-white ring-2 ring-navy-900">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/team/${member.slug}.${member.imageExtension ?? "jpg"}`}
          alt={member.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        member.initials
      )}
    </span>
  );
}

export default function AnbuSquad({ locale, label, sub }: { locale: Locale; label: string; sub: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-5 text-white shadow-[0_34px_75px_-28px_rgba(1,47,135,0.6)]">
      {/* shuriken watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/mark-white.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-12 opacity-[0.07]"
      />
      <div className="relative flex items-center gap-4">
        <div className="flex -space-x-3">
          {team.map((m) => (
            <Avatar key={m.slug} member={m} />
          ))}
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white ring-2 ring-navy-900">
            +
          </span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold">{label}</div>
          <div className="text-xs text-navy-200">{sub}</div>
        </div>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {team.slice(0, 3).map((m) => (
          <span key={m.slug} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-navy-100">
            {m.role}
          </span>
        ))}
      </div>
    </div>
  );
}

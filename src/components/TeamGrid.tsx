"use client";

import { useState } from "react";
import { team, type Member } from "@/content/team";

function MemberCard({ member }: { member: Member }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-full flex-col text-center">
      <div className="group mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(1,47,135,0.4)]">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/team/${member.slug}.${member.imageExtension ?? "jpg"}`}
            alt={member.name}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-5xl font-extrabold text-navy-200">
            {member.initials}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-lg font-extrabold text-navy-800">{member.name}</h3>
      <p className="mt-1 text-sm font-medium leading-snug text-orange-600">{member.role}</p>
    </div>
  );
}

export default function TeamGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 lg:gap-x-4">
      {team.map((m) => (
        <MemberCard key={m.slug} member={m} />
      ))}
    </div>
  );
}

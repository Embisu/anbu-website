"use client";

import { useState } from "react";
import type { Client } from "@/content/clients";

// One logo cell (bordered card). Shows the real logo in full colour;
// falls back to a styled wordmark if the image is missing.
export default function ClientLogo({ client }: { client: Client }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-24 items-center justify-center rounded-2xl border border-navy-100 bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_16px_40px_-18px_rgba(1,47,135,0.28)]">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={client.file}
          alt={client.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-8 w-auto max-w-[78%] object-contain sm:max-h-9"
        />
      ) : (
        <span className="text-center font-display text-base font-bold text-navy-500 sm:text-lg">
          {client.name}
        </span>
      )}
    </div>
  );
}

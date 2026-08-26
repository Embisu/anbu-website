"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

export default function ZaloButton({ locale }: { locale: "vi" | "en" }) {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Hide WhatsApp and Zalo floating buttons on Admin pages
  if (pathname.includes("/admin")) {
    return null;
  }

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {/* Mobile Speed Dial & Desktop List */}
      <div className="relative flex flex-col items-end gap-2.5">
        {/* Expanded Options (Always visible on desktop hover/sm, toggleable on mobile) */}
        <div
          className={`flex flex-col items-end gap-2.5 transition-all duration-300 ${
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100"
          }`}
        >
          {/* WhatsApp */}
          <a
            href="https://wa.me/84396995252"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale === "vi" ? "Trao đổi với ANBU qua WhatsApp" : "Chat with ANBU on WhatsApp"}
            className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-3.5 py-2.5 font-semibold text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.6)] transition-all hover:scale-105 hover:bg-[#1fb458] focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-95"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm sm:normal-case">
              WhatsApp
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Icon name="chat" className="h-4 w-4" />
            </div>
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/0396995252"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale === "vi" ? "Trao đổi với ANBU qua Zalo" : "Chat with ANBU on Zalo"}
            className="group flex items-center gap-2.5 rounded-full bg-[#0068ff] px-3.5 py-2.5 font-semibold text-white shadow-[0_10px_25px_-5px_rgba(0,104,255,0.6)] transition-all hover:scale-105 hover:bg-[#0057d9] focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-95"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm sm:normal-case">
              Zalo ANBU
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Icon name="chat" className="h-4 w-4" />
            </div>
          </a>
        </div>

        {/* Mobile-only Trigger Toggle Button (Compact, doesn't block screen) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Đóng liên hệ" : "Liên hệ ANBU"}
          aria-expanded={isOpen}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 sm:hidden active:scale-90 ${
            isOpen
              ? "bg-navy-800 rotate-90 shadow-navy-900/50"
              : "bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/50"
          }`}
        >
          {isOpen ? (
            <Icon name="close" className="h-5 w-5" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <Icon name="chat" className="h-5 w-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

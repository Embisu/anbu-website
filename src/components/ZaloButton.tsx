import Icon from "./Icon";

export default function ZaloButton({ locale }: { locale: "vi" | "en" }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      <a
        href="https://wa.me/84396995252"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === "vi" ? "Trao đổi với ANBU qua WhatsApp" : "Chat with ANBU on WhatsApp"}
        className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-[0_14px_35px_-10px_rgba(37,211,102,0.7)] transition hover:-translate-y-1 hover:bg-[#1fb458] focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        <Icon name="chat" className="h-5 w-5" />
        <span className="hidden text-sm sm:inline">WhatsApp</span>
      </a>
      <a
        href="https://zalo.me/0396995252"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === "vi" ? "Trao đổi với ANBU qua Zalo" : "Chat with ANBU on Zalo"}
        className="group inline-flex items-center gap-2 rounded-full bg-[#0068ff] px-4 py-3 font-semibold text-white shadow-[0_14px_35px_-10px_rgba(0,104,255,0.7)] transition hover:-translate-y-1 hover:bg-[#0057d9] focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        <Icon name="chat" className="h-5 w-5" />
        <span className="hidden text-sm sm:inline">Zalo ANBU</span>
      </a>
    </div>
  );
}

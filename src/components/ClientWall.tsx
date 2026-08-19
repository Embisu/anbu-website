import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { clients } from "@/content/clients";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ClientLogo from "./ClientLogo";

export default function ClientWall({
  locale,
  dict,
  max,
}: {
  locale: Locale;
  dict: Dictionary;
  max?: number;
}) {
  void locale;
  const list = max ? clients.slice(0, max) : clients;

  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow={dict.clients.eyebrow}
        title={dict.clients.title}
        subtitle={dict.clients.subtitle}
        center
      />
      <Reveal className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {list.map((client) => (
          <ClientLogo key={client.file} client={client} />
        ))}
      </Reveal>
    </section>
  );
}

import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  vi: () => import("./messages/vi").then((m) => m.default),
  en: () => import("./messages/en").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["vi"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

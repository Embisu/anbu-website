import type { Post } from "@/content/posts";

// Mojibake = UTF-8 Vietnamese that was decoded as Latin-1/cp1252 ("ThÃ¡ng", "Viá»‡t").
// The signature is a lead character (Ã Ä Æ áº á») immediately followed by a C1/Latin-1
// symbol. Legitimate Vietnamese never has that pair, whereas the old pattern
// (two accented Latin-1 letters in a row) could also flag valid titles.
export const MOJIBAKE = /(?:Ã|Ä|Æ|áº|á»)[\u0080-¿Œ-ƒˆ˜–-›€™]/;

export function isMojibakePost(p: Pick<Post, "slug" | "title">): boolean {
  return MOJIBAKE.test(p.title?.vi || "") || MOJIBAKE.test(p.slug || "");
}

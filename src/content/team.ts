export type Member = {
  name: string; // codename (ANBU squad style)
  realName: string;
  role: string; // English title (shown for both languages)
  initials: string;
  slug: string; // photo at public/team/<slug>.jpg
  imageExtension?: "jpg" | "png";
};

export const team: Member[] = [
  { name: "Embisu", realName: "Phan Đạt", role: "Founder", initials: "E", slug: "embisu" },
  { name: "Tik", realName: "Khánh Quỳnh", role: "Marketing Director", initials: "T", slug: "tik" },
  { name: "Mambu", realName: "Đức Anh", role: "Community Manager", initials: "M", slug: "manbu" },
  { name: "Lin", realName: "Khánh Linh", role: "Account Executive", initials: "L", slug: "lin" },
  { name: "Anna", realName: "Vân Anh", role: "Account Executive", initials: "A", slug: "anna" },
  { name: "Jude", realName: "Hữu Khánh", role: "Community Manager", initials: "J", slug: "jude" },
  { name: "Quinn", realName: "Quinn", role: "Designer", initials: "Q", slug: "quinn", imageExtension: "png" },
];

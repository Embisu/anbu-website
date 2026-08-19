import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ANBU: Community & Game Marketing Squad",
    short_name: "ANBU",
    description: "KOL/KOC, social, community and integrated launch marketing in Vietnam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#012f87",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/app-icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

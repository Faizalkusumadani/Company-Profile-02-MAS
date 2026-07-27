// ─── Konfigurasi situs — dipakai bersama oleh layout.tsx dan helper metadata ──
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://megaadhitamasejati.id",
  name: "PT Mega Adhitama Sejati",
  shortName: "Mega Adhitama Sejati",
  ogImage: "/og-image.png",
  themeColor: "#18181b",
} as const;

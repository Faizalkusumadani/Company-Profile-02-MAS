// ─── Konfigurasi situs — dipakai bersama oleh layout.tsx dan helper metadata ──
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://megaadhitamasejati.id",
  name: "PT Mega Adhitama Sejati",
  shortName: "Mega Adhitama Sejati",
  description:
    "Mega Adhitama Sejati merupakan mitra terpercaya dalam penyediaan bahan bangunan berkualitas untuk segmen retail, dengan wilayah layanan utama di Provinsi Banten",
  ogImage: "/og-image.png",
  themeColor: "#18181b",
} as const;

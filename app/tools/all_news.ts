export type NewsStatic = {
  id: string;
  slug: string;
  image: string;
  imageDetail?: string;
  images?: string[];
  contentKey: string;
  isNew?: boolean;
};

/** Shape lengkap setelah digabung dengan terjemahan */
export type News = NewsStatic & {
  title: string;
  description: string;
  date: string;
  href: string;
};

// ── Static Data ────────────────────────────────────────────────
export const newsData: NewsStatic[] = [
  {
    id: "1",
    slug: "gathering-semen-2026",
    image: "/information/Retailer Semen_merah_2026/001.jpeg",
    images: [
      "/information/Retailer Semen_merah_2026/001.jpeg",
      "/information/Retailer Semen_merah_2026/002.jpeg",
      "/information/Retailer Semen_merah_2026/003.jpeg",
      "/information/Retailer Semen_merah_2026/004.jpeg",
    ],
    contentKey: "gathering_semen_2026_1",
  },
  {
    id: "2",
    slug: "gathering-semen-merah-putih",
    image: "/information/RetailerGatheringMP2025/001.jpg",
    images: [
      "/information/RetailerGatheringMP2025/001.jpg",
      "/information/RetailerGatheringMP2025/002.jpg",
    ],
    contentKey: "gathering_semen_1",
  },
  {
    id: "3",
    slug: "gathering-wavin",
    image: "/information/RetailerWavin2025/img-01.jpg",
    images: [
      "/information/RetailerWavin2025/img-01.jpg",
      "/information/RetailerWavin2025/img-02.jpg",
      "/information/RetailerWavin2025/img-03.jpg",
      "/information/RetailerWavin2025/img-04.jpg",
      "/information/RetailerWavin2025/img-05.jpg",
    ],
    contentKey: "gathering_wavin_1",
  },
];

// ── Helpers ────────────────────────────────────────────────────

/**
 * Generate href dari slug.
 */
export function generateHref(slug: string): string {
  return `/informasi/berita/${slug}`;
}

/**
 * Lookup news by slug. Return null jika tidak ditemukan (→ 404).
 */
export function getNewsBySlug(slug: string): NewsStatic | null {
  return newsData.find((n) => n.slug === slug) ?? null;
}

/**
 * Resolve daftar gambar untuk galeri di halaman detail.
 * Fallback ke satu foto (imageDetail ?? image) kalau `images` kosong.
 */
export function getNewsGalleryImages(news: NewsStatic): string[] {
  if (news.images && news.images.length > 0) return news.images;
  return [news.imageDetail ?? news.image];
}

/**
 * generateStaticParams untuk [locale]/informasi/berita/[slug]/page.tsx
 * Ekspor langsung agar bisa dipakai di halaman detail.
 */
export function getAllNewsParams() {
  const locales = ["id", "en"];
  return locales.flatMap((locale) =>
    newsData.map((n) => ({ locale, slug: n.slug })),
  );
}

// ── Default Export ─────────────────────────────────────────────
// Gabungkan data statis + terjemahan dari t() + href otomatis.
const Allnews = (t: (key: string) => string): News[] =>
  newsData.map((n) => ({
    ...n,
    href: generateHref(n.slug),
    title: t(`Roominformation.${n.contentKey}_title`),
    description: t(`Roominformation.${n.contentKey}_description`),
    date: t(`Roominformation.${n.contentKey}_date`),
  }));

export default Allnews;

export type NewsStatic = {
  id: string;
  slug: string;
  image: string;
  imageDetail?: string;
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
    slug: "gathering-semen-merah-putih",
    image: "/information/RetailerGatheringMP2025/DSC04455.jpg",
    contentKey: "gathering_semen_1",
  },
  {
    id: "2",
    slug: "gathering-wavin",
    image: "/information/RetailerWavin2025/img-01.jpg",
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
// Dipakai di: sidebar, list berita, halaman detail.

const Allnews = (t: (key: string) => string): News[] =>
  newsData.map((n) => ({
    ...n,
    href: generateHref(n.slug),
    title: t(`${n.contentKey}_title`),
    description: t(`${n.contentKey}_description`),
    date: t(`${n.contentKey}_date`),
  }));

export default Allnews;

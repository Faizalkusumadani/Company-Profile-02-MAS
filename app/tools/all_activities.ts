export type ActivityStatic = {
  id: string;
  slug: string;
  image: string;
  imageDetail?: string;
  contentKey: string;
  isNew?: boolean;
};

/** Shape lengkap setelah digabung dengan terjemahan */
export type Activity = ActivityStatic & {
  title: string;
  description: string;
  date: string;
  href: string;
};

// ── Static Data ────────────────────────────────────────────────
export const activitiesData: ActivityStatic[] = [
  {
    id: "1",
    slug: "santunan-anak-yatim-2023",
    image: "/information/Santunan_Anak_Yatim_2023/Santunan-101.jpeg",
    contentKey: "santunan_2023",
  },
  {
    id: "2",
    slug: "mas-shadaqah-2023",
    image: "/information/MAS Shodaqo/MAS Shodaqo.jpeg",
    contentKey: "shadaqah_2023",
  },
  {
    id: "3",
    slug: "buka-bersama-2023",
    image: "/information/Buka Bersama 2023/Buka-Bersama.jpeg",
    contentKey: "buka_bersama_2023",
  },
  {
    id: "4",
    slug: "annual-gathering-2023",
    image: "/information/Bromo_tour/1.JPG",
    contentKey: "annual_gathering_2023",
  },
  {
    id: "5",
    slug: "door-prize-2024",
    image: "/information/Program_Sakses/1.jpeg",
    contentKey: "door_prize_2024",
  },
  {
    id: "6",
    slug: "qurban-2024",
    image: "/information/Qurban_2024/1.jpg",
    contentKey: "qurban_2024",
  },
  {
    id: "7",
    slug: "qurban-2025",
    image: "/information/Qurban 2025/1A.jpeg",
    contentKey: "qurban_2025",
    isNew: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────

/**
 * Generate href dari slug.
 */
export function generateHref(slug: string): string {
  return `/informasi/kegiatan/${slug}`;
}

/**
 * Lookup activity by slug. Return null jika tidak ditemukan (→ 404).
 */
export function getActivityBySlug(slug: string): ActivityStatic | null {
  return activitiesData.find((a) => a.slug === slug) ?? null;
}

/**
 * generateStaticParams untuk [locale]/informasi/kegiatan/[slug]/page.tsx
 * Ekspor langsung agar bisa dipakai di halaman detail.
 */
export function getAllActivityParams() {
  const locales = ["id", "en"];
  return locales.flatMap((locale) =>
    activitiesData.map((a) => ({ locale, slug: a.slug })),
  );
}

// ── Default Export ─────────────────────────────────────────────
// Gabungkan data statis + terjemahan dari t() + href otomatis.
// Dipakai di: sidebar, carousel, gallery list, halaman detail.

const Allactivities = (t: (key: string) => string): Activity[] =>
  activitiesData.map((a) => ({
    ...a,
    href: generateHref(a.slug),
    title: t(`${a.contentKey}_title`),
    description: t(`${a.contentKey}_description`),
    date: t(`${a.contentKey}_date`),
  }));

export default Allactivities;

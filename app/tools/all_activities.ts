export type ActivityStatic = {
  id: string;
  slug: string;
  image: string;
  imageDetail?: string;
  images?: string[];
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
    slug: "mas-qurban-2023",
    image: "/information/Qurban_2023/001.jpeg",
    images: [
      "/information/Qurban_2023/001.jpeg",
      "/information/Qurban_2023/002.jpeg",
      "/information/Qurban_2023/003.jpeg",
      "/information/Qurban_2023/004.jpeg",
      "/information/Qurban_2023/005.jpeg",
    ],
    contentKey: "qurban_2023",
  },
  {
    id: "5",
    slug: "annual-gathering-2023",
    image: "/information/Bromo_tour/1.JPG",
    images: [
      "/information/Bromo_tour/1.JPG",
      "/information/Bromo_tour/2.JPG",
      "/information/Bromo_tour/3.JPG",
      "/information/Bromo_tour/4.JPG",
      "/information/Bromo_tour/5.JPG",
    ],
    contentKey: "annual_gathering_2023",
  },
  {
    id: "6",
    slug: "door-prize-2024",
    image: "/information/Program_Sakses/1.jpeg",
    images: [
      "/information/Program_Sakses/1.jpeg",
      "/information/Program_Sakses/2.jpeg",
      "/information/Program_Sakses/3.jpeg",
    ],
    contentKey: "door_prize_2024",
  },
  {
    id: "7",
    slug: "qurban-2024",
    image: "/information/Qurban_2024/1.jpg",
    images: [
      "/information/Qurban_2024/1.jpg",
      "/information/Qurban_2024/2.jpeg",
    ],
    contentKey: "qurban_2024",
  },
  {
    id: "8",
    slug: "qurban-2025",
    image: "/information/Qurban_2025/001.jpeg",
    images: [
      "/information/Qurban_2025/001.jpeg",
      "/information/Qurban_2025/002.jpeg",
      "/information/Qurban_2025/003.jpeg",
      "/information/Qurban_2025/004.jpeg",
      "/information/Qurban_2025/005.jpeg",
    ],
    contentKey: "qurban_2025",
  },
  {
    id: "9",
    slug: "bagi-parcel-2025",
    image: "/information/Bagi_parcel_2025/001.jpeg",
    images: [
      "/information/Bagi_parcel_2025/001.jpeg",
      "/information/Bagi_parcel_2025/002.jpeg",
      "/information/Bagi_parcel_2025/003.jpeg",
      "/information/Bagi_parcel_2025/004.jpeg",
      "/information/Bagi_parcel_2025/005.jpeg",
    ],
    contentKey: "bagi_parcel_2025",
  },
  {
    id: "10",
    slug: "bandung-tour-2025",
    image: "/information/Bandung_tour/IMG_2767.jpg",
    contentKey: "bandung_tour_2025",
    isNew: true,
  },
  {
    id: "11",
    slug: "mas-qurban-2026",
    image: "/information/Qurban_2026/001.jpeg",
    images: [
      "/information/Qurban_2026/001.jpeg",
      "/information/Qurban_2026/002.jpeg",
      "/information/Qurban_2026/003.jpeg",
      "/information/Qurban_2026/004.jpeg",
      "/information/Qurban_2026/005.jpeg",
    ],
    contentKey: "qurban_2026",
    isNew: true,
  },
  {
    id: "12",
    slug: "karimun-tour-2026",
    image: "/information/Karimun_tour/001.jpg",
    images: [
      "/information/Karimun_tour/002.jpg",
      "/information/Karimun_tour/003.jpg",
      "/information/Karimun_tour/004.jpg",
      "/information/Karimun_tour/005.JPG",
      "/information/Karimun_tour/006.jpg",
    ],
    contentKey: "karimun_tour_2026",
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
 * Resolve daftar gambar untuk galeri di halaman detail.
 * Fallback ke satu foto (imageDetail ?? image) kalau `images` kosong.
 */
export function getActivityGalleryImages(activity: ActivityStatic): string[] {
  if (activity.images && activity.images.length > 0) return activity.images;
  return [activity.imageDetail ?? activity.image];
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
    title: t(`Roominformation.${a.contentKey}_title`),
    description: t(`Roominformation.${a.contentKey}_description`),
    date: t(`Roominformation.${a.contentKey}_date`),
  }));

export default Allactivities;

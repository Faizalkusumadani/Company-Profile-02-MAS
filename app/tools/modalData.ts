// ── Types ──────────────────────────────────────────────────────
export type ModalDataStatic = {
  id: string;
  name: string;
  image: string;
  contentKey: string;
};

/** Shape lengkap setelah digabung dengan terjemahan */
export type ModalDataItem = ModalDataStatic & {
  position: string;
  description: string[];
};

// ── Static Data ────────────────────────────────────────────────
export const modalDataStatic: ModalDataStatic[] = [
  {
    id: "profile-1",
    image: "/Founders/R.png",
    name: "Rudy Gunawan",
    contentKey: "rudy",
  },
  {
    id: "profile-2",
    image: "/Founders/S.png",
    name: "Suryo Wijoyo",
    contentKey: "suryo",
  },
  {
    id: "profile-3",
    image: "/Founders/M.png",
    name: "Megawati Hamid",
    contentKey: "mega",
  },
];

// ── Default Export ─────────────────────────────────────────────
// Gabungkan data statis + terjemahan dari t() + tRaw() untuk array.
// Dipakai di: halaman manajemen, modal detail.

const AllModalData = (
  t: (key: string) => string,
  tRaw: (key: string) => unknown,
): ModalDataItem[] =>
  modalDataStatic.map((m) => ({
    ...m,
    position: t(`${m.contentKey}_position`),
    description: tRaw(`${m.contentKey}_descriptions`) as string[],
  }));

export default AllModalData;

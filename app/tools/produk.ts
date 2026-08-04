export type ProductCategoryKey = "name_1" | "name_2" | "name_3";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: ProductCategoryKey;
  rating: number;
  reviews: number;
  href: string;
  discount?: string;
  variants?: string;
  price?: number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// t diambil dari useTranslations("Products") di komponen yang memanggilnya
const getProducts = (t: (key: string) => string): Product[] => [
  {
    id: 1,
    name: "Semen Merahputih",
    slug: "semenmerahputih",
    image: "/produk/SEMEN MERAH PUTIH.png",
    description: t("Products.semenmerahputih_desc"),
    category: "name_1",
    rating: 5,
    reviews: 175,
    discount: "",
    variants: "4 Items",
    href: "/produk/semenmerahputih",
  },
  {
    id: 2,
    name: "Dulux",
    slug: "dulux",
    image: "/produk/DULUXX.png",
    description: t("Products.dulux_desc"),
    category: "name_1",
    rating: 5,
    reviews: 330,
    variants: "8 Items",
    href: "/produk/dulux",
  },
  {
    id: 3,
    name: "Aquaproof",
    slug: "aquaproof",
    image: "/produk/AQUAPROOFF.png",
    description: t("Products.aquaproof_desc"),
    category: "name_1",
    rating: 5,
    reviews: 340,
    variants: "4 Items",
    href: "/produk/aquaproof",
  },
  {
    id: 4,
    name: "SLG",
    slug: "slg",
    image: "/produk/SLGG.png",
    description: t("Products.slg_desc"),
    category: "name_1",
    rating: 5,
    reviews: 340,
    variants: "5 Items",
    href: "/produk/slg",
  },
  {
    id: 5,
    name: "Wavin",
    slug: "wavin",
    price: 129900,
    image: "/produk/WAVIN.png",
    description: t("Products.wavin_desc"),
    category: "name_1",
    rating: 5,
    reviews: 165,
    discount: "",
    variants: "6 Items",
    href: "/produk/wavin",
  },
  {
    id: 6,
    name: "Trilliun Hose",
    slug: "trilliun",
    image: "/produk/TRILLIUN.png",
    description: t("Products.trilliunhose_desc"),
    category: "name_1",
    rating: 5,
    reviews: 236,
    discount: "",
    variants: "5 Items",
    href: "/produk/trilliun",
  },
  {
    id: 7,
    name: "Tokka",
    slug: "tokka",
    image: "/produk/TOKKAA.png",
    description: t("Products.tokka_desc"),
    category: "name_1",
    rating: 5,
    reviews: 340,
    variants: "3 Items",
    href: "/produk/tokka",
  },
  {
    id: 8,
    name: "Superex",
    slug: "superex",
    image: "/produk/SUPEREXX.png",
    description: t("Products.superex_desc"),
    category: "name_1",
    rating: 5,
    reviews: 340,
    variants: "3 Items",
    href: "/produk/superex",
  },
  {
    id: 9,
    name: "Servvo",
    slug: "servvo",
    description: t("Products.servvo_desc"),
    image: "/produk/SERVVO.png",
    category: "name_3", // K3 (Servvo = alat safety/APAR)
    rating: 4.9,
    reviews: 210,
    discount: "",
    variants: "8 Items",
    href: "/produk/servvo",
  },
  {
    id: 10,
    name: "Supreme",
    slug: "supreme",
    image: "/produk/SUPREMEE.png",
    description: t("Products.supreme_desc"),
    category: "name_1",
    rating: 5,
    reviews: 340,
    variants: "7 Items",
    href: "/produk/supreme",
  },
  {
    id: 11,
    name: "Trilliunware",
    slug: "trilliunware",
    image: "/produk/TRILLIUNWARE.png",
    description: t("Products.trilliunware_desc"),
    category: "name_2",
    rating: 5,
    reviews: 340,
    variants: "8 Items",
    href: "/produk/trilliunware",
  },
  {
    id: 12,
    name: "Dcota",
    slug: "dcota",
    image: "/produk/DCOTAA.png",
    description: t("Products.dcota_desc"),
    category: "name_2",
    rating: 5,
    reviews: 340,
    variants: "5 Items",
    href: "/produk/dcota",
  },
];

export default getProducts;

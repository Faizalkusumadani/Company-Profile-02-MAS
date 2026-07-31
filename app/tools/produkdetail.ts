import AquaproofVariants from "./aquaproof";
import BildoVariants from "./bildo";
import DcotaVariants from "./dcota";
import SemenmerahputihVariants from "./semenmerahputih";
import ServvoVariants from "./servvo";
import SlgVariants from "./slg";
import SuperexVariants from "./superex";
import SupremeVariants from "./supreme";
import TokkaVariants from "./tokka";
import TrilliunVariants from "./trilliun";
import TrilliunwareVariants from "./trilliunware";
import WavinVariants from "./wavin";
import YoshinoVariants from "./yoshino";
import DuluxVariants from "./dulux";
import en from "../../messages/en.json";

// Otomatis ambil semua key dari namespace "Products"
type ProductsMessages = typeof en.Products;
export type ProductTranslationKey = keyof ProductsMessages;

export type ProductVariant = {
  id?: number | string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  weight?: string;
  description?: string;
  price?: number;
  [key: string]: string | number | undefined;
};

export type ProdukDetail = {
  slug: string;
  namaBrand: string;
  gambarUtama: string;
  logoSrc: string;
  descKey: ProductTranslationKey;
  featuresKeys: ProductTranslationKey[];
  variants: ProductVariant[];
};

const produkDetailList: ProdukDetail[] = [
  {
    slug: "dcota",
    namaBrand: "Dcota",
    gambarUtama: "/produk/DCOTAA.png",
    logoSrc: "/produk/Dcota/logodcota.png",
    descKey: "dcota_desc",
    featuresKeys: ["dcota_features_1", "dcota_features_2", "dcota_features_3"],
    variants: DcotaVariants,
  },
  {
    slug: "semenmerahputih",
    namaBrand: "Semen Merah Putih",
    gambarUtama: "/produk/SEMEN MERAH PUTIH.png",
    logoSrc: "/produk/Semenmerahputih/logosemenmerahputih.webp",
    descKey: "semenmerahputih_desc",
    featuresKeys: [
      "semenmerahputih_features_1",
      "semenmerahputih_features_2",
      "semenmerahputih_features_3",
      "semenmerahputih_features_4",
      "semenmerahputih_features_5",
    ],
    variants: SemenmerahputihVariants,
  },
  {
    slug: "servvo",
    namaBrand: "Servvo",
    gambarUtama: "/produk/SERVVO.png",
    logoSrc: "/produk/Servvo/logoservvo.png",
    descKey: "servvo_desc",
    featuresKeys: [
      "servvo_features_1",
      "servvo_features_2",
      "servvo_features_3",
      "servvo_features_4",
      "servvo_features_5",
    ],
    variants: ServvoVariants,
  },
  {
    slug: "slg",
    namaBrand: "Slg",
    gambarUtama: "/produk/SLGG.png",
    logoSrc: "/produk/Slg/logoslg.webp",
    descKey: "slg_desc",
    featuresKeys: [
      "slg_features_1",
      "slg_features_2",
      "slg_features_3",
      "slg_features_4",
      "slg_features_5",
    ],
    variants: SlgVariants,
  },
  {
    slug: "superex",
    namaBrand: "Superex",
    gambarUtama: "/produk/SUPEREXX.png",
    logoSrc: "/produk/Superex/logosuperex.png",
    descKey: "superex_desc",
    featuresKeys: [
      "superex_features_1",
      "superex_features_2",
      "superex_features_3",
      "superex_features_4",
      "superex_features_5",
    ],
    variants: SuperexVariants,
  },
  {
    slug: "supreme",
    namaBrand: "Supreme",
    gambarUtama: "/produk/SUPREMEE.png",
    logoSrc: "/produk/Supreme/logosupreme.png",
    descKey: "supreme_desc",
    featuresKeys: [
      "supreme_features_1",
      "supreme_features_2",
      "supreme_features_3",
      "supreme_features_4",
    ],
    variants: SupremeVariants,
  },
  {
    slug: "tokka",
    namaBrand: "tokka",
    gambarUtama: "/produk/TOKKAA.png",
    logoSrc: "/produk/Tokka/logotokka.svg",
    descKey: "tokka_desc",
    featuresKeys: ["tokka_features_1", "tokka_features_2", "tokka_features_3"],
    variants: TokkaVariants,
  },
  {
    slug: "trilliun",
    namaBrand: "Trilliun Hose",
    gambarUtama: "/produk/TRILLIUN.png",
    logoSrc: "/produk/Trilliun/logotrilliunhose.png",
    descKey: "trilliunhose_desc",
    featuresKeys: [
      "trilliunhose_features_1",
      "trilliunhose_features_2",
      "trilliunhose_features_3",
      "trilliunhose_features_4",
      "trilliunhose_features_5",
    ],
    variants: TrilliunVariants,
  },
  {
    slug: "wavin",
    namaBrand: "Wavin",
    gambarUtama: "/produk/WAVIN.png",
    logoSrc: "/produk/Wavin/logowavin.png",
    descKey: "wavin_desc",
    featuresKeys: [
      "wavin_features_1",
      "wavin_features_2",
      "wavin_features_3",
      "wavin_features_4",
      "wavin_features_5",
    ],
    variants: WavinVariants,
  },
  {
    slug: "trilliunware",
    namaBrand: "trilliunware",
    gambarUtama: "/produk/TRILLIUNWARE.png",
    logoSrc: "/produk/Trilliunware/logotrilliunwaree.png",
    descKey: "trilliunware_desc",
    featuresKeys: [
      "trilliunware_features_1",
      "trilliunware_features_2",
      "trilliunware_features_3",
      "trilliunware_features_4",
      "trilliunware_features_5",
    ],
    variants: TrilliunwareVariants,
  },
  {
    slug: "aquaproof",
    namaBrand: "Aquaproof",
    gambarUtama: "/produk/AQUAPROOFF.PNG",
    logoSrc: "/produk/Aquaproof/logoaquaproof.jpeg",
    descKey: "aquaproof_desc",
    featuresKeys: [
      "aquaproof_features_1",
      "aquaproof_features_2",
      "aquaproof_features_3",
      "aquaproof_features_4",
      "aquaproof_features_5",
    ],
    variants: AquaproofVariants,
  },
  {
    slug: "bildo",
    namaBrand: "Bildo",
    gambarUtama: "/produk/BILDOO.png",
    logoSrc: "/produk/Bildo/logobildo.png",
    descKey: "bildo_desc",
    featuresKeys: ["bildo_features_1", "bildo_features_2", "bildo_features_3"],
    variants: BildoVariants,
  },
  {
    slug: "yoshino",
    namaBrand: "Yoshino Gypsium",
    gambarUtama: "/produk/YOSHINOO.png",
    logoSrc: "/produk/Yoshino/logoyoshino.png",
    descKey: "yoshino_desc",
    featuresKeys: [
      "yoshino_features_1",
      "yoshino_features_2",
      "yoshino_features_3",
      "yoshino_features_4",
      "yoshino_features_5",
    ],
    variants: YoshinoVariants,
  },
  {
    slug: "dulux",
    namaBrand: "Dulux",
    gambarUtama: "/produk/DULUXX.png",
    logoSrc: "/produk/Dulux/logoduluxx.png",
    descKey: "dulux_desc",
    featuresKeys: [
      "dulux_features_1",
      "dulux_features_2",
      "dulux_features_3",
      "dulux_features_1",
      "dulux_features_2",
      "dulux_features_3",
    ],
    variants: DuluxVariants,
  },
];
export default produkDetailList;

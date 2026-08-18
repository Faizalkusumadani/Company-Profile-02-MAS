"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import {
  GiWheelbarrow,
  GiBathtub,
  GiFireExtinguisher,
  GiHamburgerMenu,
} from "react-icons/gi";
import type { IconType } from "react-icons";
import { useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProductCategoryKey = "name_1" | "name_2" | "name_3";
interface Product {
  id: number | string;
  name: string;
  image?: string;
  description?: string;
  slug: string;
  category: ProductCategoryKey;
  rating?: number;
  reviews?: number;
  discount?: string | number;
  variants?: string;
  href?: string;
  price?: number;
}

interface TabCategory {
  id: string;
  label: string;
  icon?: string;
  products: Product[];
}

interface MenuTabsCardProps {
  categories: TabCategory[];
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

type AppIcon = IconType;

const iconMap: Record<string, AppIcon> = {
  GiHamburgerMenu,
  GiWheelbarrow,
  GiBathtub,
  GiFireExtinguisher,
};
// ─── Animation Variants (defined outside component to avoid re-creation) ──────

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.2 },
  },
};

// ─── Product Card (extracted untuk menghindari re-render overhead) ────────────
function ProductCard({
  produk,
  t,
}: {
  produk: Product;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <m.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group flex flex-col rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200"
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden shrink-0">
        <Image
          src={produk.image || "/placeholder.png"}
          alt={produk.name}
          width={500}
          height={370}
          loading="lazy"
          fetchPriority="high"
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Variants Badge */}
        {produk.variants && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-mas-red shadow-md">
            {produk.variants}
          </div>
        )}

        {/* Discount Badge */}
        {produk.discount && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
            -{produk.discount}%
          </div>
        )}

        {/* Hover Overlay - Desktop only */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hidden md:flex md:group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
          <Link
            href={`/produk/${produk.slug}`}
            className="bg-white border border-red-600 text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            {t("ctaproducts")}
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3.5 sm:p-5 flex flex-col grow">
        <h3 className="font-bold mb-1.5 sm:mb-2 text-mas-dark text-sm sm:text-lg line-clamp-2 group-hover:text-red-600/70 transition-colors leading-snug">
          {produk.name}
        </h3>

        {/* Category Badge */}
        <span className="inline-block text-[11px] sm:text-xs font-medium text-mas-red mb-2 sm:mb-3">
          {t(produk.category)}
        </span>

        <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 sm:line-clamp-4 leading-relaxed grow">
          {produk.description}
        </p>

        {/* CTA - Mobile only */}
        <Link
          href={`/produk/${produk.slug}`}
          className="md:hidden mt-3 inline-flex items-center justify-center w-full py-2 border border-red-600 text-red-600 rounded-full text-xs font-semibold active:bg-red-50 transition-colors"
        >
          {t("ctaproducts")}
        </Link>
      </div>
    </m.div>
  );
}
// ─── Mobile Filter Chip (plain button, lepas dari styling TabsTrigger) ────────

function MobileFilterChip({
  label,
  Icon,
  isActive,
  onClick,
}: {
  label: string;
  Icon: AppIcon | null;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`snap-start shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
        isActive
          ? "bg-red-50 border-red-400 text-mas-red"
          : "border-gray-200 text-gray-600"
      }`}
    >
      {Icon && <Icon className="shrink-0" size={16} strokeWidth={1.75} />}
      <span>{label}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MenuTabsCard({ categories }: MenuTabsCardProps) {
  const t = useTranslations("Products");
  const tNav = useTranslations("Navigation");

  const [activeTab, setActiveTab] = useState(categories[0]?.id ?? "");

  const activeCategory =
    categories.find((cat) => cat.id === activeTab) ?? categories[0];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Filter - Mobile: custom horizontal scroll chips (lepas dari TabsTrigger shadcn) */}
      <div className="flex sm:hidden overflow-x-auto gap-2 py-2 mb-6 px-1 -mx-1 snap-x snap-mandatory scrollbar-hide">
        {categories.map((cat) => (
          <MobileFilterChip
            key={cat.id}
            label={cat.label}
            Icon={cat.icon ? iconMap[cat.icon] : null}
            isActive={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
          />
        ))}
      </div>

      {/* Tab Triggers - Desktop: grid cards (tetap pakai shadcn Tabs) */}
      <TabsList className="hidden sm:flex w-full mx-auto h-auto flex-wrap py-2 mb-10 gap-2 bg-transparent">
        {categories.map((cat) => {
          const IconComponent = cat.icon ? iconMap[cat.icon] : null;
          return (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="flex-1 min-w-0 text-sm md:text-base lg:text-lg text-gray-700 py-4 md:py-6 px-3 rounded-2xl bg-zinc-50 border border-gray-100 data-[state=active]:bg-red-50 data-[state=active]:border-red-400 data-[state=active]:text-red-500"
            >
              <div className="flex flex-col items-center">
                {IconComponent && (
                  <IconComponent
                    className="text-mas-red mb-2 md:mb-4"
                    strokeWidth={0.5}
                    size={36}
                  />
                )}
                {cat.label}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tab Contents - Desktop tetap dirender per kategori (shadcn handle show/hide) */}
      <div className="hidden sm:block">
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-2 sm:mt-8">
            <ProductGridSection cat={cat} t={t} tNav={tNav} />
          </TabsContent>
        ))}
      </div>

      {/* Content - Mobile: render hanya kategori aktif (dikontrol via state, bukan TabsContent) */}
      <div className="sm:hidden">
        {activeCategory && (
          <ProductGridSection cat={activeCategory} t={t} tNav={tNav} />
        )}
      </div>
    </Tabs>
  );
}

// ─── Product Grid Section (dipakai untuk mobile & desktop) ────────────────────

function ProductGridSection({
  cat,
  t,
  tNav,
}: {
  cat: TabCategory;
  t: ReturnType<typeof useTranslations>;
  tNav: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
      {/* Product count */}
      <m.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-2 sm:py-5"
      >
        <p className="text-gray-500 text-sm sm:text-base mb-3">
          {t("show_product")}{" "}
          <span className="font-semibold text-mas-red">
            {cat.products.length}
          </span>{" "}
          {tNav("product")}
        </p>
      </m.div>

      <AnimatePresence mode="wait">
        <m.div
          key={cat.id}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-4 px-4 sm:px-0 sm:gap-6 lg:gap-8"
        >
          {cat.products.map((produk) => (
            <ProductCard key={produk.id} produk={produk} t={t} />
          ))}
        </m.div>
      </AnimatePresence>
    </>
  );
}

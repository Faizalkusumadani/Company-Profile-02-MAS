"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import { LayoutGrid, Shovel, Bath, FireExtinguisher } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number | string;
  name: string;
  image?: string;
  description?: string;
  slug: string;
  category?: string;
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

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Shovel,
  Bath,
  FireExtinguisher,
};

// ─── Animation Variants (defined outside component to avoid re-creation) ──────

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // lebih cepat dari 0.15 → terasa lebih snappy
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
      className="group rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 bg-white"
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Image
          src={produk.image || "/placeholder.png"}
          alt={produk.name}
          width={500}
          height={370}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Variants Badge */}
        {produk.variants && (
          <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 shadow-md">
            {produk.variants}
          </div>
        )}

        {/* Discount Badge */}
        {produk.discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            -{produk.discount}%
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/produk/${produk.slug}`}
            className="bg-white border border-red-600 text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            {t("ctaproducts")}
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold mb-2 text-gray-900 text-base sm:text-lg line-clamp-2 group-hover:text-red-600/70 transition-colors leading-snug">
          {produk.name}
        </h3>

        {/* Category Badge */}
        <span className="inline-block text-xs font-medium text-red-700 mb-3">
          {produk.category}
        </span>

        <p className="text-gray-500 text-sm line-clamp-4 leading-relaxed">
          {produk.description}
        </p>
      </div>
    </m.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MenuTabsCard({ categories }: MenuTabsCardProps) {
  const t = useTranslations("Products");
  const tNav = useTranslations("Navigation");

  return (
    <Tabs defaultValue={categories[0]?.id}>
      {/* Tab Triggers */}
      <TabsList className="w-full mx-auto h-auto flex flex-wrap py-2 mb-6 sm:mb-10 gap-2">
        {categories.map((cat) => {
          const IconComponent = cat.icon ? iconMap[cat.icon] : null;
          return (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 py-2 px-3"
            >
              <div className="flex flex-col items-center">
                {IconComponent && (
                  <IconComponent
                    className="text-red-700 mb-3"
                    strokeWidth={0.5}
                    size={18}
                  />
                )}
                {cat.label}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tab Contents */}
      {categories.map((cat) => (
        <TabsContent key={cat.id} value={cat.id} className="mt-4 sm:mt-8">
          {/* Product count */}
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-3 sm:py-5"
          >
            <p className="text-gray-500 text-sm sm:text-base">
              {t("show_product")}{" "}
              <span className="font-semibold text-red-700">
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
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
            >
              {cat.products.map((produk) => (
                <ProductCard key={produk.id} produk={produk} t={t} />
              ))}
            </m.div>
          </AnimatePresence>
        </TabsContent>
      ))}
    </Tabs>
  );
}

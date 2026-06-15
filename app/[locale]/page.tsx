"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion as m, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ArrowRight, FireExtinguisher, Bath, Shovel } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Headercarousel from "@/components/ui/headercarousel";
import FaqAccordion from "@/components/ui/Faq";
import BrandMarquee from "@/components/ui/Brandmarquee";
import StatItem from "@/components/ui/Stats";
import Slides from "../tools/slides";
import features from "../tools/features";
import testimonidata from "../tools/testimoniData";
import Brands from "../tools/brands";
import faqData from "../tools/faq";
import { useTranslations } from "next-intl";

const TestimonialCard = dynamic(() => import("@/components/ui/testimonicard"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-56 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────
type LocationCard = {
  key: string;
  icon: LucideIcon;
  nameKey: string;
  descKey: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const stats = [
  { number: "13+", labelKey: "brands" },
  { number: "1000+", labelKey: "partners" },
  { number: "15+", labelKey: "years" },
  { number: "30+", labelKey: "fleet" },
] as const;

const locationCards: LocationCard[] = [
  {
    key: "Building Materials",
    icon: Shovel,
    nameKey: "name_1",
    descKey: "icon_1_desc",
  },
  { key: "Sanitary", icon: Bath, nameKey: "name_2", descKey: "icon_2_desc" },
  {
    key: "Safety",
    icon: FireExtinguisher,
    nameKey: "name_3",
    descKey: "icon_3_desc",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      // spring-based stagger: terasa natural, tidak kaku seperti linear
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// Slide dari kanan + sedikit scale — modern & energik
const cardVariants = {
  hidden: {
    opacity: 0,
    x: 40,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      // spring physics: lebih hidup daripada cubic-bezier manual
      type: "spring" as const,
      stiffness: 260,
      damping: 22,
      mass: 0.8,
    },
  },
};

// Hover variant — dikelola penuh oleh Framer Motion (bukan CSS)
const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  hover: {
    y: -6,
    boxShadow:
      "0 20px 40px -12px rgb(0 0 0 / 0.18), 0 8px 16px -8px rgb(0 0 0 / 0.12)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    y: -2,
    scale: 0.99,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
    },
  },
};

// Icon wrapper: scale + rotate saat hover card
const iconWrapperVariants = {
  rest: { backgroundColor: "rgb(254 242 242)", scale: 1, rotate: 0 },
  hover: {
    backgroundColor: "rgb(185 28 28)",
    scale: 1.08,
    rotate: -4,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 20,
    },
  },
};

const iconVariants = {
  rest: { color: "rgb(185 28 28)" },
  hover: {
    color: "rgb(255 255 255)",
    transition: { duration: 0.15 },
  },
};

// Shimmer overlay dalam card
const shimmerVariants = {
  rest: { opacity: 0, x: "-100%" },
  hover: {
    opacity: 1,
    x: "100%",
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  },
};

// CTA card
const ctaVariants = {
  rest: { backgroundColor: "rgb(3 7 18)" },
  hover: {
    backgroundColor: "rgb(185 28 28)",
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  tap: { scale: 0.98 },
};

const ctaArrowVariants = {
  rest: { x: 0 },
  hover: {
    x: 5,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 20,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// ─── Page Component ───────────────────────────────────────────────────────────
export default function Beranda() {
  const tstats = useTranslations("Home.Stats");
  const tabout = useTranslations("Home.About");
  const tproduct = useTranslations("Home.Product");
  const tfeature = useTranslations("Home.Features");
  const ttestimoni = useTranslations("Home.Testimoni");
  const tfaq = useTranslations("Faq");

  // Respect user's OS-level "Reduce Motion" setting — accessibility best practice
  const shouldReduceMotion = useReducedMotion();

  const faqAllData = useMemo(
    () =>
      faqData.map((item) => ({
        id: item.id,
        question: tfaq(item.questionKey),
        answer: tfaq(item.answerKey),
      })),
    [tfaq],
  );

  return (
    <div className="w-full py-15">
      {/* ── Hero Carousel ── */}
      <Headercarousel slides={Slides} />

      {/* ── Stats Section ── */}
      <div className="py-16 sm:py-20 lg:py-24 px-4">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x-0 divide-y-0">
            {stats.map((stat, index) => {
              const borderClasses = [
                index % 2 === 0 && index < stats.length - 1
                  ? "border-r border-gray-200"
                  : "",
                index < stats.length - 1
                  ? "sm:border-r sm:border-gray-200"
                  : "sm:border-r-0",
                index < 2 ? "border-b border-gray-200 sm:border-b-0" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={stat.labelKey} className={borderClasses}>
                  <StatItem
                    number={stat.number}
                    label={tstats(stat.labelKey)}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      {/* ── Features Section ── */}
      <div className="relative overflow-hidden">
        {/* Background via Next.js Image — bisa di-preload & dioptimasi */}
        <Image
          src="/images/slide-05.png"
          alt=""
          fill
          aria-hidden={true}
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
          quality={75}
        />

        {/* Overlay tetap sama */}
        <div
          className="absolute inset-0 bg-linear-to-b from-black/90 via-black/80 to-black/70"
          aria-hidden="true"
        />
        <section className="relative z-10 px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12 sm:mb-14 md:mb-16 space-y-8">
              <p className="tracking-[0.3em] text-white/50 uppercase font-light text-xs sm:text-base max-w-4xl mx-auto">
                {tfeature("desc_features")}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                {tfeature("title_features")}
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-7">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.key ?? index}
                    className="flex flex-col items-start space-y-3 basis-full sm:basis-[45%] lg:basis-[30%] max-w-87.5"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className="w-10 h-10 text-red-700 shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="text-lg font-semibold text-white">
                        {tfeature(`${feature.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                      {tfeature(`${feature.key}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── About Section ── */}
      <div className="px-4 py-15 sm:py-18 lg:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:gap-14 lg:grid-cols-2 items-center">
            <m.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div
                  className="absolute w-75 h-75 md:w-132.5 md:h-132.5 rounded-full bg-linear-to-br from-gray-300 via-gray-400 to-purple-300 blur-3xl opacity-80"
                  aria-hidden="true"
                />
                <Image
                  src="/images/hero-mas-05.png"
                  width={900}
                  height={600}
                  priority
                  alt="Tim PT Mega Adhitama Sejati"
                  className="w-full h-full z-10 object-contain rounded-4xl mask-[linear-gradient(to_bottom,black_90%,transparent_100%)]"
                />
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08,
              }}
              className="order-2 lg:order-1 space-y-4 sm:space-y-5"
            >
              <div className="inline-block">
                <span className="text-red-700/70 uppercase font-light tracking-[0.3em] text-base">
                  {tabout("title")}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Mega Adhitama Sejati
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed text-justify [text-align-last:start]">
                {tabout("desc")}
              </p>
              <div className="pt-2 sm:pt-4">
                <Link
                  href="/profil/perusahaan"
                  className="inline-flex items-center gap-2 border border-red-700 text-red-700 font-medium px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group"
                >
                  {tabout("ctaabout")}
                  <ArrowRight
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </m.div>
          </div>
        </div>
      </div>

      {/* ── Product Section ── */}
      <div className="relative overflow-hidden px-4 py-16 sm:py-20 lg:py-24">
        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <m.header
            className="flex flex-col items-center gap-4 text-center mb-12 sm:mb-14 md:mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 24,
            }}
          >
            <p className="text-red-700/70 uppercase font-light tracking-[0.3em] text-base">
              {tproduct("title-product")}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug max-w-3xl">
              {tproduct("sub-product")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl">
              {tproduct("sub-desc-product")}
            </p>
          </m.header>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Product Image — fade + slide kiri */}
            <m.div
              className="relative w-full aspect-square flex items-center justify-center"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                delay: 0.1,
              }}
            >
              <div
                className="absolute w-75 h-75 md:w-132.5 md:h-132.5 rounded-full bg-linear-to-br from-gray-300 via-gray-400 to-purple-300 blur-3xl opacity-80"
                aria-hidden="true"
              />
              <Image
                src="/images/hero-mas-03.png"
                width={900}
                height={700}
                priority
                alt="Produk PT Mega Adhitama Sejati"
                className="w-full h-full z-10 object-contain rounded-4xl mask-[linear-gradient(to_bottom,black_90%,transparent_100%)]"
              />
            </m.div>

            {/* ── Product Cards ── */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-5"
            >
              {locationCards.map(({ key, icon: Icon, nameKey, descKey }) => (
                <m.div
                  key={key}
                  variants={cardVariants}
                  initial="rest"
                  whileHover={shouldReduceMotion ? undefined : "hover"}
                  whileTap={shouldReduceMotion ? undefined : "tap"}
                  animate="rest"
                  {...(shouldReduceMotion
                    ? {}
                    : { variants: { ...cardVariants, ...cardHoverVariants } })}
                  style={{ borderRadius: 24 }}
                  className="relative overflow-hidden border border-gray-100 bg-white/80 backdrop-blur-xl p-6 sm:p-7 cursor-default"
                  layout
                >
                  {/* Shimmer overlay — pure Framer, bukan CSS */}
                  <m.div
                    variants={shimmerVariants}
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-r from-transparent via-red-50/60 to-transparent pointer-events-none"
                    style={{ zIndex: 0 }}
                  />

                  <div className="relative z-10 flex items-start gap-5">
                    {/* Icon wrapper — animasi warna & scale via Framer */}
                    <m.div
                      variants={iconWrapperVariants}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgb(254 242 242)" }}
                    >
                      <m.div variants={iconVariants}>
                        <Icon
                          className="w-10 h-10"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </m.div>
                    </m.div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tproduct(nameKey)}
                      </h3>
                      <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                        {tproduct(descKey)}
                      </p>
                    </div>
                  </div>
                </m.div>
              ))}

              {/* CTA Card */}
              <m.div variants={cardVariants}>
                <m.div
                  initial="rest"
                  whileHover={shouldReduceMotion ? undefined : "hover"}
                  whileTap={shouldReduceMotion ? undefined : "tap"}
                  animate="rest"
                  variants={ctaVariants}
                  style={{ borderRadius: 24 }}
                  className="overflow-hidden shadow-xl"
                >
                  <Link
                    href="/produk"
                    className="flex items-center justify-between px-6 sm:px-7 py-5 sm:py-6"
                  >
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-white">
                        Konsultasikan kebutuhan proyek Anda
                      </p>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">
                        Dapatkan rekomendasi produk terbaik bersama tim kami.
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 ml-4">
                      <m.div variants={ctaArrowVariants}>
                        <ArrowRight
                          className="w-7 h-5 text-white"
                          aria-hidden="true"
                        />
                      </m.div>
                    </div>
                  </Link>
                </m.div>
              </m.div>
            </m.div>
          </div>
        </div>
      </div>

      {/* ── Brand Marquee ── */}
      <div className="border-y border-gray-100 bg-gray-100">
        <BrandMarquee
          brands={Brands}
          title="Brand Partner"
          subtitle={tproduct("desc_product")}
          speed={20}
          direction="left"
          pauseOnHover
        />
      </div>

      {/* ── FAQ ── */}
      <div className="px-4 py-15 sm:py-18 lg:py-20">
        <FaqAccordion
          data={faqAllData}
          title={tfaq("title_faq")}
          subtitle={tfaq("faq_desc")}
        />
      </div>

      {/* ── Testimonials ── */}
      <div className="px-4 py-16 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center mb-12 sm:mb-14">
            <p className="text-xs sm:text-sm tracking-[0.3em] text-red-700/70 uppercase font-light">
              {ttestimoni("testimoni")}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-700 leading-snug">
              {ttestimoni("desc_testimoni")}
            </h2>
          </div>

          <div className="relative px-10">
            <TestimonialCard testimonials={testimonidata} />
          </div>
        </div>
      </div>
    </div>
  );
}

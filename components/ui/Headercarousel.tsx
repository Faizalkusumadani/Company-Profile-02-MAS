"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slide {
  src: string;
  subtitle: string;
  title: string;
  description: string;
}

interface HeaderCarouselProps {
  slides: Slide[];
  autoplayDelay?: number;
  pageTitle: string;
}

// ─── Transition configs ───────────────────────────────────────────────────────
const imageCenterTransition: Transition = {
  duration: 1.1,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const textTransition: Transition = {
  duration: 0.65,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const reducedTransition: Transition = { duration: 0.3 };

// ─── Variants ─────────────────────────────────────────────────────────────────
const imageVariants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const imageVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const overlayVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const textContainerVariants = {
  enter: {},
  center: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  exit: {},
};

const textItemVariants = {
  enter: { opacity: 0, y: 28, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(4px)" },
};

const textItemVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// ─── Module-level preload guard ───────────────────────────────────────────────
const preloadedUrls = new Set<string>();

function preloadIfNeeded(src: string) {
  if (!preloadedUrls.has(src)) {
    preload(src, { as: "image", fetchPriority: "low" });
    preloadedUrls.add(src);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeaderCarousel({
  slides,
  autoplayDelay = 7000,
  pageTitle,
}: HeaderCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false);
  const total = slides.length;

  const shouldReduceMotion = useReducedMotion();
  const activeTransition = shouldReduceMotion
    ? reducedTransition
    : textTransition;
  const activeImageVariants = shouldReduceMotion
    ? imageVariantsReduced
    : imageVariants;
  const activeTextItemVariants = shouldReduceMotion
    ? textItemVariantsReduced
    : textItemVariants;

  // Live region: umumkan pergantian slide ke screen reader tanpa
  // memindahkan fokus atau menduplikasi H1.
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // ── Preload gambar slide berikutnya sesaat sebelum giliran tampil ──
  useEffect(() => {
    const nextIndex = (current + 1) % total;
    if (nextIndex === 0) return;

    const leadTime = Math.min(2000, autoplayDelay * 0.6);
    const timer = setTimeout(
      () => preloadIfNeeded(slides[nextIndex].src),
      Math.max(autoplayDelay - leadTime, 0),
    );

    return () => clearTimeout(timer);
  }, [current, total, slides, autoplayDelay]);

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total],
  );

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  // ── Autoplay: berhenti saat hover, fokus keyboard, atau reduced-motion ──
  useEffect(() => {
    if (isPaused || !firstSlideLoaded || shouldReduceMotion) return;
    const timer = setInterval(goNext, autoplayDelay);
    return () => clearInterval(timer);
  }, [goNext, autoplayDelay, isPaused, firstSlideLoaded, shouldReduceMotion]);

  return (
    <section className="lg:mt-0" aria-roledescription="carousel">
      {/*
        H1 tunggal & stabil untuk halaman ini. Disembunyikan secara visual
        (bukan dari DOM) sehingga tetap terbaca search engine & screen
        reader, tanpa berubah-ubah mengikuti rotasi slide.
      */}
      <h1 className="sr-only">{pageTitle}</h1>

      <div
        className="relative w-full h-[calc(100svh-4rem)] lg:h-[calc(100svh-5rem)] overflow-hidden bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* ── Background Image ───────────────────────────────────────────── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            variants={activeImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={imageCenterTransition}
          >
            <Image
              src={slides[current].src}
              alt=""
              fill
              loading={current === 0 ? "eager" : "lazy"}
              fetchPriority={current === 0 ? "high" : "auto"}
              quality={75}
              className="object-cover"
              sizes="100vw"
              onLoad={
                current === 0 ? () => setFirstSlideLoaded(true) : undefined
              }
            />
          </motion.div>

          {/* ── Overlay ─────────────────────────────────────────────────── */}
          <motion.div
            key={`overlay-${current}`}
            className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/20"
            variants={overlayVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </AnimatePresence>

        {/* ── Slide Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-20 z-10"
            variants={textContainerVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="max-w-2xl">
              <motion.p
                variants={activeTextItemVariants}
                transition={activeTransition}
                className="text-[11px] sm:text-xs lg:text-[13px] tracking-[0.4em] text-white/60 uppercase font-light mb-3"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div
                variants={activeTextItemVariants}
                transition={activeTransition}
                className="w-10 h-0.5 bg-mas-red mb-4"
                aria-hidden="true"
              />

              {/*
                Judul per-slide: secara semantik ini adalah copy promosi
                yang berganti-ganti, bukan judul halaman — jadi H2, bukan
                H1. H1 halaman sudah didefinisikan secara statis di atas.
              */}
              <motion.h2
                variants={activeTextItemVariants}
                transition={activeTransition}
                className="text-[2rem] sm:text-5xl lg:text-[3.75rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-4"
              >
                {slides[current].title}
              </motion.h2>

              <motion.p
                variants={activeTextItemVariants}
                transition={activeTransition}
                className="text-sm sm:text-base lg:text-[17px] text-white/75 font-light leading-relaxed max-w-xl"
              >
                {slides[current].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/*
          Live region tersembunyi: mengumumkan pergantian slide ke screen
          reader tanpa memindahkan fokus, terpisah dari elemen visual.
        */}
        <div
          ref={liveRegionRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {`Slide ${current + 1} dari ${total}: ${slides[current].title}`}
        </div>

        {/* ── Nav Controls ──────────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-6 sm:left-14 lg:left-20 z-20 flex items-center gap-3">
          <motion.button
            type="button"
            onClick={goPrev}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="p-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:border-white/70 hover:bg-white/20 transition-colors duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </motion.button>

          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke slide ${i + 1}: ${slide.title}`}
                aria-current={i === current ? "true" : undefined}
                className="group focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-full"
              >
                <motion.div
                  animate={{
                    width: i === current ? 24 : 6,
                    opacity: i === current ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="h-0.75 rounded-full bg-white group-hover:opacity-80"
                />
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={goNext}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="p-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:border-white/70 hover:bg-white/20 transition-colors duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>

        {/* ── Slide Counter ─────────────────────────────────────────────── */}
        <div
          className="absolute bottom-8 right-6 sm:right-10 z-20 flex items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-white font-semibold text-sm tabular-nums">
            {String(current + 1).padStart(2, "0")}
          </span>
          <div className="w-8 h-px bg-white/40" />
          <span className="text-white/40 text-sm tabular-nums">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* ── Progress Bar ─────────────────────────────────────────────── */}
        {!isPaused && firstSlideLoaded && !shouldReduceMotion && (
          <motion.div
            key={`progress-${current}`}
            className="absolute top-0 left-0 h-1 bg-mas-red z-20 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: autoplayDelay / 1000, ease: "linear" }}
            style={{ width: "100%" }}
            aria-hidden="true"
          />
        )}
      </div>
    </section>
  );
}

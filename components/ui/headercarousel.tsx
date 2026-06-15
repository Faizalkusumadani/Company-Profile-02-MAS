"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeaderCarouselProps {
  slides: Array<{
    src: string;
    subtitle: string;
    title: string;
    description: string;
  }>;
  autoplayDelay?: number;
}

// ─── Transition configs (dipisah dari variants) ───────────────────────────────

const imageCenterTransition: Transition = {
  duration: 1.1,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const textTransition: Transition = {
  duration: 0.65,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// ─── Variants — hanya animatable values, TANPA transition di dalamnya ─────────
const imageVariants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const overlayVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// staggerChildren & delayChildren BOLEH di dalam transition pada textContainerVariants
const textContainerVariants = {
  enter: {},
  center: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: {},
};

const textItemVariants = {
  enter: { opacity: 0, y: 28, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(4px)" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeaderCarousel({
  slides,
  autoplayDelay = 7000,
}: HeaderCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => goNext(), autoplayDelay);
    return () => clearInterval(timer);
  }, [goNext, autoplayDelay, isPaused]);

  return (
    <div
      className="mt-5 relative w-full h-105 sm:h-130 lg:h-170 overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Image ───────────────────────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={imageCenterTransition}
        >
          <Image
            src={slides[current].src}
            alt={slides[current].title}
            fill
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* ── Overlay ─────────────────────────────────────────────────────── */}
        <motion.div
          key={`overlay-${current}`}
          className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/20"
          variants={overlayVariants}
          initial="enter"
          animate="center"
          exit="exit"
          // ✅ transition flat
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </AnimatePresence>

      {/* ── Slide Content ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${current}`}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-20 z-10"
          variants={textContainerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          // stagger dikontrol via variants.center.transition di atas
          // tidak perlu transition prop di sini
        >
          <div className="max-w-2xl">
            {/* Subtitle */}
            <motion.p
              variants={textItemVariants}
              transition={textTransition} // ✅ flat transition
              className="text-[11px] sm:text-xs lg:text-[13px] tracking-[0.4em] text-white/60 uppercase font-light mb-3"
            >
              {slides[current].subtitle}
            </motion.p>

            {/* Divider dekoratif */}
            <motion.div
              variants={textItemVariants}
              transition={textTransition}
              className="w-10 h-0.5 bg-red-700 mb-4"
            />

            {/* Title */}
            <motion.h1
              variants={textItemVariants}
              transition={textTransition}
              className="text-[2rem] sm:text-5xl lg:text-[3.75rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-4"
            >
              {slides[current].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={textItemVariants}
              transition={textTransition}
              className="text-sm sm:text-base lg:text-[17px] text-white/75 font-light leading-relaxed max-w-xl"
            >
              {slides[current].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Nav Controls (kiri bawah) ──────────────────────────────────────── */}
      <div className="absolute bottom-8 left-6 sm:left-14 lg:left-20 z-20 flex items-center gap-3">
        <motion.button
          onClick={goPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="p-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:border-white/70 hover:bg-white/20 transition-colors duration-200 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group focus:outline-none"
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
          onClick={goNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="p-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:border-white/70 hover:bg-white/20 transition-colors duration-200 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ── Slide Counter (kanan bawah) ────────────────────────────────────── */}
      <div className="absolute bottom-8 right-6 sm:right-10 z-20 flex items-center gap-2">
        <span className="text-white font-semibold text-sm tabular-nums">
          {String(current + 1).padStart(2, "0")}
        </span>
        <div className="w-8 h-px bg-white/40" />
        <span className="text-white/40 text-sm tabular-nums">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── Progress Bar ──────────────────────────────────────────────────── */}
      {!isPaused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute top-0 left-0 h-1 bg-red-700 z-20 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: autoplayDelay / 1000, ease: "linear" }}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}

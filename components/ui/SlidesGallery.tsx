"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  alt: string;
  autoplayDelay?: number;
}

const imageTransition: Transition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
  }),
};

export default function PhotoGallery({
  images,
  alt,
  autoplayDelay = 5000,
}: PhotoGalleryProps) {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const total = images.length;
  const hasMultiple = total > 1;
  const shouldReduceMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number, dir: number) => {
      setCurrent([(index + total) % total, dir]);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(current - 1, -1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1, 1), [current, goTo]);

  // ── Autoplay: berhenti saat hover, fokus keyboard, atau reduced-motion ──
  useEffect(() => {
    if (!hasMultiple || isPaused || shouldReduceMotion || autoplayDelay <= 0) {
      return;
    }
    const timer = setInterval(goNext, autoplayDelay);
    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, shouldReduceMotion, autoplayDelay, goNext]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* ── Foto Utama ── */}
      <div className="group relative h-75 lg:h-100 rounded-lg overflow-hidden bg-gray-100">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={imageTransition}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 750px"
              className="object-cover"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 hover:bg-black/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 hover:bg-black/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}

        {hasMultiple &&
          !isPaused &&
          !shouldReduceMotion &&
          autoplayDelay > 0 && (
            <motion.div
              key={`progress-${current}`}
              className="absolute bottom-0 left-0 h-1 bg-mas-red z-10 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: autoplayDelay / 1000, ease: "linear" }}
              style={{ width: "100%" }}
              aria-hidden="true"
            />
          )}
      </div>

      {/* ── Thumbnail Strip ── */}
      {hasMultiple && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Lihat foto ${i + 1} dari ${total}`}
              aria-current={i === current ? "true" : undefined}
              className={`relative shrink-0 w-24 h-16 sm:w-35 sm:h-24 rounded-md overflow-hidden transition-all focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-mas-red focus-visible:outline-offset-2 ${
                i === current
                  ? "ring-1 ring-mas-red opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

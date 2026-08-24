"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  PanInfo,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.06,
    x: direction > 0 ? 100 : -100,
  }),
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.02,
    x: direction > 0 ? -100 : 100,
  }),
};

const defaultVariantsReduced = {
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

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeaderCarousel({
  slides,
  autoplayDelay = 7000,
  pageTitle,
}: HeaderCarouselProps) {
  const [[current, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const isPaused = isHovering || isManuallyPaused;
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false);
  const [warmIndex, setWarmIndex] = useState<number | null>(null);
  const total = slides.length;

  const shouldReduceMotion = useReducedMotion();
  const firstImageRef = useRef<HTMLImageElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const activeTransition = shouldReduceMotion
    ? reducedTransition
    : textTransition;
  const activeImageVariants = shouldReduceMotion
    ? defaultVariantsReduced
    : imageVariants;
  const activeTextItemVariants = shouldReduceMotion
    ? defaultVariantsReduced
    : textItemVariants;

  // ── Cek apakah slide pertama sudah selesai load (untuk gate autoplay) ──
  useEffect(() => {
    if (firstImageRef.current?.complete) {
      setFirstSlideLoaded(true);
    }
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const paginate = useCallback(
    (newDirection: number) => {
      setWarmIndex(null);
      let nextIndex = current + newDirection;
      if (nextIndex < 0) nextIndex = total - 1;
      else if (nextIndex >= total) nextIndex = 0;
      setPage([nextIndex, newDirection]);
    },
    [current, total],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === current) return;
      setWarmIndex(null);
      setPage([index, index > current ? 1 : -1]);
    },
    [current],
  );

  // ── Autoplay ───────────────────────────────────────────────
  // The visual progress fill is handled declaratively by CSS animation
  // (see the segmented indicator below), keyed to `current` so it
  // restarts cleanly on every slide — no imperative animation controls
  // to keep in sync with mount/unmount.
  useEffect(() => {
    if (!firstSlideLoaded || shouldReduceMotion || isPaused) return;

    const timer = setInterval(() => paginate(1), autoplayDelay);
    return () => clearInterval(timer);
  }, [paginate, autoplayDelay, isPaused, firstSlideLoaded, shouldReduceMotion]);

  // ── Warm up Cache ────────────────────────────────────────
  useEffect(() => {
    const nextIndex = (current + 1) % total;
    const leadTime = Math.min(2000, autoplayDelay * 0.6);
    const timer = setTimeout(
      () => setWarmIndex(nextIndex),
      Math.max(autoplayDelay - leadTime, 0),
    );
    return () => clearTimeout(timer);
  }, [current, total, autoplayDelay]);

  // ── Gestur Swipe ─────────────────────────────────────────
  const handleDragEnd = (e: Event, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1);
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1);
    }
  };

  return (
    <section className="lg:mt-0" aria-roledescription="carousel">
      <h1 className="sr-only">{pageTitle}</h1>

      {/* Keyframes for the per-slide progress fill. Scoped here so the
          component has no external CSS dependency. Restarted cleanly
          each slide via the `key={current}` on the fill element below. */}
      <style>{`
        @keyframes hc-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <div
        className="relative w-full h-[calc(100svh-4rem)] lg:h-[calc(100svh-5rem)] overflow-hidden bg-black touch-pan-y"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
      >
        {/* ── Background layer (images) ─────────────────────────────── */}
        <div className="absolute inset-0 z-0">
          {/* Hidden Warm Cache Image — sizes & quality HARUS sama persis dengan
              <Image> utama di bawah (lihat sizes="(max-width: 640px)..." dan
              quality={80}). Next.js membuat URL /_next/image yang unik per
              kombinasi src+width+quality, jadi kalau nilainya beda, ini bukan
              "warm cache" beneran — cuma download thumbnail kecil yang percuma,
              lalu tetap fetch ulang versi besar saat slide itu jadi current. */}
          {warmIndex !== null && (
            <div
              key={`warm-cache-${warmIndex}`}
              className="absolute inset-0 opacity-0 pointer-events-none -z-10"
              aria-hidden="true"
            >
              <Image
                src={slides[warmIndex].src}
                alt=""
                fill
                quality={80}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1536px"
                loading="eager"
              />
            </div>
          )}

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {/* Draggable Area for Mobile */}
            <motion.div
              key={current}
              custom={direction}
              variants={activeImageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={imageCenterTransition}
              drag={shouldReduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                ref={current === 0 ? firstImageRef : null}
                src={slides[current].src}
                alt=""
                fill
                priority={current === 0}
                fetchPriority={current === 0 ? "high" : "auto"}
                // `priority` sudah otomatis memaksa eager load untuk slide pertama;
                // set loading="eager" eksplisit cuma untuk slide selain slide pertama
                // (biar tidak kena warning Next.js "priority + loading='eager' bersamaan").
                loading={current === 0 ? undefined : "eager"}
                quality={80}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1536px"
                onLoad={() => {
                  if (current === 0 && !firstSlideLoaded) {
                    setFirstSlideLoaded(true);
                  }
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/20" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/*
          ── Foreground layer: content + controls ─────────────────────
          Flex column that spans the full slide height. The text block
          gets the flexible space (and centers itself within it), while
          the control bar is a normal, non-absolute flex item pinned to
          the bottom. This guarantees the two never overlap, regardless
          of description length or viewport size — no magic offsets.
        */}
        <div className="relative z-10 flex h-full flex-col">
          {/* ── Slide Content ───────────────────────────────────────── */}
          <div className="flex flex-1 items-center overflow-hidden px-6 sm:px-14 lg:px-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                className="max-w-2xl pointer-events-none"
                variants={textContainerVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="pointer-events-auto">
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
          </div>

          {/* Live region tersembunyi untuk Accessibility/Screen Readers */}
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {`Slide ${current + 1} dari ${total}: ${slides[current].title}`}
          </div>

          {/* ── Control bar: counter/progress + nav, one row, never overlapping content ── */}
          <div className="flex shrink-0 items-center justify-between gap-6 px-6 pb-8 sm:px-14 sm:pb-10 lg:px-20 lg:pb-12">
            {/* Progress: current slide index + segmented indicator */}
            <div className="flex items-center gap-3">
              <span
                className="text-white font-semibold text-sm tabular-nums"
                aria-hidden="true"
              >
                {String(current + 1).padStart(2, "0")}
                <span className="text-white/40"> / </span>
                {String(total).padStart(2, "0")}
              </span>

              {!shouldReduceMotion && (
                <div className="hidden sm:flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToSlide(i)}
                      className="relative h-1 w-8 overflow-hidden rounded-full bg-white/20 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                      aria-label={`Ke slide ${i + 1}`}
                      aria-current={i === current}
                    >
                      {i < current && (
                        <span className="absolute inset-0 bg-mas-red" />
                      )}
                      {i === current && (
                        <span
                          key={current}
                          className="absolute inset-y-0 left-0 w-full origin-left bg-mas-red"
                          style={{
                            animationName: "hc-progress-fill",
                            animationDuration: `${autoplayDelay}ms`,
                            animationTimingFunction: "linear",
                            animationFillMode: "forwards",
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Arrows + play/pause */}
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur-sm">
              <motion.button
                type="button"
                onClick={() => paginate(-1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition-colors duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              {!shouldReduceMotion && (
                <>
                  <span className="h-4 w-px bg-white/15" aria-hidden="true" />
                  <motion.button
                    type="button"
                    onClick={() => setIsManuallyPaused((prev) => !prev)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition-colors duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                    aria-label={
                      isManuallyPaused
                        ? "Lanjutkan slide otomatis"
                        : "Jeda slide otomatis"
                    }
                  >
                    {isManuallyPaused ? (
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </motion.button>
                  <span className="h-4 w-px bg-white/15" aria-hidden="true" />
                </>
              )}

              <motion.button
                type="button"
                onClick={() => paginate(1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition-colors duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

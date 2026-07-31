"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimation,
  PanInfo,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePageReady } from "@/components/ui/Pageready";

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
  const [isPaused, setIsPaused] = useState(false);
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false);
  const [warmIndex, setWarmIndex] = useState<number | null>(null);
  const total = slides.length;

  const shouldReduceMotion = useReducedMotion();
  const progressControls = useAnimation();
  const { markHeroReady } = usePageReady();
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

  // ── Sync Pageloader ──────────────────────────────────────
  useEffect(() => {
    if (firstImageRef.current?.complete) {
      setFirstSlideLoaded(true);
      markHeroReady();
    }
  }, [markHeroReady]);

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

  const goTo = useCallback(
    (index: number) => {
      setWarmIndex(null);
      setPage([index, index > current ? 1 : -1]);
    },
    [current],
  );

  // ── Autoplay & Progress Bar ──────────────────────────────
  useEffect(() => {
    if (!firstSlideLoaded || shouldReduceMotion) return;

    if (isPaused) {
      progressControls.stop();
      return;
    }

    progressControls.set({ scaleX: 0 });
    progressControls.start({
      scaleX: 1,
      transition: { duration: autoplayDelay / 1000, ease: "linear" },
    });

    const timer = setInterval(() => paginate(1), autoplayDelay);
    return () => {
      clearInterval(timer);
      progressControls.stop();
    };
  }, [
    paginate,
    autoplayDelay,
    isPaused,
    firstSlideLoaded,
    shouldReduceMotion,
    progressControls,
  ]);

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

      <div
        className="relative w-full h-[calc(100svh-4rem)] lg:h-[calc(100svh-5rem)] overflow-hidden bg-black touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Hidden Warm Cache Image */}
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
              quality={60}
              sizes="10vw"
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
              priority={current === 0} // Preload HTML tag khusus slide pertama
              loading="eager" // Solusi Fix Peringatan LCP
              quality={80}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1536px"
              onLoad={() => {
                if (current === 0 && !firstSlideLoaded) {
                  setFirstSlideLoaded(true);
                  markHeroReady();
                }
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* ── Slide Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-20 z-10 pointer-events-none"
            variants={textContainerVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="max-w-2xl pointer-events-auto">
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

        {/* Live region tersembunyi untuk Accessibility/Screen Readers */}
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
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
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
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
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
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 left-0 h-1 bg-mas-red z-20 origin-left"
            animate={progressControls}
            style={{ width: "100%", scaleX: 0 }}
            aria-hidden="true"
          />
        )}
      </div>
    </section>
  );
}

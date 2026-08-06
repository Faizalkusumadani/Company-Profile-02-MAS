"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface NewsSlide {
  image: string;
  date: string;
  title: string;
  description: string;
  href: string;
}

interface NewsCarouselProps {
  slides: NewsSlide[];
  autoplayDelay?: number;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export default function NewsCarousel({
  slides,
  autoplayDelay = 7000,
}: NewsCarouselProps) {
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );
  const goTo = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total],
  );

  useEffect(() => {
    const onVisibilityChange = () => setIsTabHidden(document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (isPaused || isTabHidden || prefersReducedMotion || total <= 1) return;
    const id = setInterval(next, autoplayDelay);
    return () => clearInterval(id);
  }, [isPaused, isTabHidden, prefersReducedMotion, total, autoplayDelay, next]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    },
    [prev, next],
  );

  if (total === 0) return null;

  return (
    <div
      className="relative w-full h-70 sm:h-80 lg:h-112.5 overflow-hidden rounded-lg group"
      role="region"
      aria-roledescription="carousel"
      aria-label="Berita terbaru"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      {slides.map((slide, i) => {
        const isActive = i === index;

        return (
          <motion.div
            key={slide.href || i}
            className={`absolute inset-0 ${isActive ? "" : "pointer-events-none"}`}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: "easeInOut",
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${total}`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              quality={75}
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={i === 0}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6">
              <span className="inline-block bg-mas-red text-white text-xs font-bold px-3 py-1 rounded mb-3">
                {slide.date}
              </span>

              <a
                href={slide.href}
                tabIndex={isActive ? 0 : -1}
                className="rounded-sm focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <h2 className="text-white text-2xl font-semibold mb-2 leading-tight">
                  {slide.title}
                </h2>
              </a>

              <p className="text-gray-300 text-sm line-clamp-3">
                {slide.description}
              </p>
            </div>
          </motion.div>
        );
      })}

      {total > 1 && (
        <>
          {/* Navigation Buttons - Left & Right Edges */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Slide berikutnya"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator - Bottom Center */}
          <div
            className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-2 z-20"
            role="tablist"
            aria-label="Pilih slide"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
                  i === index
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-red-600"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ke slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface newcarouselProps {
  slides: Array<{
    image: string;
    date: string;
    title: string;
    description: string;
    href: string;
  }>;
}

export default function EmblaFadeCarousel({ slides }: newcarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
    },
    [Fade(), Autoplay({ delay: 7000 })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleSelect();
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative w-full h-70 sm:h-80 lg:h-112.5 overflow-hidden rounded-lg group">
      <div ref={emblaRef} className="embla__viewport h-full w-full">
        <div className="embla__container h-full w-full">
          {slides.map((slide, i) => (
            <div key={i} className="embla__slide relative w-full h-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6">
                <span className="inline-block bg-red-700 text-white text-xs font-bold px-3 py-1 rounded mb-3">
                  {slide.title}
                </span>

                <a href={slide.href}>
                  <h2 className="text-white text-2xl font-semibold mb-2 leading-tight">
                    {slide.description}
                  </h2>
                </a>

                <p className="text-gray-300 text-sm line-clamp-3">
                  {slide.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Left & Right Edges */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator - Bottom Center */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === selectedIndex
                ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-red-600"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

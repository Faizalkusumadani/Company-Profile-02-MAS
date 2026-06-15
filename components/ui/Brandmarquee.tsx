"use client";

import Image from "next/image";
import { motion as m, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brand {
  name: string;
  logo: string;
}

interface BrandMarqueeProps {
  brands: Brand[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  title?: string;
  subtitle?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEM_W = 160;
const GAP = 64;

// ─── Framer Variants ──────────────────────────────────────────────────────────

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrandMarquee({
  brands,
  speed = 10,
  direction = "left",
  pauseOnHover = true,
  title,
  subtitle,
}: BrandMarqueeProps) {
  // useReducedMotion() is safe here: framer-motion handles SSR internally,
  // returning null on server and the real value on client — no mismatch.
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const repeated = useMemo(() => [...brands, ...brands], [brands]);

  // All derived values are pure functions of props — same on server & client.
  const scrollWidth = brands.length * (ITEM_W + GAP);
  const animId = `bm-${direction}-${scrollWidth}`;

  // duration: if reducedMotion, set to a very large number so animation
  // appears frozen — avoids "0s" which can cause a flash/jump on some browsers.
  const duration = shouldReduceMotion ? 999999 : scrollWidth / speed;

  const fromX = direction === "left" ? "0px" : `-${scrollWidth}px`;
  const toX = direction === "left" ? `-${scrollWidth}px` : "0px";

  return (
    <section className="py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/*
        suppressHydrationWarning on <style>: the CSS string is deterministic
        (derived only from props), so server & client always match.
        No isMounted / setState-in-effect needed.
      */}
      <style suppressHydrationWarning>{`
        @keyframes ${animId} {
          from { transform: translateX(${fromX}); }
          to   { transform: translateX(${toX}); }
        }
        .bm-track-${animId} {
          animation: ${animId} ${duration}s linear infinite;
          animation-play-state: var(--bm-play-state, running);
          will-change: transform;
        }
      `}</style>

      {/* ── Header ── */}
      {(title || subtitle) && (
        <div className="mx-auto max-w-6xl px-4">
          <m.div
            variants={headerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-12 sm:mb-16 space-y-3"
          >
            {subtitle && (
              <p className="text-xs sm:text-sm tracking-[0.3em] text-red-700/60 uppercase font-medium">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                {title}
              </h2>
            )}
          </m.div>
        </div>
      )}

      {/* ── Marquee wrapper ── */}
      <div
        ref={wrapperRef}
        className="relative w-full cursor-default select-none"
        style={
          {
            "--bm-play-state": pauseOnHover && isPaused ? "paused" : "running",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          } as React.CSSProperties
        }
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        onTouchStart={() => pauseOnHover && setIsPaused(true)}
        onTouchEnd={() => pauseOnHover && setIsPaused(false)}
        aria-label="Brand partner marquee"
      >
        {/* Class name scoped to animId — no clash if >1 marquee on page */}
        <div className={`bm-track-${animId} flex items-center gap-16`}>
          {repeated.map((brand, i) => (
            <BrandItem key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Item ───────────────────────────────────────────────────────────────

function BrandItem({ brand }: { brand: { name: string; logo: string } }) {
  return (
    <m.div
      className="flex items-center justify-center shrink-0 w-40 h-16"
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
    >
      <Image
        src={brand.logo}
        alt={brand.name}
        width={200}
        height={80}
        loading="lazy"
        className="w-full h-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ease-out"
        draggable={false}
      />
    </m.div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

// Komponen untuk gambar dengan zoom
const ZoomableImage = ({
  src,
  alt,
  className,
  sizes,
  title,
  subtitle,
  showLabel = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  title?: string;
  subtitle?: string;
  showLabel?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ref untuk tracking pinch
  const lastPinchDistance = useRef<number | null>(null);
  const initialScale = useRef(1);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Menutup modal sekaligus reset state zoom/pan
  const closeModal = () => {
    setIsOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handler untuk zoom dengan pinch (mobile) - DI PERBAIKI
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    if (e.touches.length === 2) {
      // Pinch gesture - mulai pinch
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );
      lastPinchDistance.current = distance;
      initialScale.current = scale;
      setIsDragging(false);
    } else if (scale > 1) {
      // Dragging only when zoomed
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistance.current !== null) {
      // Pinch zoom - DI PERBAIKI dengan threshold
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );

      const delta = distance - lastPinchDistance.current;
      const threshold = 10; // Minimum perubahan untuk trigger zoom

      if (Math.abs(delta) > threshold) {
        const newScale = Math.min(
          3,
          Math.max(1, initialScale.current + delta / 100),
        );
        setScale(newScale);
        lastPinchDistance.current = distance;
        initialScale.current = newScale;

        // Reset posisi jika scale kembali ke 1
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }
    } else if (isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastPinchDistance.current = null;
    // Snap back if zoomed out
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Double tap untuk zoom (mobile)
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const newScale = scale === 1 ? 2.5 : 1;
    setScale(newScale);
    setPosition({ x: 0, y: 0 });
  };

  // Handle click untuk close modal
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle scroll untuk zoom di desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(3, Math.max(1, scale + delta));
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <>
      {/* Gambar dengan overlay zoom */}
      <div
        className={`relative overflow-hidden rounded-2xl shadow-xl group ring-1 ring-mas-dark/5 cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={sizes}
          draggable={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-mas-dark/70 via-mas-dark/10 to-transparent" />

        {/* Label di bagian bawah */}
        {showLabel && (title || subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
            {subtitle && (
              <p className="text-white/70 text-[10px] sm:text-xs font-medium uppercase tracking-widest mb-0.5 sm:mb-1">
                {subtitle}
              </p>
            )}
            {title && (
              <h3 className="text-white text-sm sm:text-xl md:text-2xl font-bold">
                {title}
              </h3>
            )}
          </div>
        )}

        {/* Tombol zoom - muncul saat hover (desktop) atau selalu visible (mobile) */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center 
            ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
            transition-opacity duration-300 bg-mas-dark/30
          `}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 md:p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <ZoomIn
              className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Indikator zoom untuk mobile */}
        {isMobile && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-[10px] font-medium">
              Tap to zoom
            </span>
          </div>
        )}
      </div>

      {/* Modal Zoom - Optimized for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-mas-dark/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleModalClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <div
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-black/20 rounded-xl sm:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan tombol close dan info */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-linear-to-b from-mas-dark/60 to-transparent">
              <div className="flex-1 min-w-0">
                {subtitle && (
                  <p className="text-white/60 text-[10px] sm:text-xs font-medium uppercase tracking-widest truncate">
                    {subtitle}
                  </p>
                )}
                {title && (
                  <h3 className="text-white text-sm sm:text-lg font-bold truncate">
                    {title}
                  </h3>
                )}
              </div>
              <button
                onClick={closeModal}
                className="bg-black/50 hover:bg-mas-red rounded-full p-2 sm:p-2.5 transition-colors duration-300 ml-2 shrink-0"
                aria-label="Close zoom"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Gambar diperbesar dengan zoom & pan support */}
            <div
              className="relative w-full h-full overflow-hidden touch-none"
              onDoubleClick={handleDoubleTap}
            >
              <div
                className="relative w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={100}
                  draggable={false}
                />
              </div>
            </div>

            {/* Kontrol zoom untuk mobile */}
            {isMobile && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newScale = Math.max(1, scale - 0.5);
                    setScale(newScale);
                    if (newScale <= 1) setPosition({ x: 0, y: 0 });
                  }}
                  className="text-white/70 hover:text-white p-1.5 transition-colors"
                  aria-label="Zoom out"
                >
                  <span className="text-lg font-bold">−</span>
                </button>
                <span className="text-white text-xs font-medium min-w-10 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newScale = Math.min(3, scale + 0.5);
                    setScale(newScale);
                  }}
                  className="text-white/70 hover:text-white p-1.5 transition-colors"
                  aria-label="Zoom in"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="text-white/70 hover:text-white text-xs px-2 py-0.5 border border-white/30 rounded-full transition-colors"
                  aria-label="Reset zoom"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Petunjuk interaksi untuk mobile */}
            {isMobile && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 opacity-60">
                <span className="text-white text-[10px]">
                  Double tap • Pinch to zoom
                </span>
              </div>
            )}

            {/* Petunjuk untuk desktop */}
            {!isMobile && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs">
                  Scroll to zoom • Click outside to close
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomableImage;

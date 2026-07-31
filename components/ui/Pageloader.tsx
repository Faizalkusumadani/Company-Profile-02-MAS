// Pageloader.tsx
"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  // useLayoutEffect: jalan sebelum browser sempat repaint,
  // jadi kalau loader harus disembunyikan (sudah pernah tampil
  // di sesi ini), tidak sempat kelihatan flash sama sekali.
  useLayoutEffect(() => {
    const loader = loaderRef.current;
    const bar = barRef.current;
    const label = labelRef.current;
    if (!loader || !bar || !label) return;

    if (sessionStorage.getItem("loader_shown")) {
      loader.style.display = "none";
      return;
    }
    sessionStorage.setItem("loader_shown", "true");

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        bar.style.width = "100%";
        label.textContent = "Memuat... 100%";
        setTimeout(() => {
          loader.style.opacity = "0";
          setTimeout(() => (loader.style.display = "none"), 600);
        }, 300);
        return;
      }
      const val = Math.min(current, 100);
      bar.style.width = `${val}%`;
      label.textContent = `Memuat... ${Math.round(val)}%`;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={loaderRef}
      id="mas-page-loader"
      aria-hidden="true"
      style={{
        display: "flex", // ← default TAMPIL, bukan "none"
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Image
            src="/Logo-mas.webp"
            alt="MAS Logo"
            width={120}
            height={80}
            style={{ objectFit: "contain" }}
            priority
          />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0f172a",
              letterSpacing: "-0.01em",
            }}
          >
            Mega Adhitama Sejati
          </span>
        </div>

        {/* Progress bar track */}
        <div
          style={{
            width: "200px",
            height: "3px",
            backgroundColor: "#e2e8f0",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              height: "100%",
              width: "0%",
              backgroundColor: "#b22222",
              borderRadius: "9999px",
              transition: "width 0.15s ease",
            }}
          />
        </div>

        {/* Label */}
        <p
          ref={labelRef}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginTop: "-0.5rem",
          }}
        >
          Memuat... 0%
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. JANGAN jalankan Service Worker di mode development (Menghindari bentrok dengan Turbopack)
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // 2. Hanya jalankan di browser yang mendukung
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => {
          // Memberikan teks alternatif jika objek 'err' bernilai undefined
          console.error(
            "SW error:",
            err || "Unknown registration error atau request dibatalkan.",
          );
        });
    }
  }, []);

  return null;
}

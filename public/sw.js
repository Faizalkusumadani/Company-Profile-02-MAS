const CACHE_NAME = "v1.0.1"; // Ubah versi ini setiap kali Anda rilis update besar

// Aset statis dasar (opsional jika ingin pre-cache ikon)
const PRECACHE_ASSETS = [
  "/",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// STRATEGI FETCH YANG AMAN UNTUK NEXT.JS
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Abaikan request ke chrome-extension, internal Next.js dev server, atau POST request
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    !url.protocol.startsWith("http")
  ) {
    return;
  }

  // 2. Untuk file statis Next.js (_next/static/...) -> Aman gunakan Cache-First karena namanya selalu unik (pake hash)
  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response;
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        });
      }),
    );
    return;
  }

  // 3. Untuk halaman HTML / Rute Navigasi -> WAJIB Network-First
  // Supaya jika user online, selalu dapat web terbaru. Jika offline, baru pakai cache lama.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika sukses, simpan versi terbaru ke cache
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        // Jika offline/gagal konek ke server, ambil dari cache
        return caches.match(event.request);
      }),
  );
});

// ============================================================================
// Service Worker — PT. Mega Adhitama Sejati (MAS)
// ============================================================================
// Prinsip yang dipakai di sini:
//   1. Cache di-versioning per TIPE aset (bukan satu CACHE_NAME untuk semua),
//      supaya update satu jenis aset nggak perlu membuang cache jenis lain.
//   2. Strategi caching disesuaikan sifat masing-masing request:
//        - Aset statis (_next/static)  -> Cache-First   (aman, nama file immutable)
//        - Gambar                       -> Stale-While-Revalidate
//        - Navigasi halaman             -> Network-First + navigation preload
//        - Request lain (API/data)      -> Network-First biasa
//   3. Request internal Next.js App Router (RSC/prefetch) di-exclude TOTAL
//      dari SW — ini akar masalah yang bikin RSC payload ke-cache dan
//      ke-serve sebagai HTML di production.
//   4. Cache dibatasi ukurannya (trimCache) supaya nggak tumbuh tanpa batas.
// ============================================================================

const SW_VERSION = "v1.1.0"; // Naikkan setiap kali strategi caching berubah,
// supaya cache lama otomatis dibuang di 'activate'.

const STATIC_CACHE = `static-${SW_VERSION}`;
const PAGES_CACHE = `pages-${SW_VERSION}`;
const IMAGE_CACHE = `images-${SW_VERSION}`;
const ALL_CACHES = [STATIC_CACHE, PAGES_CACHE, IMAGE_CACHE];

// Halaman fallback saat offline dan cache pun miss.
// Buat route ini di project (mis. app/offline/page.tsx) kalau belum ada.
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Batas jumlah entry per cache (LRU sederhana), biar nggak membengkak.
const MAX_ENTRIES = {
  [PAGES_CACHE]: 50,
  [IMAGE_CACHE]: 60,
};

// ----------------------------------------------------------------------------
// Helper: trim cache berdasarkan urutan insert (FIFO — cukup untuk kasus umum)
// ----------------------------------------------------------------------------
async function trimCache(cacheName, maxEntries) {
  if (!maxEntries) return;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

// ----------------------------------------------------------------------------
// Helper: deteksi request internal Next.js App Router (RSC / prefetch).
// URL request ini SAMA PERSIS dengan halaman biasa, tapi isi response-nya
// flight data, bukan HTML — makanya WAJIB di-exclude dari semua caching SW.
// ----------------------------------------------------------------------------
function isNextInternalRequest(request) {
  return (
    request.headers.has("RSC") ||
    request.headers.has("Next-Router-Prefetch") ||
    request.headers.has("Next-Router-State-Tree") ||
    request.headers.has("Next-Url") ||
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("Sec-Purpose") === "prefetch"
  );
}

// ----------------------------------------------------------------------------
// INSTALL
// ----------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // allSettled: kalau 1 aset gagal di-precache, install SW tetap lanjut
      // (addAll bawaan browser akan gagal TOTAL kalau 1 saja gagal).
      await Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url)));
    })(),
  );
  self.skipWaiting();
});

// ----------------------------------------------------------------------------
// ACTIVATE — bersihkan cache versi lama + aktifkan navigation preload
// ----------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !ALL_CACHES.includes(k))
          .map((k) => caches.delete(k)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
  self.clients.claim();
});

// ----------------------------------------------------------------------------
// FETCH — router utama, pilih strategi berdasarkan jenis request
// ----------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Lewati: non-GET, cross-origin, protokol non-http(s), HMR dev server,
  //    dan request internal Next.js (RSC/prefetch) — INI FIX UTAMANYA.
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    !url.protocol.startsWith("http") ||
    isNextInternalRequest(request)
  ) {
    return; // biarkan browser handle langsung, jangan di-intercept SW
  }

  // 2. Aset statis Next.js -> Cache-First (nama file immutable, pakai hash)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 3. Gambar -> Stale-While-Revalidate (cepat, update di background)
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // 4. Navigasi halaman (buka/reload URL) -> Network-First + offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigate(event));
    return;
  }

  // 5. Sisanya (API/data fetch same-origin) -> Network-First tanpa fallback offline
  event.respondWith(networkFirst(request, PAGES_CACHE));
});

// ----------------------------------------------------------------------------
// Strategy: Cache-First
// ----------------------------------------------------------------------------
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.status === 200) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

// ----------------------------------------------------------------------------
// Strategy: Network-First (untuk data/API, bukan dokumen navigasi)
// ----------------------------------------------------------------------------
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      trimCache(cacheName, MAX_ENTRIES[cacheName]);
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

// ----------------------------------------------------------------------------
// Strategy: Network-First khusus navigasi — pakai navigation preload kalau
// tersedia (request preload jalan paralel sejak awal, nggak nunggu SW boot).
// ----------------------------------------------------------------------------
async function networkFirstNavigate(event) {
  const { request } = event;
  try {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      cachePage(request, preloadResponse.clone());
      return preloadResponse;
    }

    const response = await fetch(request);
    if (response && response.status === 200) {
      cachePage(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlineFallback = await caches.match(OFFLINE_URL);
    if (offlineFallback) return offlineFallback;

    throw err;
  }
}

function cachePage(request, response) {
  caches.open(PAGES_CACHE).then((cache) => {
    cache.put(request, response);
    trimCache(PAGES_CACHE, MAX_ENTRIES[PAGES_CACHE]);
  });
}

// ----------------------------------------------------------------------------
// Strategy: Stale-While-Revalidate
// ----------------------------------------------------------------------------
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
        trimCache(cacheName, MAX_ENTRIES[cacheName]);
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

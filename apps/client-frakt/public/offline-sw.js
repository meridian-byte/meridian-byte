const CACHE_NAME = 'static-cache-v2';
const OFFLINE_URL = '/offline.html';

// Cache static shell + offline fallback during install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll([OFFLINE_URL]);
      } catch (error) {
        console.error('Install cache error:', error);
      }
    })
  );
});

// Take control immediately
self.addEventListener('activate', () => {
  clients.claim();
});

// Runtime caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets (Next.js chunks, fonts, images)
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request)
            .then((response) => {
              const clone = response.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone));
              return response;
            })
            .catch(() => caches.match(OFFLINE_URL))
        );
      })
    );
    return;
  }

  // Stale-while-revalidate for HTML pages (e.g., /app/inbox)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => null);

        // Return cached immediately, or wait for fetch
        return cached || fetchPromise || caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Default: network first, fallback to cache, then offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match(OFFLINE_URL);
        return new Response('Offline', { status: 503 });
      })
  );
});

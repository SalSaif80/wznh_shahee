// Service Worker version
const CACHE_VERSION = 'v1';

// Cache names
const CACHE_STATIC_NAME = `static-${CACHE_VERSION}`;
const CACHE_DYNAMIC_NAME = `dynamic-${CACHE_VERSION}`;

// Files to cache
const staticAssets = [
  '/',
  'index.html',
  'style.css',
  'main.js',
  'bootstrap.min.css',
  'bootstrap.bundle.min.js',
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        return cache.addAll(staticAssets);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_DYNAMIC_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response if available
        }

        return fetch(event.request)
          .then(res => {
            return caches.open(CACHE_DYNAMIC_NAME)
              .then(cache => {
                cache.put(event.request.url, res.clone()); // Cache the fetched response for future use
                return res;
              });
          })
          .catch(error => {
            console.log('Error fetching data:', error);
            // You can return a fallback response here if needed
          });
      })
  );
});

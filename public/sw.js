const CACHE = 'static-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/src/main.tsx',
  '/src/index.css',
  '/src/styles.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(response => {
        if (response) return response;
        // Fallback SPA: si la ressource n'est pas trouvée et la requête est en navigation, servir index.html
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return fetch(e.request);
      })
    );
  }
});
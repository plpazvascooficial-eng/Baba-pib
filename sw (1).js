const CACHE = 'squadrank-v1';
const ASSETS = [
  '/Baba-pib/index.html',
  '/Baba-pib/entrar.html',
  '/Baba-pib/manifest.json',
  '/Baba-pib/icon-192.png',
  '/Baba-pib/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Para Firebase (dados em tempo real) — sempre vai para a rede
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

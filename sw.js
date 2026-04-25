const CACHE = 'arenapib-v2';
const ASSETS = [
  '/Baba-pib/',
  '/Baba-pib/index.html',
  '/Baba-pib/entrar.html',
  '/Baba-pib/manifest.json',
  '/Baba-pib/icon-192.png',
  '/Baba-pib/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
];

// Instala e faz cache de tudo imediatamente
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Remove caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Firebase realtime — sempre rede
  if (url.includes('firebaseio.com') || url.includes('firebase') && url.includes('database')) {
    return;
  }

  // Cache first para assets estáticos (HTML, CSS, fontes, Firebase SDK)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Salva no cache para próxima vez
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

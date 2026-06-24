/* Service worker minimal : met en cache les fichiers au fil de l'eau pour
   permettre une utilisation hors-ligne une fois l'app chargée. */
const CACHE = 'spanish-app-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // Précache la page d'accueil pour la navigation hors-ligne.
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/'])).catch(() => {}));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(async () => {
          // Hors-ligne : pour une navigation, on sert la page d'accueil en cache.
          if (req.mode === 'navigate') {
            const home = await cache.match('/');
            if (home) return home;
          }
          return cached;
        });
      return cached || network;
    })
  );
});

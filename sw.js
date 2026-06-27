const CACHE = 'camiverse-v1';
const ASSETS = ['/', '/index.html', '/manifest.json',
  '/music/01.wav','/music/02.wav','/music/03.wav','/music/04.wav','/music/05.wav',
  '/music/06.wav','/music/07.wav','/music/08.wav','/music/09.wav','/music/10.wav'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if(res.ok && e.request.url.startsWith(self.location.origin)){
        var clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});

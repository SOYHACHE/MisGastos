// 1. CAMBIA ESTE NOMBRE cada vez que subas una versión nueva a GitHub
const CACHE_NAME = 'gastos-v2'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalar y guardar archivos básicos
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Fuerza al nuevo SW a activarse de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Limpiar cachés antiguos automáticamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia: Intentar red primero para el HTML, si no hay red, usar caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

// 1. CADA VEZ QUE SUBAS ALGO A GITHUB, CAMBIA ESTE NÚMERO (v3, v4, v5...)
const CACHE_NAME = 'gastos-v3'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación: Guarda los archivos esenciales
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Borra versiones viejas de inmediato
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
    }).then(() => self.clients.claim()) // Toma el control de la página YA
  );
});

// Estrategia: Network First (Red primero) con actualización de caché dinámica
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Si la respuesta es buena, guardamos una copia actualizada en el caché
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red (offline), buscamos en el caché
        return caches.match(e.request);
      })
  );
});

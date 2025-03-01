const CACHE_NAME = 'chatai-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'icon-192x192.png', // Добавьте иконки, если они есть
  'icon-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Если ресурс есть в кэше - возвращаем его из кэша
        }
        return fetch(event.request); // Иначе - делаем запрос на сервер
      })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Удаляем старые кэши, которых нет в whitelist
          }
        })
      );
    })
  );
});

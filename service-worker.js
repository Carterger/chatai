const CACHE_NAME = 'v4'; // КРИТИЧЕСКИ ВАЖНО: Увеличивайте версию при каждом изменении!

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll([
          '/',          // Кэшируем корень (start_url)
          '/index.html',// и index.html (на всякий случай)
          '/styles.css',
          '/script.js',
          '/manifest.json',
          '/icons/icon-48x48.png',  // Кэшируем ВСЕ иконки
          '/icons/icon-72x72.png',
          '/icons/icon-96x96.png',
          '/icons/icon-144x144.png',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          'https://fonts.googleapis.com/icon?family=Material+Icons' // Кэшируем иконки
        ]);
      })
      .catch((error) => {
        console.error('Failed to cache:', error); // Обработка ошибок кэширования
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кэша, если есть
        if (response) {
          console.log('Found in cache:', event.request.url);
          return response;
        }

        // Если нет в кэше, делаем запрос к сети
        console.log('Network request for:', event.request.url);
        return fetch(event.request)
          .then(fetchResponse => { //Добавляем ресурс в кэш, после получения из сети
              if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic'){
                  return fetchResponse;
              }
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseToCache);
              });
              return fetchResponse;
          });
      })
      .catch(() => {
        // Обработка ошибок сети (офлайн-режим)
        return new Response('Нет сети. Подключитесь для работы с Gemini.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // КРИТИЧЕСКИ ВАЖНО: Список разрешённых кэшей

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Удаляем старые кэши
          }
        })
      );
    })
  );
});

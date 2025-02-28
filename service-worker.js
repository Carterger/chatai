const CACHE_NAME = 'v2';  // ИЗМЕНЕНО:  Увеличиваем версию кэша!  Меняйте при каждом обновлении!

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache:', CACHE_NAME); // Логируем открытие кэша
                return cache.addAll([
                    '/',  // Кэшируем корень (в соответствии с start_url)
                    '/index.html', //  Также кэшируем index.html (некоторые браузеры могут запрашивать его)
                    '/styles.css',
                    '/script.js',
                    '/manifest.json',
                    '/icons/icon-192x192.png',
                    '/icons/icon-512x512.png'
                ]);
            })
            .catch(err => { // Добавили обработку ошибок при кэшировании
                console.error("Cache addAll failed:", err);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Улучшенное сообщение об ошибке для офлайн-режима
                return new Response('Нет сети. Подключитесь для работы с Gemini.  Вы находитесь в офлайн-режиме.', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});

//  ДОБАВЛЕНО:  Обработчик события activate для очистки старых кэшей
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; //  ВАЖНО:  Список разрешенных кэшей.  ДОЛЖЕН СОВПАДАТЬ с CACHE_NAME!

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName); // Логируем удаление старого кэша
            return caches.delete(cacheName); // Удаляем старые кэши
          }
        })
      );
    })
  );
});

const staticCacheName = 'restaurant-reviews-v2';
const requests = [
    '/index.html',
    'js/main.js',
    'js/restaurant_info.js',
    'css/styles.css',
    'js/dbhelper.js',
    'data/restaurants.json'
];

// Cache all restaurants and images
for (let i = 1; i <= 10; i++) {
    requests.push(`/restaurant.html?id=${i}`);
    requests.push(`img/${i}.jpg`);
}

// Open a new cache during installation of service worker and cache all urls
self.addEventListener('install', function(event) { 
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(requests);
        })
    );
});

// Delete unwanted caches and leave the current one only
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-') &&
                   cacheName != staticCacheName;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
});

// Fetch the requested url online or search for it in cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
        }).catch(function(err) {
            return err;
        })
    );
});
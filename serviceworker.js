var CACHE_NAME = "clock-v9";
var CACHED_URLS = [
  "/MyClock/",
  "/MyClock/index.html",
  "/MyClock/style.css",
  "/MyClock/clock.js",
  "/MyClock/manifest.webmanifest",
  "/MyClock/images/clock-192.png",
  "/MyClock/images/clock-512.png",
  "/MyClock/images/Gear.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("clock")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log("Fetch request for:", event.request.url);
  event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request)
		})
  );
});

var CACHE_NAME = "clock-v7";
var CACHED_URLS = [
  "https://grandiose-luxurious-editor.glitch.me/",
  "https://grandiose-luxurious-editor.glitch.me/index.html",
  "https://grandiose-luxurious-editor.glitch.me/style.css",
  "https://grandiose-luxurious-editor.glitch.me/clock.js",
	"https://grandiose-luxurious-editor.glitch.me/manifest.webmanifest",
	"https://cdn.glitch.com/79b54f10-3d9b-4255-ab30-e83cdb7826c9%2Ficons-192.png?v=1609532002079",
	"https://cdn.glitch.com/79b54f10-3d9b-4255-ab30-e83cdb7826c9%2Ficons-512.png?v=1605836679175",
	"https://cdn.glitch.com/79b54f10-3d9b-4255-ab30-e83cdb7826c9%2Fgear-small.png?v=1606075428804"
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
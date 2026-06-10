const CACHE_NAME = "company-portal-v1";

// فایل‌هایی که باید cache بشن
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./logo.png",
  "./img1.png",
  "./img2.png",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
];

// 🔥 INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app files...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 🔥 ACTIVATE (پاک کردن کش‌های قدیمی)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🔥 FETCH (کنترل هوشمند کش + اینترنت)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        // اگر اینترنت نبود
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
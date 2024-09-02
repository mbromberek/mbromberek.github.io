/**
First version number is for new convention year
Second version number is for major updates
Third number is for minor and bug fix updates
Fourth number is for json schedule updates
*/
const VERSION = "v0.0.1.5";
const CACHE_NAME = `animeiowa_schedule_${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/css/schedule.css",
  "/js/schedule.js",
  "/scheduled.json",
  // "/data/schedule_ai2023.json",
  // "/media/AI_logo_small_2.png",
  "/media/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
      await clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch request for:", event.request.url);
  // when seeking an HTML page
  if (event.request.mode === "navigate") {
    // Return to the index.html page
    event.respondWith(caches.match("/"));
    return;
  }

  // For every other request type
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // Respond with a HTTP 404 response status.
      return new Response(null, { status: 404 });
    })(),
  );
});

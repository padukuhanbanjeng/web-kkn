const cacheName = "web";
const staticAssets = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.js",
  "/bootstrap/bootstrap.min.css",
  "/slick/slick.css",
  "/animate/animate.css",
  "/venobox/venobox.css",
  "/themify-icons/themify-icons.css",
  "/jQuery/jquery.min.js",
  "/bootstrap/bootstrap.min.js",
  "/slick/slick.min.js",
  "/venobox/venobox.min.js",
  "/filterizr/jquery.filterizr.min.js",
];

self.addEventListener("install", async (e) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}

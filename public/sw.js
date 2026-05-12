const CACHE = "perfect-home-v1"
const ASSETS = [
  "/",
  "/analyze",
  "/how-it-works",
  "/pricing",
  "/offline",
]

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
})

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
})

// Fetch
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API calls: network-only
  if (url.pathname.startsWith("/api/")) {
    return
  }

  // Static assets: cache-first
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
        return res
      }))
    )
    return
  }

  // Pages: network-first, fallback to cache, then offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
        return res
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/offline"))
      )
  )
})

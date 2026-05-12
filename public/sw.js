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

  if (url.pathname.startsWith("/api/")) {
    return
  }

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

// Push notification
self.addEventListener("push", (event) => {
  let data = { title: "Perfect Home", body: "Your diagnosis is ready!" }
  try {
    if (event.data) data = JSON.parse(event.data.text())
  } catch {
    data.body = event.data?.text() ?? data.body
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url ?? "/dashboard" },
    })
  )
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? "/dashboard"
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

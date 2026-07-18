self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("yapgator-")).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      .then(clients => {
        for (const client of clients) client.navigate(client.url);
      })
  );
});

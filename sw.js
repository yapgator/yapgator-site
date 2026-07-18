// Cleanup worker build v32: deliberately caches no HTML, feeds, or APK files.
self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("yapgator-")).map(key => caches.delete(key))
      ))
      .then(() => self.registration.unregister())
  );
});

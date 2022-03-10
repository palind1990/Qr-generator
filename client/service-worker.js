const Qr_generator = "Qr-generator";
const assets = [
  "/",
  "/index.html",
  "style.css",
  "/js/service.js",
  "/js/jquery.js",
  "/js/recorder.js",
  "/js/qrReader.js",
  "/js/qrcode.js",
  "/js/bootstrap.js",
  "/js/printer.png",
  "original.jpg",
];

self.addEventListener('install', (installEvent) => {
    console.log('Service worker installed: ', installEvent);
    installEvent.waitUntil(
        caches.open(Qr_generator).then(cache => {
          cache.addAll(assets);
        })
      );
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated: ', event);

});

self.addEventListener('fetch', (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((res) => {
          return res || fetch(fetchEvent.request);
        })
      );
});

self.addEventListener('notificationclick', event => {
    console.log("Notification clicked.");
});

self.addEventListener('push', event => {
  console.log("Notification was pushed from the push service: ", event.data.text());

  event.waitUntil(
      self.registration.showNotification(event.data.text())
  );
});
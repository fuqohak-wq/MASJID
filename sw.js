// ======================================================
// COMBINED SERVICE WORKER (PAV TRACKER + WEBPUSHR)
// FULL VERSION - TINGGAL COPAS TOTAL
// ======================================================

// 1. Gabungkan script Webpushr secara otomatis dari cloud mereka
importScripts('https://cdn.webpushr.com/sw-server.js');

// 2. Event saat Service Worker Pertama Kali Diinstal
self.addEventListener('install', (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

// 3. Event saat Service Worker Diaktifkan
self.addEventListener('activate', (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(self.clients.claim());
});

// 4. Logika Menangkap Sinyal Kebangkitan Tracking Otomatis
self.addEventListener('push', (event) => {
  console.log("Service Worker: Menerima sinyal Push");

  // Perintah otomatis membangunkan halaman utama PWA untuk langsung melacak GPS
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].postMessage({ command: "AUTO_START_TRACKING" });
      }
    })
  );
});

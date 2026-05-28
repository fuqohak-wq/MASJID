// ======================================================
// COMBINED SERVICE WORKER (PAV TRACKER + WEBPUSHR + AUDIO)
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

// 4. Logika Menangkap Sinyal Kebangkitan Tracking Otomatis & Suara
self.addEventListener('push', (event) => {
  console.log("Service Worker: Menerima sinyal Push");

  // Opsi getaran berpola greget (bisa bervariasi tergantung jenis HP)
  const patternVibrate = [500, 110, 500, 110, 450, 110, 200, 110, 1000, 400, 1000];

  // Perintah otomatis membangunkan halaman utama PWA untuk langsung melacak GPS
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        // Jika PWA sedang terbuka/terselip di background, bangunkan fiturnya
        clientList[0].postMessage({ command: "AUTO_START_TRACKING", play_adzan: true });
      }
    })
  );
});

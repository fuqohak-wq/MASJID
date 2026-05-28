// ======================================================
// SERVICE WORKER - PAV JAMAAH TRACKER PRO
// ======================================================

// 1. Event saat Service Worker Pertama Kali Diinstal
self.addEventListener('install', (event) => {
  console.log("Service Worker: Installed");
  // Paksa Service Worker yang baru untuk langsung aktif tanpa menunggu tab ditutup
  self.skipWaiting();
});

// 2. Event saat Service Worker Diaktifkan
self.addEventListener('activate', (event) => {
  console.log("Service Worker: Activated");
  // Ambil kendali penuh atas halaman webapp segera setelah aktif
  event.waitUntil(self.clients.claim());
});

// ======================================================
// PUSH EVENT: TRIGER GAIB SAAT WAKTU ADZAN TIBA
// ======================================================
// Bagian ini yang akan menangkap sinyal "PING" adzan dari server / Google Apps Script
self.addEventListener('push', (event) => {
  console.log("Service Worker: Menerima sinyal Push Adzan");

  let data = {
    title: "🕌 Waktu Shalat Tiba!",
    body: "Sistem otomatis mengunci lokasi jamaah Anda. Silakan bersiap ke masjid."
  };

  // Jika server mengirimkan data teks tambahan (payload JSON)
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'icon-192.png',       // Pastikan Anda punya file icon-192.png di folder project
    badge: 'icon-192.png',      // Icon kecil di status bar HP Android
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 200, 400, 500], // Pola getaran HP
    requireInteraction: true,   // Notifikasi tidak akan hilang sampai di-swipe atau diklik user
    data: {
      url: '/' // Membuka webapp saat notifikasi diklik
    }
  };

  event.waitUntil(
    // Tampilkan notifikasi di layar HP meskipun dalam kondisi terkunci
    self.registration.showNotification(data.title, options).then(() => {
      // PERINTAH OTOMATIS: Membangunkan halaman utama webapp untuk langsung start tracking GPS
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          // Jika aplikasi sedang terbuka di background, kirim perintah start ke HTML
          clientList[0].postMessage({ command: "AUTO_START_TRACKING" });
        }
      });
    })
  );
});

// 3. Event ketika Notifikasi diklik oleh User
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Tutup notifikasi

  // Buka kembali aplikasi webapp Anda secara otomatis
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

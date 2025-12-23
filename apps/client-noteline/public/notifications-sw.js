self.addEventListener('install', () => {
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', () => {
  clients.claim(); // take control of uncontrolled pages
});

// Listen for push events
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'No body provided',
    icon: data.icon || '/images/brand/icon/default.png',
    badge: data.badge || '/images/brand/icon/default.png',
    data: data.data, // any extra metadata
    actions: data.actions || [], // Ensure actions is an array
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// (Optional) Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // If a tab is already open, focus it
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Otherwise, open a new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

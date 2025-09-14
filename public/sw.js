const CACHE_NAME = 'baby-daily-notes-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Only cache static assets, not dynamic content
const urlsToCache = [
  '/manifest.json',
  '/assets/images/icons/android/android-launchericon-192-192.png',
  '/assets/images/icons/android/android-launchericon-512-512.png',
  '/assets/images/icons/ios/180.png',
  '/assets/images/icons/ios/1024.png',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Opened static cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // For static assets, return cached version if available
        if (cachedResponse && (request.url.includes('/assets/') || request.url.includes('/manifest.json'))) {
          return cachedResponse;
        }
        
        // For dynamic content (HTML, API calls), always try network first
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              
              // Cache static assets
              if (request.url.includes('/assets/') || request.url.includes('/manifest.json')) {
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
            }
            
            return response;
          })
          .catch(() => {
            // If network fails and it's a document request, show cached version
            if (request.destination === 'document') {
              return caches.match('/');
            }
            return cachedResponse;
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync offline data when connection is restored
  return new Promise((resolve) => {
    // This would sync any offline data with the server
    console.log('Background sync triggered');
    resolve();
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/icons/android/android-launchericon-192-192.png',
      badge: '/assets/images/icons/android/android-launchericon-48-48.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/assets/images/icons/android/android-launchericon-48-48.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/icons/android/android-launchericon-48-48.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

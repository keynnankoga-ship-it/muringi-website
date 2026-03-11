importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

/* =========================
   FETCH CONFIG FROM SERVER
========================= */
self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch('/firebase-config')
      .then(res => res.json())
      .then(config => {
        firebase.initializeApp({
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId
        });

        const messaging = firebase.messaging();

        messaging.onBackgroundMessage(function(payload) {
          self.registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: "/icon.png"
          });
        });
      })
      .catch(err => console.error("Failed to fetch Firebase config:", err))
  );
});
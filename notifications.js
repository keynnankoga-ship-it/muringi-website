/* =========================
   NOTIFICATIONS (FIREBASE)
========================= */

async function initNotifications() {
  try {
    // Fetch Firebase config from server (loaded from .env)
    const res = await fetch("/firebase-config");
    if (!res.ok) throw new Error("Failed to fetch Firebase config");

    const config = await res.json();

    // Initialize Firebase app
    firebase.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });

    const messaging = firebase.messaging();

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // Get FCM token
    const token = await messaging.getToken({ vapidKey: config.vapidKey });
    console.log("Notification Token:", token);

    // You can now send this token to your server to store and send push notifications

  } catch (err) {
    console.error("Failed to initialize notifications:", err);
  }
}

// Initialize notifications on page load
initNotifications();
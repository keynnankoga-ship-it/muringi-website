importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyB1zmsXUaKHiFjnpUg1ddanoqaRSooI4aI",
authDomain: "muringi-website.firebaseapp.com",
projectId: "muringi-website",
messagingSenderId: "672701127341",
appId: "1:672701127341:web:29174119759439bbba8424"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){

self.registration.showNotification(payload.notification.title,{
body:payload.notification.body,
icon:"/icon.png"
});

});
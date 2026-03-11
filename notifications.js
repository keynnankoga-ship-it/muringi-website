const firebaseConfig = {
apiKey: "AIzaSyB1zmsXUaKHiFjnpUg1ddanoqaRSooI4aI",
authDomain: "muringi-website.firebaseapp.com",
projectId: "muringi-website",
messagingSenderId: "672701127341",
appId: "1:672701127341:web:29174119759439bbba8424"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

async function initNotifications(){

const permission = await Notification.requestPermission();

if(permission !== "granted") return;

const token = await messaging.getToken({
vapidKey:"BHRq_0wSJWB3JfS8P77hzDQ7kPED3wQst2cuOy--h9oUiejrDb7l-iLXDXa5EbvLhMOXd6m9QP6xX7FW6RFpmyM"
});

console.log("Notification Token:",token);

}

initNotifications();
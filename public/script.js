// ---------------------------
// Date Ideas Section
// ---------------------------
const dateContainer = document.getElementById("dateIdeas");

async function loadDateIdeas() {
  try {
    const res = await fetch("/dateIdeas");
    const ideas = await res.json();

    dateContainer.innerHTML = "";

    ideas.forEach(idea => {
      const div = document.createElement("div");
      div.className = "date-card";
      div.innerHTML = `
        <h3>${idea.title || ""}</h3>
        <p>${idea.description || ""}</p>
        <input type="file" onchange="uploadPhoto(event,'${idea._id}')">
        <div class="date-photos" id="photos-${idea._id}"></div>
      `;
      dateContainer.appendChild(div);

      const photoDiv = document.getElementById("photos-" + idea._id);

      if (idea.photos && idea.photos.length > 0) {
        idea.photos.forEach(photo => {
          const img = document.createElement("img");
          img.src = photo;
          photoDiv.appendChild(img);
        });
      }
    });
  } catch (err) {
    console.error("Error loading date ideas:", err);
  }
}

async function uploadPhoto(event, id) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file);

  await fetch("/uploadDatePhoto/" + id, {
    method: "POST",
    body: formData
  });

  loadDateIdeas();
}

// Initialize date ideas
loadDateIdeas();


// ---------------------------
// Music / Playlist Section
// ---------------------------
async function loadSongs() {
  try {
    const res = await fetch("/songs");
    const songs = await res.json();

    const playlist = document.getElementById("playlist");
    playlist.innerHTML = "";

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "song";
      div.innerHTML = `
        <img src="${song.cover || ""}" width="100%" alt="${song.title || ""}">
        <h3>${song.title || ""}</h3>
        <p>${song.artist || ""}</p>
        <p>${song.reason || ""}</p>
        <audio controls>
          <source src="${song.file}" type="audio/mp3">
        </audio>
      `;
      playlist.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading songs:", err);
  }
}

// Initialize songs
loadSongs();


// ---------------------------
// Daily Affirmation Section
// ---------------------------
async function showDailyAffirmation() {
  try {
    const response = await fetch('data/affirmations.json');
    const affirmations = await response.json();

    const today = new Date();
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const month = monthNames[today.getMonth()];
    const day = today.getDate();

    const affirmation = affirmations[month][day] || "Have a wonderful day!";
    document.getElementById('affirmation-text').innerText = affirmation;
  } catch (err) {
    console.error("Error loading affirmation:", err);
    document.getElementById('affirmation-text').innerText = "Have a wonderful day!";
  }
}

// Initialize daily affirmation
showDailyAffirmation();


// ---------------------------
// Push Notifications Setup
// ---------------------------

// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyB1zmsXUaKHiFjnpUg1ddanoqaRSooI4aI",
  authDomain: "muringi-website.firebaseapp.com",
  projectId: "muringi-website",
  messagingSenderId: "672701127341",
  appId: "1:672701127341:web:29174119759439bbba8424"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Request permission for notifications
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    messaging.getToken({ vapidKey: 'BPzA6p7pueH8JWNpy5RDhPgbG3npPjg8fKNVVFm_QRdm5_trSUZvHaGFcjug4ZB3jRT6P1DK__6v9mvI2enM6H0' }).then(token => {
      console.log("FCM Token:", token);
      // Send token to your backend to schedule notifications
    });
  }
});

// Listen for foreground notifications
messaging.onMessage(payload => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || '/assets/icon.png'
  });
});

// /public/script.js
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1zmsXUaKHiFjnpUg1ddanoqaRSooI4aI",
  authDomain: "muringi-website.firebaseapp.com",
  projectId: "muringi-website",
  messagingSenderId: "672701127341",
  appId: "1:672701127341:web:29174119759439bbba8424"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Request permission and send token to server
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    const token = await messaging.getToken({ vapidKey: 'BPzA6p7pueH8JWNpy5RDhPgbG3npPjg8fKNVVFm_QRdm5_trSUZvHaGFcjug4ZB3jRT6P1DK__6v9mvI2enM6H0' });
    console.log('FCM Token:', token);

    // Send token to backend
    await fetch('http://localhost:5000/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  } else {
    console.log('Notification permission denied.');
  }
}

requestNotificationPermission();

// Optional: display today's affirmation in page
async function loadDailyAffirmation() {
  const res = await fetch('../data/affirmations.json');
  const affirmations = await res.json();
  const today = new Date().toISOString().split('T')[0];
  const todayAffirmation = affirmations.find(a => a.date === today);
  document.getElementById('affirmation').textContent =
    todayAffirmation ? todayAffirmation.affirmation : "Stay positive today!";
}

loadDailyAffirmation();
// /public/script.js

// ---------------------------
// Backend URL
// ---------------------------
const BACKEND_URL = "https://hera-9pxh.onrender.com"; // Replace with your Render backend

// ---------------------------
// Date Ideas Section
// ---------------------------
const dateContainer = document.getElementById("dateIdeas");
const dateForm = document.getElementById("dateUploadForm");

// Load all date ideas from backend
async function loadDateIdeas() {
  try {
    const res = await fetch(`${BACKEND_URL}/dateIdeas`);
    const ideas = await res.json();

    dateContainer.innerHTML = "";

    ideas.forEach(idea => {
      const div = document.createElement("div");
      div.className = "date-card";

      // Display title, description, and upload input for multiple photos
      div.innerHTML = `
        <h3>${idea.title || ""}</h3>
        <p>${idea.description || ""}</p>
        <input type="file" multiple onchange="uploadPhotos(event,'${idea._id}')">
        <div class="date-photos" id="photos-${idea._id}"></div>
      `;
      dateContainer.appendChild(div);

      // Display all uploaded photos
      const photoDiv = document.getElementById("photos-" + idea._id);
      if (idea.photos && idea.photos.length > 0) {
        idea.photos.forEach(photo => {
          const img = document.createElement("img");
          img.src = photo.startsWith("http") ? photo : `${BACKEND_URL}${photo}`;
          img.style.width = "100%";
          img.style.marginTop = "0.5rem";
          img.style.borderRadius = "10px";
          photoDiv.appendChild(img);
        });
      }
    });
  } catch (err) {
    console.error("Error loading date ideas:", err);
  }
}

// Upload multiple photos for a single date idea
async function uploadPhotos(event, id) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("photos", file));

  try {
    const res = await fetch(`${BACKEND_URL}/uploadDatePhotos/${id}`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    loadDateIdeas(); // Refresh displayed photos
  } catch (err) {
    console.error("Error uploading photos:", err);
  }
}

// Handle new date idea creation
dateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(dateForm);

  try {
    const res = await fetch(`${BACKEND_URL}/upload-date`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    dateForm.reset();
    loadDateIdeas();
  } catch (err) {
    console.error("Error uploading date idea:", err);
  }
});

// Initialize date ideas
loadDateIdeas();

// ---------------------------
// Music / Playlist Section
// ---------------------------
async function loadSongs() {
  try {
    const res = await fetch(`${BACKEND_URL}/songs`);
    const songs = await res.json();

    const playlist = document.getElementById("playlist");
    playlist.innerHTML = "";

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "song";
      div.innerHTML = `
        <img src="${BACKEND_URL}${song.cover || ""}" width="100%" alt="${song.title || ""}">
        <h3>${song.title || ""}</h3>
        <p>${song.artist || ""}</p>
        <p>${song.reason || ""}</p>
        <audio controls>
          <source src="${BACKEND_URL}${song.file}" type="audio/mp3">
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

    const affirmation = affirmations[month] && affirmations[month][day] 
      ? affirmations[month][day] 
      : "Have a wonderful day!";

    document.getElementById('affirmation-text').innerText = affirmation;
  } catch (err) {
    console.error("Error loading affirmation:", err);
    document.getElementById('affirmation-text').innerText = "Have a wonderful day!";
  }
}

// Initialize daily affirmation
showDailyAffirmation();

// ---------------------------
// Firebase Push Notifications
// ---------------------------
const firebaseConfig = {
  apiKey: "AIzaSyB1zmsXUaKHiFjnpUg1ddanoqaRSooI4aI",
  authDomain: "muringi-website.firebaseapp.com",
  projectId: "muringi-website",
  messagingSenderId: "672701127341",
  appId: "1:672701127341:web:29174119759439bbba8424"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    const token = await messaging.getToken({
      vapidKey: 'BPzA6p7pueH8JWNpy5RDhPgbG3npPjg8fKNVVFm_QRdm5_trSUZvHaGFcjug4ZB3jRT6P1DK__6v9mvI2enM6H0'
    });
    console.log('FCM Token:', token);

    await fetch(`${BACKEND_URL}/save-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  } else {
    console.log('Notification permission denied.');
  }
}

requestNotificationPermission();

messaging.onMessage(payload => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || '/assets/icon.png'
  });
});
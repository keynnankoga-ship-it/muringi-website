const BACKEND_URL = "https://hera-9pxh.onrender.com";

/* ---------------------------
   Date Ideas
--------------------------- */
const dateContainer = document.getElementById("dateIdeas");
const dateForm = document.getElementById("dateUploadForm");

async function loadDateIdeas() {
  try {
    const res = await fetch(`${BACKEND_URL}/dateIdeas`);
    const ideas = await res.json();
    dateContainer.innerHTML = "";

    ideas.forEach(idea => {
      const div = document.createElement("div");
      div.className = "date-card";
      div.innerHTML = `
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
        <input type="file" multiple onchange="uploadPhotos(event,'${idea._id}')">
        <div class="date-photos" id="photos-${idea._id}"></div>
      `;
      dateContainer.appendChild(div);

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
    console.error(err);
  }
}

async function uploadPhotos(event, id) {
  const files = event.target.files;
  if (!files) return;
  const formData = new FormData();
  Array.from(files).forEach(f => formData.append("photos", f));

  try {
    await fetch(`${BACKEND_URL}/uploadDatePhotos/${id}`, { method: "POST", body: formData });
    loadDateIdeas();
  } catch (err) { console.error(err); }
}

dateForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(dateForm);
  try {
    await fetch(`${BACKEND_URL}/upload-date`, { method: "POST", body: data });
    dateForm.reset();
    loadDateIdeas();
  } catch (err) { console.error(err); }
});

loadDateIdeas();

/* ---------------------------
   Songs
--------------------------- */
async function loadSongs() {
  const res = await fetch(`${BACKEND_URL}/songs`);
  const songs = await res.json();

  const playlist = document.getElementById("playlist");
  playlist.innerHTML = "";

  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${song.cover.startsWith('http') ? song.cover : BACKEND_URL + song.cover}" width="100%" alt="${song.title}">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <p>${song.reason}</p>
      <audio controls>
        <source src="${song.file.startsWith('http') ? song.file : BACKEND_URL + song.file}" type="audio/mp3">
      </audio>
    `;
    playlist.appendChild(div);
  });
}

loadSongs();

/* ---------------------------
   Song of the Day
--------------------------- */
const dailySongContainer = document.getElementById("dailySong");

async function loadSongOfDay() {
  try {
    const res = await fetch(`${BACKEND_URL}/song-of-the-day`);
    const song = await res.json();
    if (!song || !song.title) return;

    dailySongContainer.innerHTML = `
      <div class="song-card">
        <img src="${song.cover.startsWith('http') ? song.cover : BACKEND_URL + song.cover}" class="song-cover">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <p>${song.reason}</p>
        <audio controls src="${song.file.startsWith('http') ? song.file : BACKEND_URL + song.file}"></audio>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

loadSongOfDay();

/* ---------------------------
   Daily Affirmation
--------------------------- */
async function showDailyAffirmation() {
  try {
    const res = await fetch("data/affirmations.json");
    const affirmations = await res.json();
    const index = Math.floor(Math.random() * affirmations.length);
    document.getElementById("affirmation-text").innerText = affirmations[index];
  } catch (err) {
    console.error(err);
    document.getElementById("affirmation-text").innerText = "Have a wonderful day!";
  }
}

showDailyAffirmation();

/* ---------------------------
   Private Gallery
--------------------------- */
const galleryForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");
const photoGallery = document.getElementById("photoGallery");

galleryForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const file = photoInput.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("photo", file);

  try {
    await fetch(`${BACKEND_URL}/upload-gallery`, { method: "POST", body: fd });
    loadGallery();
  } catch (err) {
    console.error(err);
  }
});

async function loadGallery() {
  try {
    const res = await fetch(`${BACKEND_URL}/gallery`);
    const photos = await res.json();
    photoGallery.innerHTML = "";
    photos.forEach(p => {
      const img = document.createElement("img");
      img.src = p.url;
      img.style.width = "150px";
      img.style.margin = "10px";
      photoGallery.appendChild(img);
    });
  } catch (err) {
    console.error(err);
  }
}

loadGallery();
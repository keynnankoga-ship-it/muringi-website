// Simple client-side password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // load from .env

function checkPassword() {
  const pass = document.getElementById("admin-password").value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
  } else {
    document.getElementById("login-error").innerText = "Incorrect password!";
  }
}

// --- Add Date Idea ---
async function addDateIdea() {
  const title = document.getElementById("date-title").value;
  const imageFile = document.getElementById("date-image").files[0];
  if (!title || !imageFile) return alert("Fill all fields!");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", imageFile);

  const res = await fetch("/upload-date", { method: "POST", body: formData });
  const data = await res.json();
  alert("Date idea added!");
}

// --- Add Song ---
async function addSong() {
  const title = document.getElementById("song-title").value;
  const artist = document.getElementById("song-artist").value;
  const reason = document.getElementById("song-reason").value;
  const file = document.getElementById("song-file").files[0];
  const cover = document.getElementById("song-cover").files[0];
  if (!title || !artist || !reason || !file || !cover) return alert("Fill all fields!");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("reason", reason);
  formData.append("file", file);
  formData.append("cover", cover);

  const res = await fetch("/upload-song", { method: "POST", body: formData });
  const data = await res.json();
  alert("Song added!");
}

// --- Upload Gallery Photo ---
async function uploadGalleryPhoto() {
  const file = document.getElementById("gallery-photo").files[0];
  if (!file) return alert("Choose a file!");

  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch("/upload-gallery", { method: "POST", body: formData });
  const data = await res.json();
  alert("Gallery photo uploaded!");
}
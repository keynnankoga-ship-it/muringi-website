/* =========================
   ADMIN.JS
========================= */

const loginForm = document.getElementById("adminLoginForm");
const adminContent = document.getElementById("adminContent");

if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value;

    try {
      const res = await fetch("/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (data.success) {
        loginForm.parentElement.style.display = "none";
        adminContent.style.display = "block";
        loadAdminData();
      } else {
        alert("Login failed");
      }

    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  });
}

/* ---------- LOAD ADMIN DATA ---------- */
async function loadAdminData() {
  loadAdminSongs();
  loadAdminDates();
  loadAdminGallery();
}

/* ---------- SONGS ---------- */
async function loadAdminSongs() {
  const container = document.getElementById("adminSongs");
  if (!container) return;

  try {
    const res = await fetch("/songs");
    const songs = await res.json();
    container.innerHTML = "";

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "song-item";
      div.innerHTML = `
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <button class="delete-btn" data-id="${song._id}">Delete</button>
      `;
      container.appendChild(div);
    });

    // DELETE SONG
    container.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`/admin/song/${id}`, { method: "DELETE" });
        loadAdminSongs();
      });
    });

  } catch (err) {
    console.error(err);
  }
}

/* ---------- DATE IDEAS ---------- */
async function loadAdminDates() {
  const container = document.getElementById("adminDates");
  if (!container) return;

  try {
    const res = await fetch("/dateIdeas");
    const dates = await res.json();
    container.innerHTML = "";

    dates.forEach(date => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <h4>${date.title}</h4>
        <button class="delete-btn" data-id="${date._id}">Delete</button>
      `;
      container.appendChild(div);
    });

    // DELETE DATE
    container.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`/admin/date/${id}`, { method: "DELETE" });
        loadAdminDates();
      });
    });

  } catch (err) {
    console.error(err);
  }
}

/* ---------- GALLERY ---------- */
async function loadAdminGallery() {
  const container = document.getElementById("adminGallery");
  if (!container) return;

  try {
    const res = await fetch("/gallery");
    const photos = await res.json();
    container.innerHTML = "";

    photos.forEach(photo => {
      const div = document.createElement("div");
      div.className = "gallery-item";
      div.innerHTML = `
        <img src="${photo.url}" width="100">
        <button class="delete-btn" data-id="${photo._id}">Delete</button>
      `;
      container.appendChild(div);
    });

    // DELETE PHOTO
    container.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`/admin/gallery/${id}`, { method: "DELETE" });
        loadAdminGallery();
      });
    });

  } catch (err) {
    console.error(err);
  }
}
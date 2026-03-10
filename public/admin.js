const BACKEND_URL = "https://hera-9pxh.onrender.com";

/* ---------------------------
   Admin Login
--------------------------- */
const adminForm = document.getElementById("adminLoginForm");
const adminContainer = document.getElementById("adminContent");
const adminPasswordInput = document.getElementById("adminPassword");

adminForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pass = adminPasswordInput.value;

  try {
    const res = await fetch(`${BACKEND_URL}/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();

    if (data.success) {
      adminForm.style.display = "none";
      adminContainer.style.display = "block";

      // Load all admin content
      loadAdminDateIdeas();
      loadAdminSongs();
      loadAdminGallery();
    } else {
      alert("Incorrect password!");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong during login!");
  }
});

/* ---------------------------
   Helper Function: Delete Item
--------------------------- */
async function deleteItem(url, reloadFunc) {
  try {
    await fetch(url, { method: "DELETE" });
    reloadFunc();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete item!");
  }
}

/* ---------------------------
   Admin Date Ideas
--------------------------- */
const adminDateContainer = document.getElementById("adminDateIdeas");
const addDateIdeaForm = document.getElementById("addDateIdeaForm");

addDateIdeaForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    title: form.title.value,
    description: form.description.value
  };
  try {
    await fetch(`${BACKEND_URL}/dateIdeas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    form.reset();
    loadAdminDateIdeas();
  } catch (err) {
    console.error("Add date idea error:", err);
  }
});

async function loadAdminDateIdeas() {
  const res = await fetch(`${BACKEND_URL}/dateIdeas`);
  const ideas = await res.json();
  adminDateContainer.innerHTML = "";

  ideas.forEach(idea => {
    const div = document.createElement("div");
    div.className = "item date-card";
    div.innerHTML = `
      <h3>${idea.title}</h3>
      <p>${idea.description}</p>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.addEventListener("click", () => deleteItem(`${BACKEND_URL}/delete-date/${idea._id}`, loadAdminDateIdeas));
    div.appendChild(delBtn);

    adminDateContainer.appendChild(div);
  });
}

/* ---------------------------
   Admin Songs
--------------------------- */
const adminSongContainer = document.getElementById("adminSongs");
const addSongForm = document.getElementById("addSongForm");

addSongForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    await fetch(`${BACKEND_URL}/songs`, { method: "POST", body: formData });
    e.target.reset();
    loadAdminSongs();
  } catch (err) {
    console.error("Add song error:", err);
  }
});

async function loadAdminSongs() {
  const res = await fetch(`${BACKEND_URL}/songs`);
  const songs = await res.json();
  adminSongContainer.innerHTML = "";

  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "item song";

    div.innerHTML = `
      <p>${song.title} - ${song.artist}</p>
      <audio controls class="song-item">
        <source src="${song.url.startsWith("http") ? song.url : BACKEND_URL + song.url}" type="audio/mpeg">
      </audio>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.addEventListener("click", () => deleteItem(`${BACKEND_URL}/delete-song/${song._id}`, loadAdminSongs));

    div.appendChild(delBtn);
    adminSongContainer.appendChild(div);
  });
}

/* ---------------------------
   Admin Gallery
--------------------------- */
const adminGalleryContainer = document.getElementById("adminGallery");
const addGalleryForm = document.getElementById("addGalleryForm");

addGalleryForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    await fetch(`${BACKEND_URL}/gallery`, { method: "POST", body: formData });
    e.target.reset();
    loadAdminGallery();
  } catch (err) {
    console.error("Add gallery error:", err);
  }
});

async function loadAdminGallery() {
  const res = await fetch(`${BACKEND_URL}/gallery`);
  const photos = await res.json();
  adminGalleryContainer.innerHTML = "";

  photos.forEach(photo => {
    const div = document.createElement("div");
    div.className = "item";

    const img = document.createElement("img");
    img.src = photo.url.startsWith("http") ? photo.url : BACKEND_URL + photo.url;
    img.className = "gallery-item";

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.addEventListener("click", () => deleteItem(`${BACKEND_URL}/delete-gallery/${photo._id}`, loadAdminGallery));

    div.appendChild(img);
    div.appendChild(delBtn);
    adminGalleryContainer.appendChild(div);
  });
}
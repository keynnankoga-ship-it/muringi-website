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
   Admin Date Ideas
--------------------------- */
const adminDateContainer = document.getElementById("adminDateIdeas");
const addDateForm = document.getElementById("addDateForm");

async function loadAdminDateIdeas() {
  const res = await fetch(`${BACKEND_URL}/dateIdeas`);
  const ideas = await res.json();
  adminDateContainer.innerHTML = "";

  ideas.forEach(idea => {
    const div = document.createElement("div");
    div.className = "date-card";
    div.innerHTML = `
      <h3>${idea.title}</h3>
      <p>${idea.description}</p>
      <div class="date-photos" id="admin-photos-${idea._id}"></div>
    `;
    adminDateContainer.appendChild(div);

    // Delete Date Idea
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete Date Idea";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/admin/date/${idea._id}`, { method: "DELETE" });
      loadAdminDateIdeas();
    });
    div.appendChild(delBtn);

    // Photos
    const photoDiv = document.getElementById(`admin-photos-${idea._id}`);
    if (idea.photos && idea.photos.length > 0) {
      idea.photos.forEach(p => {
        const img = document.createElement("img");
        img.src = p.startsWith("http") ? p : BACKEND_URL + p;
        img.style.width = "70px";
        img.style.margin = "2px";
        img.style.borderRadius = "5px";
        photoDiv.appendChild(img);
      });
    }
  });
}

// Add Date Idea
addDateForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addDateForm);
  try {
    const res = await fetch(`${BACKEND_URL}/admin/date`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      addDateForm.reset();
      loadAdminDateIdeas();
    } else {
      alert("Failed to add date idea");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding date idea");
  }
});

/* ---------------------------
   Admin Songs
--------------------------- */
const adminSongContainer = document.getElementById("adminSongs");
const addSongForm = document.getElementById("addSongForm");

async function loadAdminSongs() {
  const res = await fetch(`${BACKEND_URL}/songs`);
  const songs = await res.json();
  adminSongContainer.innerHTML = "";

  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${song.cover.startsWith("http") ? song.cover : BACKEND_URL + song.cover}" width="100%">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <p>${song.reason}</p>
      <audio controls>
        <source src="${song.file.startsWith("http") ? song.file : BACKEND_URL + song.file}" type="audio/mpeg">
      </audio>
    `;
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete Song";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/admin/song/${song._id}`, { method: "DELETE" });
      loadAdminSongs();
    });
    div.appendChild(delBtn);
    adminSongContainer.appendChild(div);
  });
}

// Add Song
addSongForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addSongForm);
  try {
    const res = await fetch(`${BACKEND_URL}/admin/song`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      addSongForm.reset();
      loadAdminSongs();
    } else {
      alert("Failed to add song");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding song");
  }
});

/* ---------------------------
   Admin Private Gallery
--------------------------- */
const adminGalleryContainer = document.getElementById("adminGallery");
const addGalleryForm = document.getElementById("addGalleryForm");

async function loadAdminGallery() {
  const res = await fetch(`${BACKEND_URL}/gallery`);
  const photos = await res.json();
  adminGalleryContainer.innerHTML = "";

  photos.forEach(p => {
    const div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.position = "relative";
    div.style.margin = "5px";

    const img = document.createElement("img");
    img.src = p.url.startsWith("http") ? p.url : BACKEND_URL + p.url;
    img.style.width = "100px";
    img.style.borderRadius = "5px";

    const delBtn = document.createElement("button");
    delBtn.innerText = "X";
    delBtn.className = "delete-btn";
    delBtn.style.position = "absolute";
    delBtn.style.top = "0";
    delBtn.style.right = "0";
    delBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/admin/gallery/${p._id}`, { method: "DELETE" });
      loadAdminGallery();
    });

    div.appendChild(img);
    div.appendChild(delBtn);
    adminGalleryContainer.appendChild(div);
  });
}

// Add Private Gallery Photo
addGalleryForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addGalleryForm);
  try {
    const res = await fetch(`${BACKEND_URL}/admin/gallery`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      addGalleryForm.reset();
      loadAdminGallery();
    } else {
      alert("Failed to add photo");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding photo");
  }
});
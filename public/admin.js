const BACKEND_URL = "https://hera-9pxh.onrender.com";

/* ---------------------------
   Admin Login
--------------------------- */
const adminForm = document.getElementById("adminLoginForm");
const adminContainer = document.getElementById("adminContent");
const adminPasswordInput = document.getElementById("adminPassword");

adminForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = adminPasswordInput.value;
  // Replace "koyoadmin" with your real admin password
  if (pass === "koyoadmin") {
    adminForm.style.display = "none";
    adminContainer.style.display = "block";
    loadAdminDateIdeas();
    loadAdminSongs();
    loadAdminGallery();
  } else {
    alert("Incorrect password!");
  }
});

/* ---------------------------
   Admin Date Ideas
--------------------------- */
const adminDateContainer = document.getElementById("adminDateIdeas");

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

    // Delete Date Idea Button
    const delIdeaBtn = document.createElement("button");
    delIdeaBtn.innerText = "Delete Date Idea";
    delIdeaBtn.style.background = "red";
    delIdeaBtn.style.color = "white";
    delIdeaBtn.style.border = "none";
    delIdeaBtn.style.padding = "5px 10px";
    delIdeaBtn.style.borderRadius = "5px";
    delIdeaBtn.style.marginTop = "5px";
    delIdeaBtn.style.cursor = "pointer";
    delIdeaBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/delete-date/${idea._id}`, { method: "DELETE" });
      loadAdminDateIdeas();
    });
    div.appendChild(delIdeaBtn);

    // Photos with delete buttons
    const photoDiv = document.getElementById("admin-photos-" + idea._id);
    if (idea.photos && idea.photos.length > 0) {
      idea.photos.forEach(p => {
        const imgDiv = document.createElement("div");
        imgDiv.style.position = "relative";
        imgDiv.style.display = "inline-block";
        imgDiv.style.margin = "5px";

        const img = document.createElement("img");
        img.src = p.startsWith("http") ? p : BACKEND_URL + p;
        img.style.width = "80px";
        img.style.borderRadius = "5px";

        const delBtn = document.createElement("button");
        delBtn.innerText = "X";
        delBtn.style.position = "absolute";
        delBtn.style.top = "0";
        delBtn.style.right = "0";
        delBtn.style.background = "red";
        delBtn.style.color = "white";
        delBtn.style.border = "none";
        delBtn.style.borderRadius = "50%";
        delBtn.style.cursor = "pointer";
        delBtn.addEventListener("click", async () => {
          await fetch(`${BACKEND_URL}/delete-date-photo/${idea._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photo: p })
          });
          loadAdminDateIdeas();
        });

        imgDiv.appendChild(img);
        imgDiv.appendChild(delBtn);
        photoDiv.appendChild(imgDiv);
      });
    }
  });
}

/* ---------------------------
   Admin Songs
--------------------------- */
const adminSongContainer = document.getElementById("adminSongs");

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
    `;

    const delSongBtn = document.createElement("button");
    delSongBtn.innerText = "Delete Song";
    delSongBtn.style.background = "red";
    delSongBtn.style.color = "white";
    delSongBtn.style.border = "none";
    delSongBtn.style.padding = "5px 10px";
    delSongBtn.style.borderRadius = "5px";
    delSongBtn.style.marginTop = "5px";
    delSongBtn.style.cursor = "pointer";
    delSongBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/delete-song/${song._id}`, { method: "DELETE" });
      loadAdminSongs();
    });

    div.appendChild(delSongBtn);
    adminSongContainer.appendChild(div);
  });
}

/* ---------------------------
   Admin Gallery
--------------------------- */
const adminGalleryContainer = document.getElementById("adminGallery");

async function loadAdminGallery() {
  const res = await fetch(`${BACKEND_URL}/gallery`);
  const photos = await res.json();
  adminGalleryContainer.innerHTML = "";

  photos.forEach(p => {
    const imgDiv = document.createElement("div");
    imgDiv.style.position = "relative";
    imgDiv.style.display = "inline-block";
    imgDiv.style.margin = "5px";

    const img = document.createElement("img");
    img.src = p.url;
    img.style.width = "100px";
    img.style.borderRadius = "5px";

    const delBtn = document.createElement("button");
    delBtn.innerText = "X";
    delBtn.style.position = "absolute";
    delBtn.style.top = "0";
    delBtn.style.right = "0";
    delBtn.style.background = "red";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.borderRadius = "50%";
    delBtn.style.cursor = "pointer";
    delBtn.addEventListener("click", async () => {
      await fetch(`${BACKEND_URL}/delete-gallery/${p._id}`, { method: "DELETE" });
      loadAdminGallery();
    });

    imgDiv.appendChild(img);
    imgDiv.appendChild(delBtn);
    adminGalleryContainer.appendChild(imgDiv);
  });
}
/* =========================
   DAILY AFFIRMATION
========================= */
async function loadAffirmation() {
  const container = document.getElementById("affirmation-text");

  try {
    const res = await fetch("/affirmations");
    const affirmations = await res.json();

    if (!affirmations || affirmations.length === 0) {
      container.innerText = "You are amazing and today will be a good day ❤️";
      return;
    }

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % affirmations.length;

    container.innerText = affirmations[index].text;

  } catch (err) {
    container.innerText = "You are amazing and today will be a good day ❤️";
  }
}


/* =========================
   SONGS (Playlist + Song of the Day)
========================= */
async function loadSongs() {

  const container = document.getElementById("playlist");
  if (!container) return;

  try {

    const res = await fetch("/songs");
    const songs = await res.json();

    container.innerHTML = "";

    songs.forEach(song => {

      const cover = song.cover.startsWith("/") ? song.cover : "/" + song.cover;

      // support both MongoDB formats
      const audioPath = song.file || song.audio || "";
      const audio = audioPath.startsWith("/") ? audioPath : "/" + audioPath;

      const div = document.createElement("div");
      div.className = "song";

      div.innerHTML = `
        <img src="${cover}" width="200">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <audio controls>
          <source src="${audio}" type="audio/mpeg">
        </audio>
      `;

      container.appendChild(div);

    });

    enableAudioControl();


    /* ---------- Song of the Day ---------- */

    const dayRes = await fetch("/song-of-the-day");
    const daySong = await dayRes.json();

    const dailyContainer = document.getElementById("dailySong");

    if (daySong && dailyContainer) {

      const cover = daySong.cover.startsWith("/") ? daySong.cover : "/" + daySong.cover;

      const audioPath = daySong.file || daySong.audio || "";
      const audio = audioPath.startsWith("/") ? audioPath : "/" + audioPath;

      dailyContainer.innerHTML = `
        <div class="song">
          <img src="${cover}" width="200">
          <h3>${daySong.title}</h3>
          <p>${daySong.artist}</p>
          <audio controls>
            <source src="${audio}" type="audio/mpeg">
          </audio>
        </div>
      `;
    }

  } catch (err) {
    console.error(err);
  }
}


/* =========================
   AUTO PAUSE OTHER SONGS
========================= */
function enableAudioControl(){

const audios=document.querySelectorAll("audio")

audios.forEach(audio=>{

audio.addEventListener("play",()=>{

audios.forEach(other=>{
if(other!==audio){
other.pause()
}
})

})

})

}


/* =========================
   DATE IDEAS
========================= */
async function loadDateIdeas() {

  const container = document.getElementById("dateIdeas");
  if (!container) return;

  try {

    const res = await fetch("/dateIdeas");
    const ideas = await res.json();

    container.innerHTML = "";

    ideas.forEach(idea => {

      const div = document.createElement("div");
      div.className = "date-card";

      let photosHTML = "";

      if (idea.photos) {
        idea.photos.forEach(p => {
          photosHTML += `<img src="${p}" />`;
        });
      }

      div.innerHTML = `
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
        <div class="date-photos">${photosHTML}</div>
      `;

      container.appendChild(div);

    });

  } catch (err) {
    console.error(err);
  }
}


/* =========================
   GALLERY
========================= */
async function loadGallery() {

  const container = document.getElementById("photoGallery");
  if (!container) return;

  container.innerHTML = "";

  try {

    const res = await fetch("/gallery");
    const photos = await res.json();

    photos.forEach(photo => {

      const img = document.createElement("img");
      img.src = photo.url;

      container.appendChild(img);

    });

  } catch (err) {
    console.error(err);
  }


  /* Photos from public/gallery */

  const publicPhotos = [
    "/gallery/photo1.jpg",
    "/gallery/photo2.jpg",
    "/gallery/photo3.jpg"
  ];

  publicPhotos.forEach(src => {

    const img = document.createElement("img");
    img.src = src;

    container.appendChild(img);

  });

  enableGalleryLightbox();
  enableSwipeGallery();

}


/* =========================
   LIGHTBOX
========================= */
function enableGalleryLightbox() {

  const gallery = document.getElementById("photoGallery");
  if (!gallery) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  gallery.querySelectorAll("img").forEach(img => {

    img.addEventListener("click", () => {

      lightbox.style.display = "flex";
      lightboxImg.src = img.src;

    });

  });

  lightbox.addEventListener("click", () => {

    lightbox.style.display = "none";

  });

}


/* =========================
   SWIPE GALLERY
========================= */
function enableSwipeGallery() {

  const gallery = document.getElementById("photoGallery");
  if (!gallery) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  gallery.addEventListener("mousedown", e => {

    isDown = true;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;

  });

  gallery.addEventListener("mouseleave", () => isDown = false);
  gallery.addEventListener("mouseup", () => isDown = false);

  gallery.addEventListener("mousemove", e => {

    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 2;

    gallery.scrollLeft = scrollLeft - walk;

  });

}


/* =========================
   PAGE LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {

  loadAffirmation();
  loadSongs();
  loadDateIdeas();
  loadGallery();

});
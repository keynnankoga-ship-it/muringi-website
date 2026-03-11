/* =========================
   DAILY AFFIRMATION
========================= */

async function loadAffirmation() {

  const el = document.getElementById("affirmation-text")

  if (!el) return

  try {

    const today = new Date().toDateString()

    const storedDate = localStorage.getItem("affirmationDate")

    const storedText = localStorage.getItem("affirmationText")

    if (storedDate === today && storedText) {

      el.innerText = storedText
      return

    }

    const res = await fetch("/affirmations")

    const data = await res.json()

    el.innerText = data.text

    localStorage.setItem("affirmationDate", today)

    localStorage.setItem("affirmationText", data.text)

  } catch (err) {

    el.innerText = "You are amazing and today will be a good day ❤️"

  }

}

/* =========================
   SONG OF THE DAY
========================= */

async function loadSongOfDay() {

  const container = document.getElementById("dailySong")

  if (!container) return

  try {

    const today = new Date().toDateString()

    const storedDate = localStorage.getItem("songDate")

    const storedSong = localStorage.getItem("songData")

    if (storedDate === today && storedSong) {

      const song = JSON.parse(storedSong)

      renderSong(container, song)

      return

    }

    const res = await fetch("/song-of-the-day")

    const song = await res.json()

    renderSong(container, song)

    localStorage.setItem("songDate", today)

    localStorage.setItem("songData", JSON.stringify(song))

  } catch (err) {

    container.innerHTML = "<p>Song unavailable</p>"

  }

}

function renderSong(container, song) {

  if (!song) return

  container.innerHTML = `
    <div class="song">
      <img src="${song.cover}" width="200">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <audio controls src="${song.audio}"></audio>
    </div>
  `

}

/* =========================
   LOAD PLAYLIST
========================= */

async function loadSongs() {

  const container = document.getElementById("playlist")

  if (!container) return

  try {

    const res = await fetch("/songs")

    const songs = await res.json()

    container.innerHTML = ""

    songs.forEach(song => {

      const div = document.createElement("div")

      div.className = "song"

      div.innerHTML = `
        <img src="${song.cover}" width="200">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <audio controls src="${song.audio}"></audio>
      `

      container.appendChild(div)

    })

  } catch (err) {

    container.innerHTML = "<p>Music unavailable</p>"

  }

}

/* =========================
   DATE IDEAS (DISPLAY ONLY)
========================= */

async function loadDateIdeas() {

  const container = document.getElementById("dateIdeas")

  if (!container) return

  try {

    const res = await fetch("/dateIdeas")

    const ideas = await res.json()

    container.innerHTML = ""

    ideas.forEach(idea => {

      const div = document.createElement("div")

      div.className = "date-card"

      let photosHTML = ""

      if (idea.photos) {

        idea.photos.forEach(p => {

          photosHTML += `<img src="${p}" class="date-photo">`

        })

      }

      div.innerHTML = `
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
        <div class="date-photos">${photosHTML}</div>
      `

      container.appendChild(div)

    })

  } catch (err) {

    container.innerHTML = "<p>Date ideas unavailable</p>"

  }

}

/* =========================
   GALLERY UPLOAD
========================= */

const uploadForm = document.getElementById("uploadForm")

if (uploadForm) {

  uploadForm.addEventListener("submit", async e => {

    e.preventDefault()

    const fileInput = document.getElementById("photoInput")

    if (!fileInput.files.length) return

    const formData = new FormData()

    formData.append("photo", fileInput.files[0])

    try {

      await fetch("/upload-gallery", {
        method: "POST",
        body: formData
      })

      location.reload()

    } catch (err) {

      alert("Upload failed")

    }

  })

}

/* =========================
   GALLERY LIGHTBOX
========================= */

function enableGalleryLightbox() {

  const gallery = document.getElementById("photoGallery")

  const lightbox = document.getElementById("lightbox")

  const lightboxImg = document.getElementById("lightbox-img")

  if (!gallery || !lightbox) return

  gallery.querySelectorAll("img").forEach(img => {

    img.addEventListener("click", () => {

      lightbox.style.display = "flex"

      lightboxImg.src = img.src

    })

  })

  lightbox.addEventListener("click", () => {

    lightbox.style.display = "none"

  })

}

/* =========================
   MOBILE SWIPE GALLERY
========================= */

function enableSwipeGallery() {

  const gallery = document.getElementById("photoGallery")

  if (!gallery) return

  let isDown = false
  let startX
  let scrollLeft

  /* Desktop drag */

  gallery.addEventListener("mousedown", e => {

    isDown = true

    startX = e.pageX - gallery.offsetLeft

    scrollLeft = gallery.scrollLeft

  })

  gallery.addEventListener("mouseleave", () => {

    isDown = false

  })

  gallery.addEventListener("mouseup", () => {

    isDown = false

  })

  gallery.addEventListener("mousemove", e => {

    if (!isDown) return

    e.preventDefault()

    const x = e.pageX - gallery.offsetLeft

    const walk = (x - startX) * 2

    gallery.scrollLeft = scrollLeft - walk

  })

  /* Mobile swipe */

  gallery.addEventListener("touchstart", e => {

    startX = e.touches[0].pageX

    scrollLeft = gallery.scrollLeft

  })

  gallery.addEventListener("touchmove", e => {

    const x = e.touches[0].pageX

    const walk = (x - startX) * 2

    gallery.scrollLeft = scrollLeft - walk

  })

}

/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {

  loadAffirmation()

  loadSongOfDay()

  loadSongs()

  loadDateIdeas()

  enableGalleryLightbox()

  enableSwipeGallery()

})
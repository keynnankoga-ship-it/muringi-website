/* =========================
   DAILY AFFIRMATION
========================= */

async function loadAffirmation() {

  try {

    const today = new Date().toDateString()
    const storedDate = localStorage.getItem("affirmationDate")
    const storedAffirmation = localStorage.getItem("affirmationText")

    if (storedDate === today && storedAffirmation) {

      document.getElementById("affirmation-text").innerText = storedAffirmation
      return

    }

    const res = await fetch("/affirmations")
    const affirmations = await res.json()

    const random =
      affirmations[Math.floor(Math.random() * affirmations.length)]

    document.getElementById("affirmation-text").innerText = random.text

    localStorage.setItem("affirmationDate", today)
    localStorage.setItem("affirmationText", random.text)

  } catch (err) {

    document.getElementById("affirmation-text").innerText =
      "You are amazing and today will be a good day ❤️"

  }
}

/* =========================
   SONG OF THE DAY
========================= */

async function loadSongOfDay() {

  const container = document.getElementById("dailySong")

  try {

    const today = new Date().toDateString()
    const storedDate = localStorage.getItem("songDate")
    const storedSong = localStorage.getItem("songData")

    if (storedDate === today && storedSong) {

      const song = JSON.parse(storedSong)

      container.innerHTML = `
        <div class="song">
        <img src="${song.cover}" width="200">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <audio controls src="${song.audio}"></audio>
        </div>
      `
      return
    }

    const res = await fetch("/songs")
    const songs = await res.json()

    const random = songs[Math.floor(Math.random() * songs.length)]

    container.innerHTML = `
      <div class="song">
      <img src="${random.cover}" width="200">
      <h3>${random.title}</h3>
      <p>${random.artist}</p>
      <audio controls src="${random.audio}"></audio>
      </div>
    `

    localStorage.setItem("songDate", today)
    localStorage.setItem("songData", JSON.stringify(random))

  } catch (err) {

    container.innerHTML = `<p>Song unavailable</p>`

  }
}

/* =========================
   LOAD PLAYLIST
========================= */

async function loadSongs() {

  const container = document.getElementById("playlist")

  if (!container) return

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

}

/* =========================
   DATE IDEAS
========================= */

async function loadDateIdeas() {

  const container = document.getElementById("dateIdeas")

  if (!container) return

  const res = await fetch("/dateIdeas")

  const ideas = await res.json()

  container.innerHTML = ""

  ideas.forEach(idea => {

    const div = document.createElement("div")

    div.className = "date-card"

    let photosHTML = ""

    if (idea.photos) {

      idea.photos.forEach(p => {

        photosHTML += `<img src="${p}" />`

      })

    }

    div.innerHTML = `
      <h3>${idea.title}</h3>
      <p>${idea.description}</p>
      <div class="date-photos">${photosHTML}</div>
    `

    container.appendChild(div)

  })

}

/* =========================
   GALLERY UPLOAD
========================= */

const uploadForm = document.getElementById("uploadForm")

if (uploadForm) {

  uploadForm.addEventListener("submit", async e => {

    e.preventDefault()

    const fileInput = document.getElementById("photoInput")

    const formData = new FormData()

    formData.append("photo", fileInput.files[0])

    await fetch("/uploadPhoto", {

      method: "POST",
      body: formData

    })

    location.reload()

  })

}

/* =========================
   GALLERY LIGHTBOX
========================= */

function enableGalleryLightbox() {

  const gallery = document.getElementById("photoGallery")

  if (!gallery) return

  const images = gallery.querySelectorAll("img")

  const lightbox = document.getElementById("lightbox")

  const lightboxImg = document.getElementById("lightbox-img")

  images.forEach(img => {

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
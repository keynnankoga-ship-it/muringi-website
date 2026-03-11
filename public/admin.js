/* =========================
ADMIN PASSWORD
========================= */

const PASSWORD = "koyo123"

/* =========================
LOGIN
========================= */

const loginForm = document.getElementById("adminLoginForm")

loginForm.addEventListener("submit", e => {

e.preventDefault()

const password = document.getElementById("adminPassword").value

if(password === PASSWORD){

document.getElementById("adminLogin").style.display="none"

document.getElementById("adminContent").style.display="block"

loadSongs()

loadDates()

loadGallery()

}else{

alert("Wrong password")

}

})

/* =========================
LOAD SONGS
========================= */

async function loadSongs(){

const res = await fetch("/songs")

const songs = await res.json()

const container = document.getElementById("adminSongs")

container.innerHTML=""

songs.forEach(song=>{

const div=document.createElement("div")

div.className="song-item"

div.innerHTML=`

<img src="${song.cover}" width="120">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<button class="delete-btn" onclick="deleteSong('${song._id}')">Delete</button>

`

container.appendChild(div)

})

}

/* =========================
ADD SONG
========================= */

document.getElementById("songForm").addEventListener("submit", async e=>{

e.preventDefault()

const formData=new FormData(e.target)

const data=Object.fromEntries(formData)

await fetch("/admin/addSong",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

})

e.target.reset()

loadSongs()

})

/* =========================
DELETE SONG
========================= */

async function deleteSong(id){

await fetch(`/admin/deleteSong/${id}`,{

method:"DELETE"

})

loadSongs()

}

/* =========================
LOAD DATE IDEAS
========================= */

async function loadDates(){

const res=await fetch("/dateIdeas")

const ideas=await res.json()

const container=document.getElementById("adminDates")

container.innerHTML=""

ideas.forEach(idea=>{

const div=document.createElement("div")

div.className="item"

div.innerHTML=`

<h3>${idea.title}</h3>

<p>${idea.description}</p>

<button class="delete-btn" onclick="deleteDate('${idea._id}')">Delete</button>

`

container.appendChild(div)

})

}

/* =========================
ADD DATE IDEA
========================= */

document.getElementById("dateForm").addEventListener("submit", async e=>{

e.preventDefault()

const formData=new FormData(e.target)

await fetch("/admin/addDateIdea",{

method:"POST",

body:formData

})

e.target.reset()

loadDates()

})

/* =========================
DELETE DATE IDEA
========================= */

async function deleteDate(id){

await fetch(`/admin/deleteDateIdea/${id}`,{

method:"DELETE"

})

loadDates()

}

/* =========================
LOAD GALLERY
========================= */

async function loadGallery(){

const res=await fetch("/galleryPhotos")

const photos=await res.json()

const container=document.getElementById("adminGallery")

container.innerHTML=""

photos.forEach(photo=>{

const div=document.createElement("div")

div.className="gallery-item"

div.innerHTML=`

<img src="${photo.url}" width="120">

<button class="delete-btn" onclick="deletePhoto('${photo._id}')">Delete</button>

`

container.appendChild(div)

})

}

/* =========================
DELETE PHOTO
========================= */

async function deletePhoto(id){

await fetch(`/admin/deletePhoto/${id}`,{

method:"DELETE"

})

loadGallery()

}
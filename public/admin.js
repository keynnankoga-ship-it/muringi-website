/* =========================
   ADMIN LOGIN
========================= */

const adminForm = document.getElementById("adminLoginForm")
const adminContent = document.getElementById("adminContent")
const adminPasswordInput = document.getElementById("adminPassword")

adminForm?.addEventListener("submit", async (e) => {

e.preventDefault()

const password = adminPasswordInput.value

try{

const res = await fetch("/admin-login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({password})

})

const data = await res.json()

if(data.success){

adminForm.style.display="none"
adminContent.style.display="block"

loadAdminSongs()
loadAdminDateIdeas()
loadAdminGallery()

}else{

alert("Incorrect admin password")

}

}catch(err){

console.error(err)
alert("Login failed")

}

})

/* =========================
   LOAD SONGS
========================= */

async function loadAdminSongs(){

const container = document.getElementById("adminSongs")

if(!container) return

try{

const res = await fetch("/songs")

if(res.status===401){

alert("Admin session expired")
location.reload()
return
}

const songs = await res.json()

container.innerHTML=""

songs.forEach(song=>{

const div=document.createElement("div")

div.className="song-item"

div.innerHTML=`

<h4>${song.title}</h4>

<p>${song.artist}</p>

<button class="delete-btn" onclick="deleteSong('${song._id}')">
Delete
</button>

`

container.appendChild(div)

})

}catch(err){

console.error("Songs failed",err)

}

}

/* =========================
   DELETE SONG
========================= */

async function deleteSong(id){

if(!confirm("Delete this song?")) return

try{

await fetch("/admin/song/"+id,{
method:"DELETE"
})

loadAdminSongs()

}catch(err){

console.error("Delete failed",err)

}

}

/* =========================
   LOAD DATE IDEAS
========================= */

async function loadAdminDateIdeas(){

const container=document.getElementById("adminDateIdeas")

if(!container) return

try{

const res=await fetch("/dateIdeas")

if(res.status===401){

alert("Admin session expired")
location.reload()
return
}

const ideas=await res.json()

container.innerHTML=""

ideas.forEach(idea=>{

const div=document.createElement("div")

div.className="item"

div.innerHTML=`

<h4>${idea.title}</h4>

<p>${idea.description}</p>

<button class="delete-btn" onclick="deleteDateIdea('${idea._id}')">
Delete
</button>

`

container.appendChild(div)

})

}catch(err){

console.error("Date ideas failed",err)

}

}

/* =========================
   DELETE DATE IDEA
========================= */

async function deleteDateIdea(id){

if(!confirm("Delete this date idea?")) return

try{

await fetch("/admin/date/"+id,{
method:"DELETE"
})

loadAdminDateIdeas()

}catch(err){

console.error("Delete failed",err)

}

}

/* =========================
   LOAD GALLERY
========================= */

async function loadAdminGallery(){

const container=document.getElementById("adminGallery")

if(!container) return

try{

const res=await fetch("/gallery")

if(res.status===401){

alert("Admin session expired")
location.reload()
return
}

const photos=await res.json()

container.innerHTML=""

photos.forEach(photo=>{

const div=document.createElement("div")

div.className="gallery-item"

div.innerHTML=`

<img src="${photo.url}" width="120">

<br>

<button class="delete-btn" onclick="deletePhoto('${photo._id}')">
Delete
</button>

`

container.appendChild(div)

})

}catch(err){

console.error("Gallery load failed",err)

}

}

/* =========================
   DELETE GALLERY PHOTO
========================= */

async function deletePhoto(id){

if(!confirm("Delete this photo?")) return

try{

await fetch("/admin/gallery/"+id,{
method:"DELETE"
})

loadAdminGallery()

}catch(err){

console.error("Delete failed",err)

}

}
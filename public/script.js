/* =========================
   DAILY AFFIRMATION
========================= */
async function loadAffirmation() {

const container=document.getElementById("affirmation-text")
if(!container) return

try{

const res=await fetch("/affirmations")
const affirmations=await res.json()

if(!affirmations || affirmations.length===0){
container.innerText="You are amazing and today will be a good day ❤️"
return
}

const today=new Date()
const start=new Date(today.getFullYear(),0,0)
const diff=today-start
const oneDay=1000*60*60*24
const dayOfYear=Math.floor(diff/oneDay)

const index=dayOfYear % affirmations.length

container.innerText=affirmations[index].text

}catch(err){

container.innerText="You are amazing and today will be a good day ❤️"

}

}


/* =========================
   SONGS
========================= */
async function loadSongs(){

const container=document.getElementById("playlist")
if(!container) return

try{

const res=await fetch("/songs")
const songs=await res.json()

container.innerHTML=""

songs.forEach(song=>{

const cover=song.cover?.startsWith("/")?song.cover:"/"+song.cover

const audioPath=song.file || song.audio || ""
const audio=audioPath.startsWith("/")?audioPath:"/"+audioPath

const div=document.createElement("div")
div.className="song"

div.innerHTML=`

<img src="${cover}" width="200">

<h3>${song.title}</h3>

<p>${song.artist}</p>

<audio controls>
<source src="${audio}" type="audio/mpeg">
</audio>

`

container.appendChild(div)

})

enableAudioControl()


/* SONG OF THE DAY */

const dayRes=await fetch("/song-of-the-day")
const daySong=await dayRes.json()

const dailyContainer=document.getElementById("dailySong")

if(daySong && dailyContainer){

const cover=daySong.cover?.startsWith("/")?daySong.cover:"/"+daySong.cover

const audioPath=daySong.file || daySong.audio || ""
const audio=audioPath.startsWith("/")?audioPath:"/"+audioPath

dailyContainer.innerHTML=`

<div class="song">

<img src="${cover}" width="200">

<h3>${daySong.title}</h3>

<p>${daySong.artist}</p>

<audio controls>
<source src="${audio}" type="audio/mpeg">
</audio>

</div>

`

}

}catch(err){

console.error("Song loading error:",err)

}

}


/* =========================
   AUTO PAUSE OTHER SONGS
========================= */

function enableAudioControl(){

const audios=document.querySelectorAll("audio")

audios.forEach(audio=>{

audio.onplay=()=>{

audios.forEach(other=>{
if(other!==audio){
other.pause()
}
})

}

})

}


/* =========================
   DATE IDEAS
========================= */

async function loadDateIdeas(){

const container=document.getElementById("dateIdeas")
if(!container) return

try{

const res=await fetch("/dateIdeas")
const ideas=await res.json()

container.innerHTML=""

ideas.forEach(idea=>{

const div=document.createElement("div")
div.className="date-card"

let photosHTML=""

if(idea.photos){

idea.photos.forEach(p=>{
photosHTML+=`<img src="${p}">`
})

}

div.innerHTML=`

<h3>${idea.title}</h3>

<p>${idea.description}</p>

<div class="date-photos">${photosHTML}</div>

`

container.appendChild(div)

})

}catch(err){

console.error("Date ideas error:",err)

}

}


/* =========================
   GALLERY
========================= */

async function loadGallery(){

const container=document.getElementById("photoGallery")
if(!container) return

container.innerHTML=""

try{

const res=await fetch("/gallery")
const photos=await res.json()

photos.forEach(photo=>{

const img=document.createElement("img")
img.src=photo.url

container.appendChild(img)

})

}catch(err){

console.error("Gallery DB error:",err)

}


/* PUBLIC GALLERY PHOTOS */

const publicPhotos=[

"/gallery/gallery1.jpeg",
"/gallery/gallery2.jpeg",
"/gallery/gallery3.jpeg",
"/gallery/gallery4.jpeg",
"/gallery/gallery5.jpeg",
"/gallery/gallery6.jpeg",
"/gallery/gallery7.jpeg",
"/gallery/gallery8.jpeg",
"/gallery/gallery9.jpeg",
"/gallery/gallery10.jpeg",
"/gallery/gallery11.jpeg",
"/gallery/gallery12.jpeg",
"/gallery/gallery13.jpeg",
"/gallery/gallery14.jpeg",
"/gallery/gallery15.jpeg",
"/gallery/gallery16.jpeg",
"/gallery/gallery17.jpeg",
"/gallery/gallery18.jpeg",
"/gallery/gallery19.jpeg",
"/gallery/gallery20.jpeg",
"/gallery/gallery21.jpeg",
"/gallery/gallery22.jpeg",
"/gallery/gallery23.jpeg",
"/gallery/gallery24.jpeg"

]

publicPhotos.forEach(src=>{

const img=document.createElement("img")
img.src=src

container.appendChild(img)

})

enableGalleryLightbox()

}


/* =========================
   LIGHTBOX
========================= */

function enableGalleryLightbox(){

const gallery=document.getElementById("photoGallery")
if(!gallery) return

const lightbox=document.getElementById("lightbox")
const lightboxImg=document.getElementById("lightbox-img")

gallery.querySelectorAll("img").forEach(img=>{

img.onclick=()=>{

lightbox.style.display="flex"
lightboxImg.src=img.src

}

})

lightbox.onclick=()=>{

lightbox.style.display="none"

}

}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded",()=>{

loadAffirmation()
loadSongs()
loadDateIdeas()
loadGallery()

})
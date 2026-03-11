/* =========================
   DAILY AFFIRMATION
   (366 DAY SYSTEM)
========================= */

const affirmationContainer = document.getElementById("daily-affirmation")

async function loadAffirmation(){

try{

const res = await fetch("/affirmations")
const affirmations = await res.json()

if(!affirmations || affirmations.length === 0){

affirmationContainer.innerText = "You are loved."
return

}

/* =========================
   CALCULATE DAY OF YEAR
========================= */

const today = new Date()

const start = new Date(today.getFullYear(),0,0)

const diff = today - start

const oneDay = 1000 * 60 * 60 * 24

const dayOfYear = Math.floor(diff / oneDay)

/* =========================
   PICK AFFIRMATION
========================= */

const affirmationIndex = dayOfYear % affirmations.length

const affirmationText = affirmations[affirmationIndex].text

affirmationContainer.innerText = affirmationText

}

catch(error){

console.error("Affirmation error:",error)

affirmationContainer.innerText = "You are loved."

}

}

loadAffirmation()
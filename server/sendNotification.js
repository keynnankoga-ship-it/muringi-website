// /server/sendNotification.js

const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');

const app = express(); // <-- THIS WAS MISSING

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

// --- Store tokens (use DB in production) ---
let tokens = [];

// Save FCM token from frontend
app.post('/save-token', (req, res) => {
  const { token } = req.body;

  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log('Token saved:', token);
  }

  res.send({ success: true });
});

// --- Get today's affirmation ---
function getTodaysAffirmation() {
  const today = new Date().toISOString().split('T')[0];

  const affirmations = JSON.parse(
    fs.readFileSync('../data/affirmations.json')
  );

  return affirmations.find(a => a.date === today);
}

// --- Send notifications to all tokens ---
function sendDailyNotification() {

  const todayAffirmation = getTodaysAffirmation();

  if (!todayAffirmation) {
    console.log('No affirmation for today.');
    return;
  }

  if (tokens.length === 0) {
    console.log('No subscribed users yet.');
    return;
  }

  const message = {
    notification: {
      title: "Today's Affirmation",
      body: todayAffirmation.affirmation
    },
    tokens
  };

  admin.messaging().sendEachForMulticast(message)
    .then(response => {
      console.log(`Notifications sent: ${response.successCount}`);
    })
    .catch(err => {
      console.error('Error sending notifications:', err);
    });
}

// --- Schedule daily notification at 8:00 AM ---
cron.schedule('0 8 * * *', () => {

  console.log('Running daily affirmation notification...');

  sendDailyNotification();

});

// --- Start server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
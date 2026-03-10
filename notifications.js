require("dotenv").config();
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const cron = require("node-cron");

// --- Connect to MongoDB (reuse your MONGO_URI from .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅ (notifications.js)"))
  .catch(err => console.error("MongoDB connection error ❌:", err));

// --- FCM token schema
const tokenSchema = new mongoose.Schema({
  token: String
});
const FcmToken = mongoose.model("FcmToken", tokenSchema);

// --- Initialize Firebase Admin
const serviceAccount = require("./server/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// --- Function to send daily love notification
async function sendDailyLoveNotification() {
  try {
    const tokens = await FcmToken.find();
    if (!tokens.length) return console.log("No tokens to send notifications to.");

    const message = {
      notification: {
        title: "💌 Daily Love Reminder",
        body: "Hey! Your special love message is here ❤️"
      },
      tokens: tokens.map(t => t.token)
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notifications sent: ${response.successCount} succeeded, ${response.failureCount} failed`);
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
}

// --- Schedule daily notification at 9:00 AM server time
cron.schedule("0 9 * * *", () => {
  console.log("Running daily love notification job...");
  sendDailyLoveNotification();
});

console.log("Notifications service running...");
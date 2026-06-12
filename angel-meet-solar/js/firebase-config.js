/* ===================================================
   FIREBASE CONFIGURATION
   ---------------------------------------------------
   1. Go to https://console.firebase.google.com
   2. Create a new project (or use an existing one)
   3. Click the "</>" (Web) icon to register a web app
   4. Copy the config object Firebase gives you and
      paste the values below, replacing the placeholders.
   5. In the Firebase Console, go to "Build > Firestore
      Database" and click "Create database"
      (start in test mode for quick setup, then tighten
      the security rules — see README.md).
=================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0FhqcjZPhtnmjmDnNWq35R5AZzkSp9XM",
  authDomain: "angel-meet-solar-solutions.firebaseapp.com",
  projectId: "angel-meet-solar-solutions",
  storageBucket: "angel-meet-solar-solutions.firebasestorage.app",
  messagingSenderId: "728860849831",
  appId: "1:728860849831:web:a8f41eeaa3354d41d74d82",
  measurementId: "G-2BW6RW89TW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make available to other modules
window.firebaseApp = app;
window.firebaseDB = db;

export { app, db };

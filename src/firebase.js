// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3wffG-6yexAm5MP7GYY3e2FwG7HzGxAQ",
  authDomain: "watchlistai.firebaseapp.com",
  projectId: "watchlistai",
  storageBucket: "watchlistai.firebasestorage.app",
  messagingSenderId: "456308629256",
  appId: "1:456308629256:web:25084ea6619c4faad3d6bd"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

export { db };
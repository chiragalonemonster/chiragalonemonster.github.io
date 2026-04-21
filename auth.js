// ============================================
//   auth.js — Alone Monster Coding Hub
//   Yeh file har protected page mein include karo
//   Path: /auth.js (root mein rakho)
// ============================================

const firebaseConfig = {
  apiKey:            "AIzaSyBNeAqfrJ9fTjYUkWEpz-DZxOd9S1Rqp8c",
  authDomain:        "alone-monster-coding-hub.firebaseapp.com",
  projectId:         "alone-monster-coding-hub",
  storageBucket:     "alone-monster-coding-hub.firebasestorage.app",
  messagingSenderId: "92310923147",
  appId:             "1:92310923147:web:26a09f2aed09d9aef3718e",
  measurementId:     "G-4YPW7T4WGN"
};

// Firebase initialize karo (already initialized check)
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// ✅ Auth state check — yeh har page load pe run hoga
auth.onAuthStateChanged((user) => {
  if (!user) {
    // User logged in nahi hai → login page pe bhejo
    window.location.href = "/login.html";
  } else {
    // User logged in hai → page show karo
    document.body.style.visibility = "visible";
  }
});

// Body pehle hide rakho jab tak auth check na ho
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.visibility = "hidden";
});

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

// ──────────────────────────────────────────────
//  ADMIN SESSION HELPER
//  Login page admin verify hone ke baad
//  localStorage mein "am_admin_session" set karta hai.
//  Yahan us flag ko respect karte hain — Firebase
//  user na hone par bhi admin ko page dikhao.
// ──────────────────────────────────────────────
function isAdminSession() {
  try {
    return localStorage.getItem('am_admin_session') === '1';
  } catch (_) { return false; }
}

// Window pe expose karo taaki dusre pages use kar saken (logout button etc.)
window.AMAuth = {
  isAdmin: isAdminSession,
  logoutAdmin: function () {
    try {
      localStorage.removeItem('am_admin_session');
      localStorage.removeItem('am_admin_since');
    } catch (_) {}
    window.location.href = "/login.html";
  }
};

// ✅ Auth state check — yeh har page load pe run hoga
auth.onAuthStateChanged((user) => {
  // Agar admin session active hai → page show kar do, Firebase ki zarurat nahi
  if (isAdminSession()) {
    document.body.style.visibility = "visible";
    return;
  }

  if (!user) {
    // Na admin, na firebase user → login page pe bhejo
    window.location.href = "/login.html";
  } else {
    // Firebase user logged in hai → page show karo
    document.body.style.visibility = "visible";
  }
});

// Body pehle hide rakho jab tak auth check na ho — laikin agar admin session
// hai toh turant dikha do (Firebase callback ka wait nahi).
document.addEventListener("DOMContentLoaded", () => {
  if (isAdminSession()) {
    document.body.style.visibility = "visible";
  } else {
    document.body.style.visibility = "hidden";
  }
});

/**
 * firebase-config.js - Firebase Authentication Setup
 * Uses Firebase CDN (no bundler needed)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDikJkMJ9XgsOzrBxdSTA8jlfIbPOzjp2U",
    authDomain: "elekcalc.firebaseapp.com",
    projectId: "elekcalc",
    storageBucket: "elekcalc.firebasestorage.app",
    messagingSenderId: "891392348400",
    appId: "1:891392348400:web:eb3e27530558eb818af235",
    measurementId: "G-82594LWP2S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose to global scope so app.js can use it
window.firebaseAuth = {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    updateProfile
};

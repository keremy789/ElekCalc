/**
 * firebase-config.js - Firebase Authentication Setup (Compat version)
 */

const firebaseConfig = {
    apiKey: "AIzaSyDikJkMJ9XgsOzrBxdSTA8jlfIbPOzjp2U",
    authDomain: "elekcalc.firebaseapp.com",
    projectId: "elekcalc",
    storageBucket: "elekcalc.firebasestorage.app",
    messagingSenderId: "891392348400",
    appId: "1:891392348400:web:eb3e27530558eb818af235",
    measurementId: "G-82594LWP2S"
};

// Initialize Firebase with Compat SDK
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Expose to global scope for app.js
window.firebaseAuth = {
    auth: auth,
    createUserWithEmailAndPassword: (auth, email, pass) => auth.createUserWithEmailAndPassword(email, pass),
    signInWithEmailAndPassword: (auth, email, pass) => auth.signInWithEmailAndPassword(email, pass),
    sendEmailVerification: (user) => user.sendEmailVerification(),
    signOut: (auth) => auth.signOut(),
    onAuthStateChanged: (auth, callback) => auth.onAuthStateChanged(callback),
    updateProfile: (user, data) => user.updateProfile(data),
    sendPasswordResetEmail: (auth, email) => auth.sendPasswordResetEmail(email)
};

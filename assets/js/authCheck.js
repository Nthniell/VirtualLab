
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmbQ5sgDW5az4gVWFdqkq7PD-rW41W8LU",
    authDomain: "guessthegraph.firebaseapp.com",
    projectId: "guessthegraph",
    storageBucket: "guessthegraph.firebasestorage.app",
    messagingSenderId: "564967841167",
    appId: "1:564967841167:web:c5a7a63d8d8cdebce9bffa",
    measurementId: "G-VB3GG43XG7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    }
});

// Logout function
window.logout = function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout failed:', error);
    });
}
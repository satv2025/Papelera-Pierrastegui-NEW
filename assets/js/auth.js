import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD9T9Y34jeQUtscNdjn-aZ54B4kEisNk3c",
    authDomain: "papelera-pie.firebaseapp.com",
    projectId: "papelera-pie",
    storageBucket: "papelera-pie.firebasestorage.app",
    messagingSenderId: "407925272882",
    appId: "1:407925272882:web:4ce4347c5cba2e95b4a72b",
    measurementId: "G-YXB9F6CTN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const ROOT_HOME = "https://papelerapierrastegui.com.ar/";

// Función Google Sign-In
const googleHandler = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        if (!user) throw new Error("No se obtuvo usuario de Google.");

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snap = await getDocs(q);
        if (snap.empty) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                email: user.email,
                username: user.displayName || "UsuarioGoogle"
            });
        }
        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error(err);
        alert(err.message || "Error en Google Sign-In.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-login-google")?.addEventListener("click", googleHandler);
    document.getElementById("btn-register-google")?.addEventListener("click", googleHandler);
});

// Redirigir si ya está logueado
onAuthStateChanged(auth, user => {
    if (user) window.location.replace(ROOT_HOME);
});

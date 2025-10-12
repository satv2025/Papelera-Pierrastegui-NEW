// /assets/js/auth.js
// Firebase initialization and auth flows

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

/* ---------- CONFIG ---------- */
const firebaseConfig = {
    apiKey: "AIzaSyD9T9Y34jeQUtscNdjn-aZ54B4kEisNk3c",
    authDomain: "papelera-pie.firebaseapp.com",
    projectId: "papelera-pie",
    storageBucket: "papelera-pie.appspot.com",
    messagingSenderId: "407925272882",
    appId: "1:407925272882:web:4ce4347c5cba2e95b4a72b",
    measurementId: "G-YXB9F6CTN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const ROOT_HOME = "https://papelerapierrastegui.com.ar/";

/* ---------- HELPERS ---------- */
function isEmailLooksLike(e) {
    return typeof e === "string" && /\S+@\S+\.\S+/.test(e);
}

/* ---------- REGISTER ---------- */
export async function registerUser(values) {
    try {
        const email = (values.email || "").trim();
        const password = (values.password || "").trim();
        const confirm = (values.confirm || "").trim();
        const username = (values.username || "").trim();

        if (!email || !password || !confirm || !username) throw new Error("Completa todos los campos.");
        if (!isEmailLooksLike(email)) throw new Error("Ingresa un correo válido.");
        if (password !== confirm) throw new Error("Las contraseñas no coinciden.");

        // Check email exists
        const qEmail = query(collection(db, "users"), where("email", "==", email));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) throw new Error("Este correo ya está registrado.");

        // Check username exists
        const qUser = query(collection(db, "users"), where("username", "==", username));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) throw new Error("Nombre de usuario en uso.");

        // Create user
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        // Save in Firestore
        await addDoc(collection(db, "users"), { uid: cred.user.uid, username, email });

        // Redirect
        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error("registerUser error:", err);
        throw err;
    }
}

/* ---------- LOGIN ---------- */
export async function loginUser(values) {
    try {
        const email = (values.email || "").trim();
        const password = (values.password || "").trim();

        if (!email || !password) throw new Error("Completa todos los campos.");
        if (!isEmailLooksLike(email)) throw new Error("Ingresa un correo válido.");

        await signInWithEmailAndPassword(auth, email, password);

        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error("loginUser error:", err);
        throw err;
    }
}

/* ---------- GOOGLE LOGIN ---------- */
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        if (!user) throw new Error("No se obtuvo usuario de Google.");

        // Guardar si es primer login
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
        console.error("loginWithGoogle error:", err);
        throw err;
    }
}

/* ---------- REDIRECT IF LOGGED IN ---------- */
export function redirectIfLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user && (window.location.pathname.includes("logueo") || window.location.pathname.includes("registro"))) {
            window.location.replace(ROOT_HOME);
        }
    });
}

export { auth, db, googleProvider };
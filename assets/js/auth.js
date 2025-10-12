// /assets/js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
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
    storageBucket: "papelera-pie.firebasestorage.app",
    messagingSenderId: "407925272882",
    appId: "1:407925272882:web:4ce4347c5cba2e95b4a72b",
    measurementId: "G-YXB9F6CTN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const ROOT_HOME = "https://papelerapierrastegui.com.ar/";

// Helpers
function isEmailLooksLike(e) {
    return typeof e === "string" && /\S+@\S+\.\S+/.test(e);
}

/* ---------- REGISTER ---------- */
export async function registerUser(values) {
    const email = (values.email || "").trim();
    const password = (values.password || "").trim();
    const confirm = (values.confirm || "").trim();
    const username = (values.username || "").trim();

    if (!email || !password || !confirm || !username) throw new Error("Completa todos los campos.");
    if (!isEmailLooksLike(email)) throw new Error("Ingresa un correo válido.");
    if (password !== confirm) throw new Error("Las contraseñas no coinciden.");

    // check email exists
    const qEmail = query(collection(db, "users"), where("email", "==", email));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) throw new Error("Este correo ya está registrado.");

    // check username exists
    const qUser = query(collection(db, "users"), where("username", "==", username));
    const snapUser = await getDocs(qUser);
    if (!snapUser.empty) throw new Error("Nombre de usuario en uso.");

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), { uid: cred.user.uid, username, email });

    window.location.replace(ROOT_HOME);
}

/* ---------- LOGIN ---------- */
export async function loginUser(values) {
    const email = (values.email || "").trim();
    const password = (values.password || "").trim();

    if (!email || !password) throw new Error("Completa todos los campos.");
    if (!isEmailLooksLike(email)) throw new Error("Ingresa un correo válido.");

    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace(ROOT_HOME);
}

/* ---------- GOOGLE LOGIN / REDIRECT ---------- */
export function loginWithGoogleRedirect() {
    signInWithRedirect(auth, googleProvider);
}

// Al cargar, chequeamos si venimos del redirect
getRedirectResult(auth)
    .then(async (result) => {
        if (result?.user) {
            const user = result.user;
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
        }
    })
    .catch(err => console.error("Google redirect error:", err));

/* ---------- ON AUTH STATE ---------- */
export function redirectIfLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user && (window.location.pathname.includes("logueo") || window.location.pathname.includes("registro"))) {
            window.location.replace(ROOT_HOME);
        }
    });
}

export { auth, db, googleProvider };
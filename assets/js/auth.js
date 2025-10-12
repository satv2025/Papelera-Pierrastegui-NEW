// auth.js (ES module) - reemplazar en /assets/js/auth.js
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
    storageBucket: "papelera-pie.firebasestorage.app",
    messagingSenderId: "407925272882",
    appId: "1:407925272882:web:4ce4347c5cba2e95b4a72b",
    measurementId: "G-YXB9F6CTN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/* ---------- SETTINGS ---------- */
const ROOT_HOME = "https://papelerapierrastegui.com.ar/";
const isAuthPage = (() => {
    const p = window.location.pathname.toLowerCase();
    return p.includes("/logueo") || p.includes("/registro") || p.endsWith("/login") || p.endsWith("/registro.html") || p.endsWith("/logueo.html");
})();

/* ---------- CUSTOM INPUTS (funcionan como inputs nativos) ---------- */
const customInputs = Array.from(document.querySelectorAll(".custom-input"));

// Toggle has-value placeholder
customInputs.forEach(input => {
    const updateClass = () => {
        if (input.textContent.trim().length > 0) input.classList.add("has-value");
        else input.classList.remove("has-value");
    };
    input.addEventListener("input", updateClass);
    input.addEventListener("focus", () => input.classList.add("focused"));
    input.addEventListener("blur", () => input.classList.remove("focused"));
    updateClass();
});

// Helper para obtener valor
const getInputValue = key => {
    const el = document.querySelector(`.custom-input[data-key="${key}"]`);
    return el ? el.textContent.trim() : '';
};

/* ---------- NAV buttons ---------- */
document.getElementById("btn-login-page")?.addEventListener("click", () => window.location.replace("/logueo"));
document.getElementById("btn-register-page")?.addEventListener("click", () => window.location.replace("/registro"));

/* ---------- REGISTER ---------- */
document.getElementById("btn-register")?.addEventListener("click", async () => {
    const email = getInputValue("email");
    const password = getInputValue("password");
    const confirm = getInputValue("confirm");
    const username = getInputValue("username");

    if (!email || !password || !confirm || !username) return alert("Completa todos los campos.");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Ingresa un correo válido.");
    if (password !== confirm) return alert("Las contraseñas no coinciden.");

    try {
        const qEmail = query(collection(db, "users"), where("email", "==", email));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) return alert("Este correo ya está registrado.");

        const qUser = query(collection(db, "users"), where("username", "==", username));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) return alert("Nombre de usuario en uso.");

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "users"), { uid: cred.user.uid, username, email });
        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error(err);
        alert(err.message || "Error al registrar.");
    }
});

/* ---------- LOGIN ---------- */
document.getElementById("btn-login")?.addEventListener("click", async () => {
    const email = getInputValue("email");
    const password = getInputValue("password");

    if (!email || !password) return alert("Completa todos los campos.");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Ingresa un correo válido.");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error(err);
        if (err.code === "auth/user-not-found") alert("Correo no registrado.");
        else if (err.code === "auth/wrong-password") alert("Contraseña incorrecta.");
        else alert(err.message || "Error al iniciar sesión.");
    }
});

/* ---------- GOOGLE AUTH ---------- */
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

document.getElementById("btn-login-google")?.addEventListener("click", googleHandler);
document.getElementById("btn-register-google")?.addEventListener("click", googleHandler);

/* ---------- Auth state ---------- */
onAuthStateChanged(auth, (user) => {
    if (user && isAuthPage) window.location.replace(ROOT_HOME);
});
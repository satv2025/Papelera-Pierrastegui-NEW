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

/* ---------- CONFIG: tu Firebase ---------- */
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

/* ---------- CUSTOM INPUTS (NO NATIVE INPUTS) ---------- */
const customInputs = Array.from(document.querySelectorAll(".custom-input"));
let activeInput = null;
const values = {};

// Helper: update has-value class
const updateHasValue = (el, name) => {
    if ((values[name] || "").length > 0) el.classList.add("has-value");
    else el.classList.remove("has-value");
};

// Focus handling
customInputs.forEach(el => {
    el.setAttribute("tabindex", "0");
    if (!el.hasAttribute("contenteditable")) el.setAttribute("contenteditable", "true");

    el.addEventListener("focus", () => {
        customInputs.forEach(x => x.classList.remove("focused"));
        el.classList.add("focused");
        activeInput = el;
    });
    el.addEventListener("blur", () => {
        el.classList.remove("focused");
        activeInput = null;
    });
});

// Keyboard capture with selection support
document.addEventListener("keydown", (e) => {
    if (isAuthPage && e.key === "Enter") e.preventDefault();
    if (!activeInput) return;

    const key = e.key;
    const name = activeInput.dataset.key;
    if (!name) return;

    values[name] = values[name] || "";
    e.preventDefault(); // control all keys

    const sel = window.getSelection();
    let start = 0, end = 0;
    if (sel && sel.rangeCount > 0 && sel.anchorNode === activeInput.firstChild) {
        start = sel.anchorOffset;
        end = sel.focusOffset;
        if (start > end) [start, end] = [end, start];
    } else if (values[name].length > 0) {
        // fallback if empty
        start = values[name].length;
        end = start;
    }

    if (key === "Backspace") {
        if (start === end && start > 0) {
            // delete one char before caret
            values[name] = values[name].slice(0, start - 1) + values[name].slice(end);
        } else {
            // delete selected range
            values[name] = values[name].slice(0, start) + values[name].slice(end);
        }
    } else if (key.length === 1) {
        // Replace selection with typed char
        values[name] = values[name].slice(0, start) + key + values[name].slice(end);
    } else {
        return; // ignore non-printable
    }

    // Render masked or plain text
    const isPassword = activeInput.dataset.password === "true";
    activeInput.textContent = isPassword ? "*".repeat(values[name].length) : values[name];

    // restore caret
    const range = document.createRange();
    const textNode = activeInput.firstChild || activeInput;
    const pos = start + (key.length === 1 ? 1 : 0);
    range.setStart(textNode, Math.min(pos, values[name].length));
    range.setEnd(textNode, Math.min(pos, values[name].length));
    sel.removeAllRanges();
    sel.addRange(range);

    // Update placeholder
    updateHasValue(activeInput, name);
});

/* ---------- SAFETY: prevent native enter submit ---------- */
Array.from(document.querySelectorAll("button")).forEach(btn => {
    btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") e.preventDefault();
    });
});

/* ---------- NAV buttons ---------- */
const goToLoginPageBtn = document.getElementById("btn-login-page");
if (goToLoginPageBtn) goToLoginPageBtn.addEventListener("click", () => window.location.replace("/logueo"));

const goToRegisterPageBtn = document.getElementById("btn-register-page");
if (goToRegisterPageBtn) goToRegisterPageBtn.addEventListener("click", () => window.location.replace("/registro"));

/* ---------- AUTH FLOWS ---------- */
function isEmailLooksLike(e) {
    return typeof e === "string" && /\S+@\S+\.\S+/.test(e);
}

/* REGISTER */
const btnRegister = document.getElementById("btn-register");
if (btnRegister) btnRegister.addEventListener("click", async () => {
    const email = (values.email || "").trim();
    const password = (values.password || "").trim();
    const confirm = (values.confirm || "").trim();
    const username = (values.username || "").trim();

    if (!email || !password || !confirm || !username) return alert("Completa todos los campos.");
    if (!isEmailLooksLike(email)) return alert("Ingresa un correo válido.");
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
        console.error("Register error:", err);
        alert(err.message || "Error al registrar.");
    }
});

/* LOGIN */
const btnLogin = document.getElementById("btn-login");
if (btnLogin) btnLogin.addEventListener("click", async () => {
    const email = (values.email || "").trim();
    const password = (values.password || "").trim();

    if (!email || !password) return alert("Completa todos los campos.");
    if (!isEmailLooksLike(email)) return alert("Ingresa un correo válido.");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace(ROOT_HOME);
    } catch (err) {
        console.error("Login error:", err);
        if (err.code === "auth/user-not-found") alert("Correo no registrado.");
        else if (err.code === "auth/wrong-password") alert("Contraseña incorrecta.");
        else alert(err.message || "Error al iniciar sesión.");
    }
});

/* GOOGLE */
const btnLoginGoogle = document.getElementById("btn-login-google");
const btnRegisterGoogle = document.getElementById("btn-register-google");

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
        console.error("Google sign-in error:", err);
        alert(err.message || "Error en Google Sign-In.");
    }
};

if (btnLoginGoogle) btnLoginGoogle.addEventListener("click", googleHandler);
if (btnRegisterGoogle) btnRegisterGoogle.addEventListener("click", googleHandler);

/* ---------- Auth state ---------- */
onAuthStateChanged(auth, (user) => {
    if (user && isAuthPage) window.location.replace(ROOT_HOME);
});
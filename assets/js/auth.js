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

// Firebase config
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

// Custom inputs
const customInputs = document.querySelectorAll(".custom-input");
let activeInput = null;
const values = {};

customInputs.forEach(ci => {
    ci.addEventListener("click", () => {
        customInputs.forEach(c => c.classList.remove("focused"));
        ci.classList.add("focused");
        activeInput = ci;
    });
});

document.addEventListener("keydown", e => {
    if (!activeInput) return;
    const key = e.key;

    if (key === "Backspace") {
        values[activeInput.dataset.key] = values[activeInput.dataset.key] || "";
        values[activeInput.dataset.key] = values[activeInput.dataset.key].slice(0, -1);
    } else if (key.length === 1) {
        values[activeInput.dataset.key] = values[activeInput.dataset.key] || "";
        values[activeInput.dataset.key] += key;
    }

    if (activeInput.dataset.password) {
        activeInput.textContent = "*".repeat(values[activeInput.dataset.key].length);
    } else {
        activeInput.textContent = values[activeInput.dataset.key];
    }
});

// Register
const btnRegister = document.getElementById("btn-register");
if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
        const email = values.email;
        const password = values.password;
        const confirm = values.confirm;
        const username = values.username;

        if (!email || !password || !confirm || !username) return alert("Completa todos los campos");
        if (password !== confirm) return alert("Contraseñas no coinciden");

        try {
            const emailQ = query(collection(db, "users"), where("email", "==", email));
            const emailSnap = await getDocs(emailQ);
            if (!emailSnap.empty) return alert("Correo ya registrado");

            const usernameQ = query(collection(db, "users"), where("username", "==", username));
            const usernameSnap = await getDocs(usernameQ);
            if (!usernameSnap.empty) return alert("Usuario en uso");

            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await addDoc(collection(db, "users"), { uid: cred.user.uid, email, username });
            window.location.href = "index.html";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
}

// Login
const btnLogin = document.getElementById("btn-login");
if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = values.email;
        const password = values.password;

        if (!email || !password) return alert("Completa todos los campos");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
}

// Google login
const btnGoogle = document.getElementById("btn-login-google");
if (btnGoogle) {
    btnGoogle.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
            const snapshot = await getDocs(userQuery);
            if (snapshot.empty) {
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || "UsuarioGoogle"
                });
            }

            window.location.href = "index.html";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
}

// Auth state
onAuthStateChanged(auth, user => {
    if (user) {
        if (window.location.pathname.includes("logueo") || window.location.pathname.includes("registro")) {
            window.location.href = "index.html";
        }
    }
});
// Firebase: Registro y Login con E-Mail y Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Configuración Firebase
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

// ---------- REGISTRO EMAIL ----------
const btnRegister = document.getElementById("btn-register");
if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const username = document.getElementById("username").value.trim();

        if (!email || !password || !username) return alert("Completa todos los campos");
        if (password !== document.getElementById("confirmpassword").value) return alert("Las contraseñas no coinciden");

        try {
            const emailQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);
            if (!emailSnapshot.empty) return alert("Este correo ya está registrado.");

            const usernameQuery = query(collection(db, "users"), where("username", "==", username));
            const usernameSnapshot = await getDocs(usernameQuery);
            if (!usernameSnapshot.empty) return alert("Nombre de usuario en uso.");

            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await addDoc(collection(db, "users"), { uid: cred.user.uid, username, email });

            window.location.replace("index.html");
        } catch (err) {
            console.error(err);
            alert("Error al registrar: " + err.message);
        }
    });
}

// ---------- LOGIN EMAIL ----------
const btnLogin = document.getElementById("btn-login");
if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!email || !password) return alert("Completa todos los campos");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.replace("index.html");
        } catch (err) {
            console.error(err);
            if (err.code === "auth/user-not-found") alert("Correo no registrado.");
            else if (err.code === "auth/wrong-password") alert("Contraseña incorrecta.");
            else alert("Error: " + err.message);
        }
    });
}

// ---------- LOGIN/REGISTRO GOOGLE ----------
const googleButtons = document.querySelectorAll("#btn-google, #btn-login-google");
googleButtons.forEach(btn => {
    btn.type = "button";
    btn.addEventListener("click", async () => {
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

            window.location.replace("index.html");
        } catch (err) {
            console.error(err);
            alert("Error en Google Sign-In: " + err.message);
        }
    });
});

// ---------- Estado de autenticación ----------
onAuthStateChanged(auth, user => {
    if (user && (window.location.pathname.includes("logueo") || window.location.pathname.includes("registro"))) {
        window.location.replace("index.html");
    }
});

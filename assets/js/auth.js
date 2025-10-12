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

// ---------- REGISTRO CON EMAIL ----------
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const username = document.getElementById("username").value.trim();

        try {
            // Verificar si email ya existe
            const emailQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);
            if (!emailSnapshot.empty) {
                alert("Este correo ya está registrado.");
                return;
            }

            // Verificar si username ya existe
            const usernameQuery = query(collection(db, "users"), where("username", "==", username));
            const usernameSnapshot = await getDocs(usernameQuery);
            if (!usernameSnapshot.empty) {
                alert("Nombre de usuario en uso.");
                return;
            }

            // Crear usuario
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await addDoc(collection(db, "users"), {
                uid: cred.user.uid,
                username,
                email
            });

            window.location.href = "index.html"; // Redirigir tras registro
        } catch (error) {
            console.error(error);
            alert("Error al registrar: " + error.message);
        }
    });
}

// ---------- LOGIN CON EMAIL ----------
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html"; // Redirigir tras login
        } catch (error) {
            console.error(error);
            if (error.code === "auth/user-not-found") {
                alert("Correo no registrado.");
            } else if (error.code === "auth/wrong-password") {
                alert("Contraseña incorrecta.");
            } else {
                alert("Error: " + error.message);
            }
        }
    });
}

// ---------- LOGIN/REGISTRO CON GOOGLE ----------
const googleButtons = document.querySelectorAll("#btn-google, #btn-login-google");
googleButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Guardar usuario en Firestore si es primer login
            const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
            const snapshot = await getDocs(userQuery);
            if (snapshot.empty) {
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || "UsuarioGoogle"
                });
            }

            window.location.href = "index.html"; // Redirigir tras login
        } catch (error) {
            console.error(error);
            alert("Error en Google Sign-In: " + error.message);
        }
    });
});

// ---------- COMPROBAR ESTADO DE AUTENTICACIÓN ----------
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Evitar volver a login/registro si ya está logueado
        if (window.location.pathname.includes("logueo") || window.location.pathname.includes("registro")) {
            window.location.href = "index.html";
        }
    }
});
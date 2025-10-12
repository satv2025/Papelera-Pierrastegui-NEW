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

        // Limpiar errores previos
        const emailError = document.getElementById("email-error");
        const usernameError = document.getElementById("username-error");
        emailError.textContent = "";
        usernameError.textContent = "";

        try {
            // Verificar correo
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(userQuery);
            if (!emailSnapshot.empty) {
                emailError.textContent = "Este correo ya está registrado.";
                return;
            }

            // Verificar username
            const usernameQuery = query(collection(db, "users"), where("username", "==", username));
            const usernameSnapshot = await getDocs(usernameQuery);
            if (!usernameSnapshot.empty) {
                usernameError.textContent = "Nombre de usuario en uso.";
                return;
            }

            // Crear usuario
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const userRef = collection(db, "users");
            await userRef.add({
                uid: cred.user.uid,
                username,
                email
            });

            alert("Registro exitoso");
            window.location.href = "index.html";
        } catch (error) {
            console.error(error);
            emailError.textContent = error.message || "Error al registrar.";
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

        const emailError = document.getElementById("login-email-error");
        const passwordError = document.getElementById("login-password-error");
        emailError.textContent = "";
        passwordError.textContent = "";

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Inicio de sesión exitoso");
            window.location.href = "index.html";
        } catch (error) {
            console.error(error);
            if (error.code === "auth/user-not-found") {
                emailError.textContent = "Correo no registrado.";
            } else if (error.code === "auth/wrong-password") {
                passwordError.textContent = "Contraseña incorrecta.";
            } else {
                passwordError.textContent = "Error inesperado.";
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
                await collection(db, "users").add({
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || "UsuarioGoogle"
                });
            }

            alert("Inicio con Google exitoso");
            window.location.href = "index.html";
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
        window.location.href = "index.html";
    }
});
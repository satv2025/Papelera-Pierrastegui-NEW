// Firebase: Registro y Login
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Registrar usuario
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("register-password").value;
        const username = document.getElementById("username").value;

        const emailError = document.getElementById("email-error");
        const usernameError = document.getElementById("username-error");

        // Limpiar mensajes de error previos
        emailError.textContent = "";
        usernameError.textContent = "";

        try {
            // Verificar si el correo ya está registrado
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                emailError.textContent = "Este correo electrónico ya está registrado.";
                return;
            }

            // Verificar si el nombre de usuario ya está registrado
            const usernameQuery = query(collection(db, "users"), where("username", "==", username));
            const usernameSnapshot = await getDocs(usernameQuery);

            if (!usernameSnapshot.empty) {
                usernameError.textContent = "Este nombre de usuario ya está en uso.";
                return;
            }

            // Crear el usuario con Firebase Authentication
            await createUserWithEmailAndPassword(auth, email, password);

            // Guardar el nuevo usuario en Firestore (agregar nombre de usuario)
            const user = auth.currentUser;
            const userRef = collection(db, "users");
            await userRef.add({
                uid: user.uid,
                username: username,
                email: email,
            });

            alert("Registro exitoso");
            window.location.href = "index.html"; // Redirige al inicio
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
}

// Iniciar sesión
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("login-password").value;

        const emailError = document.getElementById("login-email-error");
        const passwordError = document.getElementById("login-password-error");

        // Limpiar mensajes de error previos
        emailError.textContent = "";
        passwordError.textContent = "";

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Inicio de sesión exitoso");
                window.location.href = "index.html"; // Redirige al inicio
            })
            .catch(error => {
                console.error(error);
                if (error.code === "auth/user-not-found") {
                    emailError.textContent = "Este correo electrónico no está registrado.";
                } else if (error.code === "auth/wrong-password") {
                    passwordError.textContent = "La contraseña es incorrecta.";
                } else {
                    passwordError.textContent = "Ocurrió un error. Intenta nuevamente.";
                }
            });
    });
}

// Comprobación del estado de la autenticación
onAuthStateChanged(auth, user => {
    if (user) {
        // Si ya está autenticado, redirigir a index.html (evitar que vuelva a la página de login/registro)
        window.location.href = "index.html";
    }
});
// ==============================
// auth.js — Manejo completo de Login / Registro con Supabase
// ==============================

import { supabase } from "./supabaseClient.js";
const ROOT_HOME = "https://papelerapierrastegui.com.ar/";

// Utilidad para leer los valores de los <div contenteditable>
const getInputValue = (id) => document.getElementById(id)?.textContent.trim();

/* ==============================
   🔹 REGISTRO
   ============================== */
export const handleRegister = async () => {
    const username = getInputValue("username");
    const nombre = getInputValue("nombre");
    const email = getInputValue("email");
    const password = getInputValue("password");

    if (!username || !nombre || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    // Crear usuario en Supabase Auth (sin verificación de correo)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: ROOT_HOME,
            data: { username, nombre_completo: nombre },
        },
    });

    if (error) {
        alert("Error: " + error.message);
        return;
    }

    if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            username,
            nombre_completo: nombre,
            email,
        });

        if (profileError) {
            console.error(profileError);
            alert("Hubo un problema al guardar tu perfil.");
        } else {
            alert("Registro exitoso. ¡Bienvenido!");
            window.location.href = ROOT_HOME;
        }
    }
};

/* ==============================
   🔹 LOGIN
   ============================== */
export const handleLogin = async () => {
    const email = getInputValue("email");
    const password = getInputValue("password");

    if (!email || !password) {
        alert("Por favor completa ambos campos.");
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Error al iniciar sesión: " + error.message);
    } else {
        window.location.href = ROOT_HOME;
    }
};

/* ==============================
   🔹 GOOGLE AUTH
   ============================== */
export const googleHandler = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: ROOT_HOME },
        });

        if (error) {
            console.error("Error en Google Sign-In:", error.message);
            alert("Error: " + error.message);
        }
    } catch (err) {
        console.error("Error general en Google Sign-In:", err);
        alert(err.message || "Error en Google Sign-In.");
    }
};

/* ==============================
   🔹 AUTO-REDIRECCIÓN SI YA ESTÁ LOGUEADO
   ============================== */
const checkAuthState = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
        window.location.replace(ROOT_HOME);
    }
};

/* ==============================
   🔹 EVENT LISTENERS
   ============================== */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-register")?.addEventListener("click", handleRegister);
    document.getElementById("btn-login")?.addEventListener("click", handleLogin);
    document.getElementById("btn-login-google")?.addEventListener("click", googleHandler);
    document.getElementById("btn-register-google")?.addEventListener("click", googleHandler);
    checkAuthState();
});
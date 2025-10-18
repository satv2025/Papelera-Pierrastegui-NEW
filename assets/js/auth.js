// ==============================
// 🔹 Importar Supabase Client
// ==============================
import { supabase } from "./supabaseClient.js";

const ROOT_HOME = "https://papelerapierrastegui.com.ar/";

/* ==============================
   🔹 REGISTRO con Email y Password
   ============================== */
export const handleRegister = async () => {
    const username = document.getElementById("username")?.value.trim();
    const nombre = document.getElementById("nombre")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!username || !nombre || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        // Crear usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: ROOT_HOME,
                data: { username, nombre_completo: nombre },
            },
        });

        if (error) throw error;

        // Crear o actualizar perfil en la tabla profiles
        if (data.user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert(
                    {
                        id: data.user.id,
                        username,
                        nombre_completo: nombre,
                        email,
                    },
                    { onConflict: "id" } // ✅ evita duplicados 409
                );

            if (profileError) throw profileError;

            alert("Registro exitoso. ¡Bienvenido!");
            window.location.href = ROOT_HOME;
        }
    } catch (err) {
        console.error("Error en registro:", err);
        alert("Error: " + (err.message || "No se pudo completar el registro."));
    }
};

/* ==============================
   🔹 LOGIN con Email y Password
   ============================== */
export const handleLogin = async () => {
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        alert("Por favor completa ambos campos.");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        window.location.href = ROOT_HOME;
    } catch (err) {
        console.error("Error en login:", err);
        alert("Error al iniciar sesión: " + (err.message || "Intenta nuevamente."));
    }
};

/* ==============================
   🔹 LOGIN / REGISTRO con Google
   ============================== */
export const googleHandler = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: ROOT_HOME },
        });

        if (error) throw error;
    } catch (err) {
        console.error("Error general en Google Sign-In:", err);
        alert(err.message || "Error en inicio con Google.");
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
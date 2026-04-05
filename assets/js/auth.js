// ==============================
// 🔹 Importar Supabase Client
// ==============================
import { auth as supabase } from "./supabaseClient.js";

const ROOT_HOME = "../../index.html";

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
        // 1️⃣ Crear usuario (Supabase Auth crea y autentica automáticamente)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username, nombre_completo: nombre } },
        });

        if (signUpError) throw signUpError;
        const user = signUpData?.user;
        if (!user) throw new Error("No se pudo crear el usuario.");

        console.log("🟢 Usuario creado y logueado:", user.email);

        // 2️⃣ Verificar si el perfil ya existe
        const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        // 3️⃣ Insertar perfil solo si no existe
        if (!existingProfile) {
            const { error: profileError } = await supabase.from("profiles").insert({
                id: user.id,
                username,
                nombre_completo: nombre,
                email,
            });
            if (profileError) throw profileError;
        }

        window.location.href = ROOT_HOME;

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

        alert("Inicio de sesión exitoso.");
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
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const nombreInput = document.getElementById("nombre");
const usuarioInput = document.getElementById("usuario");
const emailInput = document.getElementById("email");
const nameDisplay = document.getElementById("profile-name");
const emailDisplay = document.getElementById("profile-email");
const form = document.getElementById("profile-form");
const logoutBtn = document.getElementById("cerrar-sesion");
const passBtn = document.getElementById("cambiar-pass");
const messageBox = document.getElementById("profile-message");

/* 🎨 Toma los colores desde las variables CSS */
const getCSSColor = (variable) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

/* 📣 Muestra mensajes con colores Pierrastegui */
const showMessage = (text, type = "success") => {
    const color =
        type === "error"
            ? getCSSColor("--rojo-pierrastegui")
            : getCSSColor("--verde-pierrastegui");

    messageBox.textContent = text;
    messageBox.style.backgroundColor = color;
    messageBox.style.color = "#ffffff"; // texto blanco siempre
    messageBox.className = `profile-message show ${type}`;

    setTimeout(() => {
        messageBox.classList.remove("show");
    }, 3000);
};

/* 🔒 Verifica sesión */
const { data: session } = await supabase.auth.getSession();
const user = session?.session?.user;

if (!user) {
    window.location.href = "/login";
}

/* 🧠 Carga datos */
nameDisplay.textContent =
    user.user_metadata?.nombre_completo || "Usuario Pierrastegui";
emailDisplay.textContent = user.email;
nombreInput.value = user.user_metadata?.nombre_completo || "";
usuarioInput.value = user.user_metadata?.username || "";
emailInput.value = user.email;

/* 💾 Guardar cambios */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
        data: {
            nombre_completo: nombreInput.value.trim(),
            username: usuarioInput.value.trim(),
        },
    });

    if (error) {
        showMessage("⚠️ Error al actualizar perfil: " + error.message, "error" ⚠️);
    } else {
        showMessage("✔️ Perfil actualizado correctamente.", "success" ✔️);
        setTimeout(() => window.location.reload(), 1500);
    }
});

/* 🔑 Cambiar contraseña */
passBtn.addEventListener("click", async () => {
    const newPassword = prompt("Escribí tu nueva contraseña:");
    if (!newPassword) return;

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        showMessage("⚠️ Error al cambiar la contraseña: " + error.message, "error");
    } else {
        showMessage("🔒 Contraseña actualizada correctamente.", "success");
    }
});

/* 🚪 Cerrar sesión */
logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
});
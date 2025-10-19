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

/* 🎨 Función para obtener colores o filtros CSS */
const getCSSVar = (variable) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();

/* 📣 Mostrar mensajes con estilo Pierrastegui */
const showMessage = (text, type = "success") => {
    const colorVar =
        type === "error"
            ? "--rojo-pierrastegui"
            : "--verde-pierrastegui";
    const filterVar =
        type === "error"
            ? "--filtro-rojo-pierrastegui"
            : "--filtro-verde-pierrastegui";

    // Reset
    messageBox.style.background = "transparent";
    messageBox.style.border = "none";
    messageBox.style.filter = "none";

    // Aplicar color o filtro según tipo
    messageBox.style.color = getCSSVar(colorVar);
    messageBox.style.filter = getCSSVar(filterVar);
    messageBox.textContent = text;

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
        showMessage("Error al actualizar el perfil: " + error.message, "error");
    } else {
        showMessage("Perfil actualizado correctamente.", "success");
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
        showMessage("Error al cambiar la contraseña: " + error.message, "error");
    } else {
        showMessage("Contraseña actualizada correctamente.", "success");
    }
});

/* 🚪 Cerrar sesión */
logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
});
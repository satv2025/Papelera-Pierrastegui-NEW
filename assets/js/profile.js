import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const nombreInput = document.getElementById("nombre");
const usuarioInput = document.getElementById("usuario");
const emailInput = document.getElementById("email");
const nameDisplay = document.getElementById("profile-name");
const emailDisplay = document.getElementById("profile-email");
const form = document.getElementById("profile-form");
const logoutBtn = document.getElementById("cerrar-sesion");
const messageBox = document.getElementById("profile-message");
const newPasswordInput = document.getElementById("new-password");

/* 🎨 Obtener variables CSS */
const getCSSVar = (variable) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();

/* 📣 Mostrar mensajes con estilo Pierrastegui */
const showMessage = (text, type = "success") => {
    const colorVar =
        type === "error" ? "--rojo-pierrastegui" : "--verde-pierrastegui";
    const filterVar =
        type === "error"
            ? "--filtro-rojo-pierrastegui"
            : "--filtro-verde-pierrastegui";

    messageBox.style.background = "transparent";
    messageBox.style.border = "none";
    messageBox.style.filter = "none";

    messageBox.style.color = getCSSVar(colorVar);
    messageBox.style.filter = getCSSVar(filterVar);
    messageBox.textContent = text;

    messageBox.classList.add("show");
    clearTimeout(messageBox.hideTimeout);
    messageBox.hideTimeout = setTimeout(() => {
        messageBox.classList.remove("show");
    }, 3000);
};

/* 🔒 Verifica sesión */
const { data: session } = await supabase.auth.getSession();
const user = session?.session?.user;

if (!user) {
    window.location.href = "/login";
}

/* 🧠 Cargar datos usuario */
nameDisplay.textContent =
    user.user_metadata?.nombre_completo || "Usuario Pierrastegui";
emailDisplay.textContent = user.email;
nombreInput.value = user.user_metadata?.nombre_completo || "";
usuarioInput.value = user.user_metadata?.username || "";
emailInput.value = user.email;

/* 💾 Guardar cambios */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreNuevo = nombreInput.value.trim();
    const usuarioNuevo = usuarioInput.value.trim();
    const nuevaPass = newPasswordInput.value.trim();

    // Se arma el objeto con solo los campos que tienen cambios
    const dataToUpdate = {};

    if (nombreNuevo && nombreNuevo !== user.user_metadata?.nombre_completo) {
        dataToUpdate.nombre_completo = nombreNuevo;
    }
    if (usuarioNuevo && usuarioNuevo !== user.user_metadata?.username) {
        dataToUpdate.username = usuarioNuevo;
    }

    let updateError = null;

    // Actualizar metadatos si hay cambios
    if (Object.keys(dataToUpdate).length > 0) {
        const { error } = await supabase.auth.updateUser({ data: dataToUpdate });
        if (error) updateError = error;
    }

    // Cambiar contraseña si se ingresó una nueva
    if (nuevaPass) {
        const { error } = await supabase.auth.updateUser({ password: nuevaPass });
        if (error) updateError = error;
    }

    if (updateError) {
        showMessage("❌ Error al actualizar los datos ❌", "error");
    } else {
        showMessage("✔️ Cambios guardados correctamente ✔️", "success");
        newPasswordInput.value = "";
        setTimeout(() => window.location.reload(), 1500);
    }
});

/* 🚪 Cerrar sesión */
logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
});
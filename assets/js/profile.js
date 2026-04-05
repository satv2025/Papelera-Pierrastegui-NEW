import { auth as supabase } from "./supabaseClient.js";

const nombreInput = document.getElementById("nombre");
const usuarioInput = document.getElementById("usuario");
const emailInput = document.getElementById("email");
const nameDisplay = document.getElementById("profile-name");
const emailDisplay = document.getElementById("profile-email");
const form = document.getElementById("profile-form");
const logoutBtn = document.getElementById("cerrar-sesion");
const messageBox = document.getElementById("profile-message");
const newPasswordInput = document.getElementById("new-password");

/* 🎨 Mostrar mensajes */
const showMessage = (text, type = "success") => {
    messageBox.textContent = text;
    messageBox.style.color = type === "error" ? "red" : "#28a745";
    messageBox.classList.add("show");
    clearTimeout(messageBox.hideTimeout);
    messageBox.hideTimeout = setTimeout(() => messageBox.classList.remove("show"), 3000);
};

/* 🔒 Verifica sesión */
const { data: session } = await supabase.auth.getSession();
const user = session?.session?.user;

if (!user) window.location.href = "/login";

/* 🧠 Cargar datos usuario */
nameDisplay.textContent = user.user_metadata?.nombre_completo || "Usuario Pierrastegui";
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

    const dataToUpdate = {};
    if (nombreNuevo && nombreNuevo !== user.user_metadata?.nombre_completo) dataToUpdate.nombre_completo = nombreNuevo;
    if (usuarioNuevo && usuarioNuevo !== user.user_metadata?.username) dataToUpdate.username = usuarioNuevo;

    let updateError = null;

    if (Object.keys(dataToUpdate).length > 0) {
        const { error } = await supabase.auth.updateUser({ data: dataToUpdate });
        if (error) updateError = error;
    }

    if (nuevaPass) {
        const { error } = await supabase.auth.updateUser({ password: nuevaPass });
        if (error) updateError = error;
    }

    if (updateError) showMessage("❌ Error al actualizar los datos ❌", "error");
    else {
        showMessage("✔️ Cambios guardados correctamente ✔️");
        setTimeout(() => window.location.reload(), 1500);
    }
});

/* 🚪 Cerrar sesión */
logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
});

/* 🧾 HISTORIAL DE COMPRAS */
async function loadOrders() {
    const container = document.getElementById("orders-container");
    container.innerHTML = "<p>Cargando tus compras...</p>";

    const { data: orders, error } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ordered")
        .order("updated_at", { ascending: false });

    if (error) {
        container.innerHTML = `<p style="color:red;">Error al cargar: ${error.message}</p>`;
        return;
    }

    if (!orders.length) {
        container.innerHTML = `<p class="no-orders">Aún no realizaste compras.</p>`;
        return;
    }

    container.innerHTML = orders
        .map(
            (o) => `
      <div class="order-card">
        <h4>Pedido #${o.id}</h4>
        <p><strong>Fecha:</strong> ${new Date(o.updated_at).toLocaleDateString("es-AR")}</p>
        <p><strong>Total:</strong> $${o.total.toLocaleString("es-AR")}</p>
        <div class="order-items">
          ${o.items
                    .map(
                        (it) => `
            <div class="order-item">
              <span>${it.nombre} (${it.size}) ×${it.cantidad}</span>
              <span>$${it.subtotal.toLocaleString("es-AR")}</span>
            </div>`
                    )
                    .join("")}
        </div>
      </div>`
        )
        .join("");
}

/* 🧩 Tabs */
document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");

        if (btn.dataset.tab === "historial") loadOrders();
    });
});

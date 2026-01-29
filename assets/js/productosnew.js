/* =====================================================
   CLIENTES
===================================================== */

import { supabase as auth } from "/assets/js/supabaseClient.js"; // login
const db = window.sb; // productos

/* =====================================================
   CSS DINÁMICO
===================================================== */
(function () {
    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");
    const slug = qs.get("slug") || qs.get("nombre") || "";

    const css = document.getElementById("todo-css");
    if (css) {
        css.href =
            `assets/css/todo-en-uno.css?pid=${encodeURIComponent(id || "")}&slug=${encodeURIComponent(slug || "")}`;
    }
})();

/* =====================================================
   TODO UNIFICADO
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ========= PRODUCTO (DB)
    ===================================================== */

    const img = document.getElementById("producto-img");
    const nombre = document.getElementById("producto-nombre");
    const desc = document.getElementById("producto-desc");

    const decBtn = document.getElementById("decrementar");
    const incBtn = document.getElementById("incrementar");
    const cantidadVisual = document.getElementById("cantidad-visual");
    const totalDisplay = document.getElementById("totalDisplay");

    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");

    if (!id) return;

    const { data: p, error } =
        await db.from("productos").select("*").eq("id", id).maybeSingle();

    if (error || !p) return;

    /* ===== RENDER BASICO ===== */

    document.title = `${p.nombre} | Papelera Pierrastegui`;
    if (nombre) nombre.textContent = p.nombre;
    if (desc) desc.textContent = p.descripcion || "";
    if (img) img.src = p.imagen || "";

    /* =====================================================
       ========= PRECIO + CANTIDAD (RESTORE COMPLETO)
    ===================================================== */

    let cantidad = 1;

    const money = n =>
        "$" + Number(n || 0).toLocaleString("es-AR");

    function getPrecioUnitario() {
        return p.precio_unidad || 0;
    }

    function updateTotal() {
        if (!totalDisplay) return;

        const total = getPrecioUnitario() * cantidad;
        totalDisplay.textContent = "Total: " + money(total);
    }

    if (cantidadVisual) cantidadVisual.textContent = cantidad;

    if (incBtn) {
        incBtn.onclick = () => {
            cantidad++;
            cantidadVisual.textContent = cantidad;
            updateTotal();
        };
    }

    if (decBtn) {
        decBtn.onclick = () => {
            if (cantidad > 1) cantidad--;
            cantidadVisual.textContent = cantidad;
            updateTotal();
        };
    }

    updateTotal(); // 🔥 IMPORTANTE — pinta precio inicial

    /* =====================================================
       ========= AUTH (LOGIN PROJECT)
    ===================================================== */

    const accountContainer =
        document.querySelector(".pp-account") ||
        document.getElementById("account-container");

    const mobileAccountBtn =
        document.getElementById("mobile-account");

    function renderLoggedOut() {
        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <a class="btn-login" href="/login">Acceder</a>
        `;
    }

    function renderLoggedIn(user) {
        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <div class="account-dropdown">
                <button class="account-trigger">${user.email}</button>
                <div class="account-menu">
                    <a href="/perfil">Editar perfil</a>
                    <button id="logout-btn">Cerrar sesión</button>
                </div>
            </div>
        `;

        document.getElementById("logout-btn").onclick = async () => {
            await auth.auth.signOut();
            location.href = "/";
        };
    }

    async function checkAuth() {
        const { data } = await auth.auth.getSession();
        data.session?.user
            ? renderLoggedIn(data.session.user)
            : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn(s.user) : renderLoggedOut();
    });

    if (mobileAccountBtn) {
        mobileAccountBtn.onclick = async () => {
            const { data } = await auth.auth.getSession();
            location.href = data.session ? "/perfil" : "/login";
        };
    }

});
/* =========================================================
   PAPELERA PIERRASTEGUI – SISTEMA COMPLETO (JS ÚNICO)
   - Menú mobile (generado)
   - Barra inferior (generada)
   - Badge en barra mobile (NO en header)
   - Carrito + login + estilos embebidos
========================================================= */

import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

/* ===========================
   HELPERS
=========================== */
const toARS = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

/* ===========================
   INYECTAR CSS (TODO AQUÍ)
=========================== */
const style = document.createElement("style");
style.innerHTML = `
/* --- bottom bar --- */
.mobile-bottom-bar{
  position:fixed; bottom:0; left:0; width:100%;
  background:#ff7600;
  display:flex; justify-content:space-around; align-items:center;
  padding:10px 0; z-index:9999;
}
.mobile-item{ position:relative; display:flex; align-items:center; justify-content:center; }
.mobile-item img{ width:26px; height:26px; filter:brightness(0) invert(1); }
#mobile-menu-btn{ color:#fff; font-size:22px; line-height:1; user-select:none; }

/* badge mobile */
.mobile-cart-badge {
    position: absolute;
    top: -6px;
    right: -10px;
    min-width: 1em;
    height: 1.7em;
    padding: 0 5px;
    border-radius: 999px;
    background: #ff7600;
    border: 2px solid;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- menu overlay --- */
.mobile-menu{
  position:fixed; inset:0; background:#fff;
  transform:translateY(100%);
  transition:transform .3s ease;
  z-index:10000;
  display:flex; flex-direction:column;
}
.mobile-menu.active{ transform:translateY(0); }

.mobile-menu-header{
  padding:16px;
  font-size:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #ddd;
}
.mobile-menu-header button{
  background:none; border:none; font-size:24px; cursor:pointer;
}

.mobile-search{ padding:15px; border-bottom:1px solid #eee; }
.mobile-search input{
  width:100%;
  padding:12px;
  border-radius:6px;
  border:1px solid #ccc;
}

/* contenido clonado */
#mobileMenuContent{
  padding:15px 15px 110px;
  overflow-y:auto;
}

/* ocultar desktop */
@media (min-width:769px){
  .mobile-bottom-bar, .mobile-menu{ display:none !important; }
}
`;
document.head.appendChild(style);

/* ======================================================
   UI MOBILE (GENERADO POR JS)
====================================================== */
let mobileEls = {
    menu: null,
    mobileBadge: null,
};

document.addEventListener("DOMContentLoaded", () => {
    // --- Barra inferior
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mobile-cart" aria-label="Carrito" role="button" tabindex="0">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/carrito.svg" alt="Carrito">
      <span class="mobile-cart-badge" id="mobile-cart-badge">0</span>
    </div>

    <a class="mobile-item" href="https://www.instagram.com/pierrastegui.papelera" target="_blank" aria-label="Instagram">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/instagram.svg" alt="Instagram">
    </a>

    <a class="mobile-item" href="https://wa.me/541123054613" target="_blank" aria-label="WhatsApp">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/whatsapp.svg" alt="WhatsApp">
    </a>

    <div class="mobile-item" id="mobile-account" aria-label="Mi cuenta" role="button" tabindex="0">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/account.svg" alt="Mi cuenta">
    </div>

    <div class="mobile-item" id="mobile-menu-btn" aria-label="Abrir menú" role="button" tabindex="0">☰</div>
  `;
    document.body.appendChild(bar);

    // --- Menú fullscreen
    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.id = "mobileMenu";
    menu.innerHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMobileMenu" aria-label="Cerrar menú">✕</button>
    </div>

    <div class="mobile-search">
      <!-- IMPORTANTE: MISMO ID PARA TU SCRIPT DE FILTRO -->
      <input id="search-input" placeholder="Buscar productos...">
    </div>

    <div id="mobileMenuContent"></div>
  `;
    document.body.appendChild(menu);

    // Guardar refs
    mobileEls.menu = menu;
    mobileEls.mobileBadge = document.getElementById("mobile-cart-badge");

    // Clonar menú real
    const desktopMenu = document.querySelector(".nav-items");
    const mobileMenuContent = document.getElementById("mobileMenuContent");
    if (desktopMenu && mobileMenuContent) {
        mobileMenuContent.innerHTML = desktopMenu.innerHTML;
    }

    // Eventos menú
    document.getElementById("mobile-menu-btn").onclick = () => menu.classList.add("active");
    document.getElementById("closeMobileMenu").onclick = () => menu.classList.remove("active");

    // Carrito (abre tu dropcart real)
    document.getElementById("mobile-cart").onclick = () => {
        document.getElementById("cart-toggle")?.click();
    };

    // Cuenta (si no logueado => /login, si logueado => abre dropdown)
    document.getElementById("mobile-account").onclick = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return (location.href = "/login");

        // abre dropdown existente
        document.querySelector(".mi-cuenta .btn-login")?.click();
    };

    // Render inicial del badge
    renderCart();
});

/* ======================================================
   CARRITO (DB / LOCALSTORAGE)
====================================================== */
const CART_KEY = "pp_cart";

async function getUser() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user || null;
}

async function dbGetCart() {
    const user = await getUser();
    if (!user) return JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    const { data } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

    return data?.items || [];
}

async function dbSaveCart(items) {
    const user = await getUser();
    if (!user) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        return;
    }

    await supabase.from("carts").upsert({
        user_id: user.id,
        items,
        status: "active",
        updated_at: new Date()
    });
}

/* ======================================================
   DROPCART UI (usa tus IDs existentes)
====================================================== */
const els = {
    panel: document.getElementById("dropcart"),
    items: document.getElementById("dropcart-items"),
    total: document.getElementById("dropcart-total"),
};

async function renderCart() {
    const cart = await dbGetCart();
    const total = cart.reduce((a, b) => a + (b.subtotal || 0), 0);
    const count = cart.reduce((a, b) => a + (b.cantidad || 0), 0);

    // ✅ Badge SOLO en mobile bar
    if (mobileEls.mobileBadge) mobileEls.mobileBadge.textContent = String(count);

    // Si no está el panel, solo badge y listo
    if (!els.items || !els.total) return;

    if (!cart.length) {
        els.items.innerHTML = "<p class='empty'>Tu carrito está vacío</p>";
        els.total.textContent = "$0";
        return;
    }

    els.items.innerHTML = "";
    cart.forEach((it, i) => {
        els.items.innerHTML += `
      <div class="dropcart-item">
        <img src="${it.img}">
        <div>
          <div class="dropcart-title">${it.nombre}</div>
          <div class="dropcart-sub">${it.size || ""} • ${it.tipoLabel || it.tipo || ""}</div>
          <div class="dropcart-qty">
            <span class="cart-action" data-act="dec" data-i="${i}">−</span>
            <span>${it.cantidad}</span>
            <span class="cart-action" data-act="inc" data-i="${i}">+</span>
            <span class="cart-action" data-act="rm" data-i="${i}">Eliminar</span>
          </div>
        </div>
        <div class="dropcart-price">${toARS(it.subtotal || 0)}</div>
      </div>
    `;
    });

    els.total.textContent = toARS(total);
}

/* ======================================================
   ACCIONES DEL CARRITO (MISMA LÓGICA QUE TU V4)
====================================================== */
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".cart-action");
    if (!btn) return;

    const index = Number(btn.dataset.i);
    const action = btn.dataset.act;

    const cart = await dbGetCart();
    if (!cart[index]) return;

    if (action === "inc") cart[index].cantidad++;
    if (action === "dec") cart[index].cantidad = Math.max(1, cart[index].cantidad - 1);
    if (action === "rm") cart.splice(index, 1);

    cart.forEach((p) => (p.subtotal = (p.cantidad || 0) * (p.precioUnit || 0)));

    await dbSaveCart(cart);
    renderCart();
});

/* ======================================================
   INIT (si DOM ya cargó igual actualiza badge)
====================================================== */
renderCart();
/* =========================================================
   PAPELERA PIERRASTEGUI – SISTEMA COMPLETO (JS ÚNICO)
   Incluye:
   - Menú mobile
   - Barra inferior
   - Carrito
   - Login
   - Estilos embebidos
========================================================= */

import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

/* ===========================
   INYECTAR CSS
=========================== */
const style = document.createElement("style");
style.innerHTML = `
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ff7600;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  z-index: 9999;
}
.mobile-item img {
  width: 26px;
  filter: brightness(0) invert(1);
}
.mobile-menu {
  position: fixed;
  inset: 0;
  background: #fff;
  transform: translateY(100%);
  transition: 0.3s ease;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}
.mobile-menu.active { transform: translateY(0); }
.mobile-menu-header {
  padding: 16px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}
.mobile-search { padding: 15px; }
.mobile-search input {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
#mobileMenuContent { padding: 15px; }
@media (min-width: 769px) {
  .mobile-bottom-bar,
  .mobile-menu { display: none !important; }
}
`;
document.head.appendChild(style);

/* ===========================
   CREAR UI
=========================== */
document.addEventListener("DOMContentLoaded", () => {

    /* BARRA */
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mobile-cart">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/carrito.svg">
    </div>
    <a class="mobile-item" href="https://www.instagram.com/pierrastegui.papelera" target="_blank">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/instagram.svg">
    </a>
    <a class="mobile-item" href="https://wa.me/541123054613" target="_blank">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/whatsapp.svg">
    </a>
    <div class="mobile-item" id="mobile-account">
      <img src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/account.svg">
    </div>
    <div class="mobile-item" id="mobile-menu-btn">☰</div>
  `;
    document.body.appendChild(bar);

    /* MENÚ */
    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.innerHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMobileMenu">✕</button>
    </div>
    <div class="mobile-search">
      <input id="search-input" placeholder="Buscar productos...">
    </div>
    <div id="mobileMenuContent"></div>
  `;
    document.body.appendChild(menu);

    // Clonar menú desktop
    const desktopMenu = document.querySelector(".nav-items");
    if (desktopMenu) {
        document.getElementById("mobileMenuContent").innerHTML = desktopMenu.innerHTML;
    }

    /* EVENTOS */
    document.getElementById("mobile-menu-btn").onclick = () =>
        menu.classList.add("active");

    document.getElementById("closeMobileMenu").onclick = () =>
        menu.classList.remove("active");

    document.getElementById("mobile-cart").onclick = () =>
        document.getElementById("cart-toggle")?.click();

    document.getElementById("mobile-account").onclick = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return location.href = "/login";
        document.querySelector(".mi-cuenta .btn-login")?.click();
    };
});

/* ======================================================
   CARRITO (INTEGRADO)
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
    if (!user) return localStorage.setItem(CART_KEY, JSON.stringify(items));

    await supabase.from("carts").upsert({
        user_id: user.id,
        items,
        status: "active"
    });
}

const els = {
    toggle: document.getElementById("cart-toggle"),
    panel: document.getElementById("dropcart"),
    badge: document.getElementById("cart-badge"),
    items: document.getElementById("dropcart-items"),
    total: document.getElementById("dropcart-total")
};

async function renderCart() {
    const cart = await dbGetCart();
    const total = cart.reduce((a, b) => a + b.subtotal, 0);
    const count = cart.reduce((a, b) => a + b.cantidad, 0);

    if (els.badge) els.badge.textContent = count;
    if (!els.items) return;

    els.items.innerHTML = cart.length
        ? cart.map(p => `
      <div class="dropcart-item">
        <img src="${p.img}">
        <div>
          <div class="dropcart-title">${p.nombre}</div>
          <div class="dropcart-sub">${p.tipo}</div>
          <div class="dropcart-qty">
            <span class="cart-action" data-i="${p.id}" data-a="dec">−</span>
            <span>${p.cantidad}</span>
            <span class="cart-action" data-i="${p.id}" data-a="inc">+</span>
          </div>
        </div>
        <div class="dropcart-price">${toARS(p.subtotal)}</div>
      </div>`).join("")
        : "<p class='empty'>Tu carrito está vacío</p>";

    els.total.textContent = toARS(total);
}

/* ======================================================
   INIT
====================================================== */
renderCart();
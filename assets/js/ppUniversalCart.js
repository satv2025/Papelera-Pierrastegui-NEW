/* ======================================================
   PAPELERA PIERRASTEGUI – SISTEMA COMPLETO
   MENÚ + CARRITO + LOGIN + MOBILE
====================================================== */

import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

/* -----------------------------------------------------
   HELPERS
----------------------------------------------------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const safeNum = (v) => Number(v) || 0;
const parseMoney = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
const toARS = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

/* -----------------------------------------------------
   CREAR BARRA INFERIOR + MENU MOBILE
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
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

    // Clonar menú real
    const desktopMenu = document.querySelector(".nav-items");
    if (desktopMenu) {
        document.getElementById("mobileMenuContent").innerHTML = desktopMenu.innerHTML;
    }

    document.getElementById("mobile-menu-btn").onclick = () => menu.classList.add("active");
    document.getElementById("closeMobileMenu").onclick = () => menu.classList.remove("active");

    // Cuenta
    document.getElementById("mobile-account").onclick = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return location.href = "/login";
        document.querySelector(".mi-cuenta .btn-login")?.click();
    };

    // Carrito
    document.getElementById("mobile-cart").onclick = () =>
        document.getElementById("cart-toggle")?.click();
});

/* -----------------------------------------------------
   CARRITO (BASE COMPLETA)
----------------------------------------------------- */
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

const els = {
    toggle: $("#cart-toggle"),
    panel: $("#dropcart"),
    badge: $("#cart-badge"),
    items: $("#dropcart-items"),
    total: $("#dropcart-total"),
    close: $("#dropcart-close"),
    empty: $("#dropcart-empty")
};

async function renderCart() {
    const cart = await dbGetCart();
    const total = cart.reduce((a, b) => a + b.subtotal, 0);
    const count = cart.reduce((a, b) => a + b.cantidad, 0);

    if (els.badge) els.badge.textContent = count;
    if (!cart.length) {
        els.items.innerHTML = "<p class='empty'>Tu carrito está vacío</p>";
        els.total.textContent = "$0";
        return;
    }

    els.items.innerHTML = "";
    cart.forEach((p, i) => {
        els.items.innerHTML += `
      <div class="dropcart-item">
        <img src="${p.img}">
        <div>
          <div class="dropcart-title">${p.nombre}</div>
          <div class="dropcart-sub">${p.tipo}</div>
          <div class="dropcart-qty">
            <span class="cart-action" data-i="${i}" data-a="dec">−</span>
            <span>${p.cantidad}</span>
            <span class="cart-action" data-i="${i}" data-a="inc">+</span>
            <span class="cart-action" data-i="${i}" data-a="rm">Eliminar</span>
          </div>
        </div>
        <div class="dropcart-price">${toARS(p.subtotal)}</div>
      </div>`;
    });
}

document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".cart-action");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const cart = await dbGetCart();
    if (btn.dataset.a === "inc") cart[i].cantidad++;
    if (btn.dataset.a === "dec") cart[i].cantidad = Math.max(1, cart[i].cantidad - 1);
    if (btn.dataset.a === "rm") cart.splice(i, 1);
    cart.forEach(p => p.subtotal = p.cantidad * p.precioUnit);
    await dbSaveCart(cart);
    renderCart();
});

els.toggle?.addEventListener("click", () => els.panel.classList.toggle("show"));
els.close?.addEventListener("click", () => els.panel.classList.remove("show"));

renderCart();
/* ======================================================
   IMPORTS
====================================================== */
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

/* ======================================================
   HELPERS
====================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const safeNum = (v) => Number(v) || 0;
const parseMoney = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;

const toARS = (n) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

/* ======================================================
   MOBILE MENU (BOTTOM BAR)
====================================================== */

const mobileMenu = $("#mobileMenu");
const openMenu = $("#mobile-menu-btn");
const closeMenu = $("#closeMobileMenu");

openMenu?.addEventListener("click", () => mobileMenu.classList.add("active"));
closeMenu?.addEventListener("click", () => mobileMenu.classList.remove("active"));

/* Clonar menú principal */
const desktopMenu = document.querySelector(".nav-items");
const mobileMenuContent = document.getElementById("mobileMenuContent");

if (desktopMenu && mobileMenuContent) {
    mobileMenuContent.innerHTML = desktopMenu.innerHTML;
}

/* ======================================================
   LOGIN / CUENTA
====================================================== */
const mobileAccount = document.getElementById("mobile-account");

async function initAccount() {
    const { data: session } = await supabase.auth.getSession();

    if (!mobileAccount) return;

    mobileAccount.onclick = () => {
        if (!session?.session) {
            window.location.href = "/login";
        } else {
            document.querySelector(".mi-cuenta .btn-login")?.click();
        }
    };
}

initAccount();

/* ======================================================
   CARRITO (FULL)
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

/* ================= RENDER CART ================= */

const els = {
    toggle: document.getElementById("cart-toggle"),
    panel: document.getElementById("dropcart"),
    badge: document.getElementById("cart-badge"),
    items: document.getElementById("dropcart-items"),
    total: document.getElementById("dropcart-total"),
    close: document.getElementById("dropcart-close"),
    empty: document.getElementById("dropcart-empty")
};

async function renderCart() {
    const cart = await dbGetCart();
    const total = cart.reduce((a, b) => a + b.subtotal, 0);
    const count = cart.reduce((a, b) => a + b.cantidad, 0);

    if (els.badge) els.badge.textContent = count;

    if (!cart.length) {
        els.items.innerHTML = `<p class="empty">Tu carrito está vacío</p>`;
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

    els.total.textContent = toARS(total);
}

/* Acciones carrito */
els.items?.addEventListener("click", async (e) => {
    const btn = e.target.closest(".cart-action");
    if (!btn) return;

    const cart = await dbGetCart();
    const i = Number(btn.dataset.i);

    if (btn.dataset.a === "inc") cart[i].cantidad++;
    if (btn.dataset.a === "dec") cart[i].cantidad = Math.max(1, cart[i].cantidad - 1);
    if (btn.dataset.a === "rm") cart.splice(i, 1);

    cart.forEach(p => p.subtotal = p.cantidad * p.precioUnit);
    await dbSaveCart(cart);
    renderCart();
});

els.toggle?.addEventListener("click", () => els.panel.classList.toggle("show"));
els.close?.addEventListener("click", () => els.panel.classList.remove("show"));

/* ======================================================
   INIT
====================================================== */
renderCart();
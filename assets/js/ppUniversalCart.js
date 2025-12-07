/* ---------------------------------------------------------
      PAPELERA PIERRASTEGUI
      UNIVERSAL CART SCRIPT v4 (NORMAL)
      Compatible con TODO el catálogo del sitio
   --------------------------------------------------------- */

import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

console.log(
    "%c[PAPELERA PIERRASTEGUI] Universal Cart v4 cargado",
    "background:#008cff;color:#fff;padding:4px;border-radius:3px"
);

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const parseMoney = (str) =>
    Number(String(str).replace(/[^\d]/g, "")) || 0;

const toARS = (n) =>
    n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

/* ---------------------------------------------------------
   PRECIOS - DETECCIÓN AUTOMÁTICA
--------------------------------------------------------- */

/** Lee cualquier data-price* del dataset */
function getPriceFromDataset(el) {
    if (!el || !el.dataset) return 0;

    for (const [k, v] of Object.entries(el.dataset)) {
        if (k.toLowerCase().includes("price")) {
            const n = safeNum(v);
            if (n > 0) return n;
        }
    }
    return 0;
}

/** Precio según tipo: unidad, x50, x100, bulto, pack, etc */
function getPriceByType(sizeEl, tipo) {
    if (!sizeEl || !tipo) return 0;

    // Caso x50 → priceX50
    if (/^x\d+$/i.test(tipo)) {
        const digits = tipo.slice(1);
        return safeNum(sizeEl.dataset[`priceX${digits}`]);
    }

    const rules = {
        unidad: ["priceUnit", "priceUnidad", "price"],
        bulto: ["priceBulto", "priceMayorista", "price"],
        paquete: ["pricePaquete", "pricePack", "price"],
        pack: ["pricePack", "pricePaquete", "price"]
    };

    const keys = rules[tipo] || [
        "price" + tipo.charAt(0).toUpperCase() + tipo.slice(1)
    ];

    for (const k of keys) {
        const n = safeNum(sizeEl.dataset[k]);
        if (n > 0) return n;
    }

    return 0;
}

/* ---------------------------------------------------------
   SUPABASE / BASE DE DATOS
--------------------------------------------------------- */

const CART_KEY = "pp_cart";

async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

async function dbGetCart() {
    const user = await getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

    return data || null;
}

async function dbSaveCart(items) {
    const user = await getUser();
    const total = items.reduce((a, b) => a + b.subtotal, 0);

    if (!user) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        return;
    }

    await supabase.from("carts").upsert(
        {
            user_id: user.id,
            items,
            total,
            status: "active",
            updated_at: new Date()
        },
        { onConflict: "user_id,status" }
    );
}

async function readCart() {
    const user = await getUser();
    if (!user) return JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    const db = await dbGetCart();
    return db?.items || [];
}

async function writeCart(cart) {
    await dbSaveCart(cart);
}

/* ---------------------------------------------------------
   DROPCART UI (render, cantidad, actualizar)
--------------------------------------------------------- */

const els = {
    toggle: $("#cart-toggle"),
    panel: $("#dropcart"),
    badge: $("#cart-badge"),
    items: $("#dropcart-items"),
    total: $("#dropcart-total"),
    btnEmpty: $("#dropcart-empty"),
    btnClose: $("#dropcart-close")
};

async function renderCart() {
    const cart = await readCart();
    const total = cart.reduce((a, b) => a + b.subtotal, 0);
    const count = cart.reduce((a, b) => a + b.cantidad, 0);

    if (els.badge) els.badge.textContent = count;

    if (!cart.length) {
        els.items.innerHTML = `<p class="empty">Tu carrito está vacío</p>`;
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
          <div class="dropcart-sub">${it.size} • ${it.tipoLabel}</div>
          <div class="dropcart-qty">
            <span class="cart-action" data-act="dec" data-i="${i}">−</span>
            <span>${it.cantidad}</span>
            <span class="cart-action" data-act="inc" data-i="${i}">+</span>
            <span class="cart-action" data-act="rm" data-i="${i}">Eliminar</span>
          </div>
        </div>
        <div class="dropcart-price">${toARS(it.subtotal)}</div>
      </div>
    `;
    });

    els.total.textContent = toARS(total);
}

/* ---------------------------------------------------------
   UNIVERSAL ADD TO CART — CEREBRO PRINCIPAL
--------------------------------------------------------- */

document.body.addEventListener("click", async (e) => {
    const btn = e.target.closest(".agregar-carrito");
    if (!btn) return;

    const titulo = $(".producto-info h2")?.textContent?.trim() || "Producto";
    const img = $("#producto-img")?.src || "";
    const cantidad = Number($("#cantidad-visual")?.textContent || 1) || 1;

    /* Tamaño */
    const sizeEl = $("#size-dropdown .dropdown-item.selected");
    const hasSizes = $("#size-dropdown .dropdown-item") !== null;
    if (hasSizes && !sizeEl) return alert("Elegí un tamaño.");

    /* Tipo */
    const tipoEl = $("#tipo-dropdown .dropdown-item.selected");
    const tipoOptions = $$("#tipo-dropdown .dropdown-item");
    if (tipoOptions.length > 1 && !tipoEl) {
        return alert("Elegí un tipo.");
    }

    const size =
        sizeEl?.dataset.size || sizeEl?.textContent?.trim() || "N/A";
    const tipo =
        tipoEl?.dataset.type || "unidad";
    const tipoLabel =
        tipoEl?.textContent?.trim() || "Unidad";

    /* --- DETECTAR PRECIO --- */
    let precioUnit = 0;

    precioUnit ||= getPriceFromDataset(tipoEl);
    precioUnit ||= getPriceByType(sizeEl, tipo);
    precioUnit ||= getPriceFromDataset(sizeEl);

    // Fallback por total visible
    if (!precioUnit) {
        const totalShown = parseMoney($(".total")?.textContent);
        if (totalShown) precioUnit = Math.round(totalShown / cantidad);
    }

    if (!precioUnit) {
        alert("No se pudo detectar el precio del producto.");
        return;
    }

    /* --- AGREGAR AL CARRITO --- */
    const key = `${titulo}|${size}|${tipo}`;
    const cart = await readCart();

    const existing = cart.find((p) => p.key === key);
    if (existing) {
        existing.cantidad += cantidad;
        existing.subtotal = existing.cantidad * existing.precioUnit;
    } else {
        cart.push({
            key,
            nombre: titulo,
            size,
            tipo,
            tipoLabel,
            cantidad,
            precioUnit,
            subtotal: cantidad * precioUnit,
            img
        });
    }

    await writeCart(cart);
    await renderCart();

    els.panel?.classList.add("show");
});

/* ---------------------------------------------------------
   ACCIONES DEL CARRITO
--------------------------------------------------------- */

els.items.addEventListener("click", async (e) => {
    const btn = e.target.closest(".cart-action");
    if (!btn) return;

    const index = Number(btn.dataset.i);
    const action = btn.dataset.act;
    const cart = await readCart();

    if (!cart[index]) return;

    if (action === "inc") cart[index].cantidad++;
    if (action === "dec") cart[index].cantidad = Math.max(1, cart[index].cantidad - 1);
    if (action === "rm") cart.splice(index, 1);

    cart.forEach((p) => (p.subtotal = p.cantidad * p.precioUnit));

    await writeCart(cart);
    renderCart();
});

/* ---------------------------------------------------------
   PANEL UI (mostrar/ocultar)
--------------------------------------------------------- */

els.toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    els.panel.classList.toggle("show");
});

els.panel?.addEventListener("click", (e) => e.stopPropagation());

els.btnClose?.addEventListener("click", () => els.panel.classList.remove("show"));

document.addEventListener("click", () => els.panel.classList.remove("show"));

els.btnEmpty?.addEventListener("click", async () => {
    await writeCart([]);
    renderCart();
});

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */

renderCart();
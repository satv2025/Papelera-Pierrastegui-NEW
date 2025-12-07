// 📦 checkout.js FINAL COMPATIBLE CON UNIVERSAL CART v4
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// 📍 Ubicación de la tienda
const TIENDA_LAT = -34.661435;
const TIENDA_LON = -58.617912;

// ============================================================
// 🔐 SESIÓN DE USUARIO
// ============================================================
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// ============================================================
// 🔎 CART ID DESDE URL
// ============================================================
function getCartIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// ============================================================
// 🛒 LEER CARRITO ACTIVO DESDE SUPABASE
// ============================================================
async function loadActiveCart(userId) {
    const { data } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

    return data || null;
}

// ============================================================
// 🛒 GUARDA CARRITO (ACTUALIZA ITEMS)
// ============================================================
async function saveCart(cartId, items) {
    const total = items.reduce((a, b) => a + b.subtotal, 0);

    await supabase
        .from("carts")
        .update({
            items,
            total,
            updated_at: new Date()
        })
        .eq("id", cartId);
}

// ============================================================
// 💵 RENDER ITEMS
// ============================================================
function renderItems(cart, envioCosto = 0, metodoEnvio = "retiro") {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");
    cont.innerHTML = `<ul class="checkout-ul" style="padding:0;margin:0;"></ul>`;
    const ul = cont.querySelector(".checkout-ul");

    let subtotal = 0;

    cart.forEach((it, i) => {
        subtotal += it.subtotal;

        ul.innerHTML += `
            <li class="checkout-item">
                <div class="checkout-item-info">
                    <img src="${it.img}" class="checkout-item-img">
                    <div class="checkout-item-details">
                        <div class="checkout-item-title">${it.nombre} (${it.size}) ×${it.cantidad}</div>
                        <div class="checkout-item-desc">${it.tipoLabel || ""}</div>
                    </div>
                </div>
                <span class="checkout-item-subtotal">
                    ${it.subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                </span>
            </li>
        `;
    });

    const total = subtotal + envioCosto;

    if (metodoEnvio === "retiro") {
        totals.innerHTML = `
            <div>
                <span>Total:</span>
                <span class="precio-total">${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span>
            </div>
        `;
    } else {
        totals.innerHTML = `
            <div><span>Subtotal:</span>
                <span class="precio-subtotal">
                    ${subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                </span>
            </div>
            <div><span>Envío:</span>
                <span class="precio-envio">
                    ${envioCosto ? envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) : "Gratis"}
                </span>
            </div>
            <hr style="margin:.5em 0;border-color:#ff7600;">
            <div><span>Total:</span>
                <span class="precio-total">
                    ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                </span>
            </div>
        `;
    }

    return total;
}

// ============================================================
// 🚚 CÁLCULO DE ENVÍO (OSRM)
// ============================================================
async function calcularEnvio(lat, lon) {
    try {
        const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${TIENDA_LON},${TIENDA_LAT};${lon},${lat}?overview=false`
        );

        const data = await res.json();
        const dist = data.routes?.[0]?.distance || 0;
        const km = dist / 1000;

        return Math.round(300 + km * 100);
    } catch {
        return 0;
    }
}

// ============================================================
// 📍 AUTOCOMPLETADO DIRECCIONES
// ============================================================
async function buscarDirecciones(q) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ar&limit=5&q=${encodeURIComponent(q)}`
    );

    return await res.json();
}

// ============================================================
// 🚀 MAIN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {

    // --- 1) Usuario ---
    const user = await getUser();
    if (!user) {
        alert("Debés iniciar sesión para continuar.");
        return window.location.href = "/login";
    }

    let cartId = getCartIdFromQuery();
    let activeCart = await loadActiveCart(user.id);

    // ------------------------------------------------------------
    // 2) SI HAY CARTID EN URL PERO NO EXISTE → CREAR UNO NUEVO
    // ------------------------------------------------------------
    if (cartId && !activeCart) {
        const { data: nuevo } = await supabase
            .from("carts")
            .insert([{ user_id: user.id, items: [], status: "active" }])
            .select()
            .single();

        activeCart = nuevo;
        cartId = nuevo.id;

        const url = new URL(window.location);
        url.searchParams.set("id", cartId);
        window.history.replaceState({}, "", url);
    }

    // ------------------------------------------------------------
    // 3) SI NO HAY CARTID EN URL → USAR EL ACTIVO O CREAR NUEVO
    // ------------------------------------------------------------
    if (!cartId) {
        if (!activeCart) {
            const { data: nuevo } = await supabase
                .from("carts")
                .insert([{ user_id: user.id, items: [], status: "active" }])
                .select()
                .single();

            activeCart = nuevo;
        }

        cartId = activeCart.id;

        const url = new URL(window.location);
        url.searchParams.set("id", cartId);
        window.history.replaceState({}, "", url);
    }

    // ------------------------------------------------------------
    // 4) UNIFICAR CARRITO: SI ACTIVE CART VACÍO → MIGRAR LOCALSTORAGE
    // ------------------------------------------------------------
    let cart = activeCart.items || [];

    if (!cart.length) {
        const local = JSON.parse(localStorage.getItem("pp_cart") || "[]");

        if (local.length) {
            cart = local;
            await saveCart(cartId, cart);
        } else {
            alert("Tu carrito está vacío.");
            return window.location.href = "/productos";
        }
    }

    // ------------------------------------------------------------
    // 5) RENDER INICIAL
    // ------------------------------------------------------------
    let metodoEnvio = "retiro";
    let envioCosto = 0;
    let total = renderItems(cart, envioCosto, metodoEnvio);

    // ------------------------------------------------------------
    // 6) CAMBIO DE MÉTODO DE ENVÍO
    // ------------------------------------------------------------
    $$(".envio-opcion").forEach(op => {
        op.addEventListener("click", () => {
            $$(".envio-opcion").forEach(x => x.classList.remove("activa"));
            op.classList.add("activa");

            metodoEnvio = op.dataset.metodo;

            if (metodoEnvio === "envio") {
                $("#direccion-container").style.display = "block";
            } else {
                $("#direccion-container").style.display = "none";
                envioCosto = 0;
            }

            total = renderItems(cart, envioCosto, metodoEnvio);
        });
    });

    // ------------------------------------------------------------
    // 7) AUTOCOMPLETE DIRECCIONES
    // ------------------------------------------------------------
    const dirInput = $("#chk-direccion");
    const sug = $("#direccion-sugerencias");
    let timer;

    dirInput?.addEventListener("input", () => {
        clearTimeout(timer);
        const q = dirInput.value.trim();

        if (q.length < 4) return (sug.style.display = "none");

        timer = setTimeout(async () => {
            const data = await buscarDirecciones(`${q}, Argentina`);
            sug.innerHTML = "";

            if (!data.length) return (sug.style.display = "none");

            data.forEach(d => {
                const div = document.createElement("div");
                div.textContent = d.display_name;

                div.addEventListener("click", async () => {
                    dirInput.value = d.display_name;
                    sug.style.display = "none";

                    envioCosto = await calcularEnvio(d.lat, d.lon);
                    total = renderItems(cart, envioCosto, metodoEnvio);
                });

                sug.appendChild(div);
            });

            sug.style.display = "block";
        }, 400);
    });

    // ------------------------------------------------------------
    // 8) MERCADOPAGO
    // ------------------------------------------------------------
    $("#btn-pagar").addEventListener("click", async () => {
        const nombre = $("#chk-nombre").value.trim();
        const email = $("#chk-email").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const direccion = $("#chk-direccion")?.value.trim() || "";

        if (!nombre || !email || !tel)
            return alert("Completá nombre, correo y teléfono.");

        if (metodoEnvio === "envio" && !direccion)
            return alert("Ingresá tu dirección.");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return alert("Correo inválido.");

        $("#checkout-loader").style.display = "block";

        try {
            const res = await fetch(
                "https://pkptcnxgetrvmblphucg.supabase.co/functions/v1/create-preference",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        total,
                        items: cart,
                        user,
                        nombre,
                        email,
                        tel,
                        direccion,
                        envio: metodoEnvio,
                        costoEnvio: envioCosto
                    })
                }
            );

            const data = await res.json();

            if (data.init_point) {
                await supabase.from("carts").update({ status: "ordered" }).eq("id", cartId);
                window.location.href = data.init_point;
            } else {
                alert("Error al generar pago.");
            }
        } finally {
            $("#checkout-loader").style.display = "none";
        }
    });

    // Autofill email si viene del usuario
    if (user?.email) $("#chk-email").value = user.email;
});
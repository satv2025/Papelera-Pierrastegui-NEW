// 📦 checkout.js
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// 📍 Tienda
const TIENDA_LAT = -34.661435;
const TIENDA_LON = -58.617912;

// 🔐 Usuario
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// Obtener ID del pedido desde ?id=
function getCartIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// 💵 Render items
function renderItems(cart, envioCosto = 0, metodoEnvio = "retiro") {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");

    cont.innerHTML = `
        <ul class="checkout-ul" style="padding:0;margin:0;"></ul>
    `;

    const ul = cont.querySelector(".checkout-ul");

    let subtotal = 0;

    cart.forEach((it, i) => {

        // 🔥 FIX SUBTOTAL SEGURO
        const safeSubtotal = Number(it.subtotal) || 0;
        subtotal += safeSubtotal;

        const firstBorder = i === 0 ? 'style="border-top:1px solid #ff7600;"' : "";

        ul.innerHTML += `
            <li class="checkout-item" ${firstBorder}>
                <div class="checkout-item-info">
                    <img src="${it.img}" alt="${it.nombre}" class="checkout-item-img">
                    <div class="checkout-item-details">
                        <div class="checkout-item-title">${it.nombre} (${it.size}) ×${it.cantidad}</div>
                        <div class="checkout-item-desc">${it.desc || "Sin descripción"}</div>
                    </div>
                </div>
                <span class="checkout-item-subtotal">
                    ${safeSubtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                </span>
            </li>
        `;
    });

    // sistema hover bordes
    setTimeout(() => {
        const items = document.querySelectorAll(".checkout-item");

        items.forEach((item, i) => {
            item.addEventListener("mouseenter", () => {
                items.forEach(x => x.classList.remove("prev"));
                if (i > 0) items[i - 1].classList.add("prev");
            });

            item.addEventListener("mouseleave", () => {
                items.forEach(x => x.classList.remove("prev"));
            });
        });
    }, 20);

    const total = subtotal + envioCosto;

    if (metodoEnvio === "retiro") {
        totals.innerHTML = `
            <div><span>Total:</span>
            <span class="precio-total" id="precio-total">
                ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
            </span></div>
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

// 🚚 Calcular envío
async function calcularEnvio(lat, lon) {
    try {
        const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${TIENDA_LON},${TIENDA_LAT};${lon},${lat}?overview=false`
        );
        const data = await res.json();
        const distanciaM = data.routes?.[0]?.distance || 0;
        const km = distanciaM / 1000;

        return Math.round(300 + km * 100);
    } catch {
        return 0;
    }
}

// Autocompletado
async function buscarDirecciones(q) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ar&limit=5&q=${encodeURIComponent(q)}`
    );
    return await res.json();
}

// ⚙️ Principal
document.addEventListener("DOMContentLoaded", async () => {

    const user = await getUser();
    if (!user) {
        alert("Usuario no autenticado.");
        window.location.href = "/productos";
        return;
    }

    let cartId = getCartIdFromQuery();
    let pedido = null;

    // =====================================================
    // SI NO HAY CARTID → CREAR UNO NUEVO
    // =====================================================
    if (!cartId) {
        const { data: nuevo } = await supabase
            .from("carts")
            .insert([{ user_id: user.id, items: [], status: "active" }])
            .select()
            .single();

        cartId = nuevo.id;
        pedido = nuevo;

        const url = new URL(window.location);
        url.searchParams.set("id", cartId);
        window.history.replaceState({}, "", url);
    } else {

        // =====================================================
        // CARGAR CARRITO EXISTENTE (EVITAR ERROR 409)
        // =====================================================
        const { data: cartData, error } = await supabase
            .from("carts")
            .select("*")
            .eq("id", cartId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (error || !cartData) {
            console.error("Cart error:", error);
            alert("Carrito inválido. Se generará uno nuevo.");
            window.location.href = "/productos";
            return;
        }

        pedido = cartData;
    }

    // =====================================================
    // VALIDAR ITEMS
    // =====================================================
    let cart = pedido.items || [];

    if (!Array.isArray(cart)) cart = [];

    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        window.location.href = "/productos";
        return;
    }

    let metodoEnvio = "retiro";
    let envioCosto = 0;
    let total = renderItems(cart, envioCosto, metodoEnvio);

    // opciones envío
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

    // Autocompletado direcciones
    const dirInput = $("#chk-direccion");
    const sugBox = $("#direccion-sugerencias");
    let timer;

    dirInput?.addEventListener("input", () => {
        clearTimeout(timer);
        const q = dirInput.value.trim();

        if (q.length < 4) return (sugBox.style.display = "none");

        timer = setTimeout(async () => {
            const data = await buscarDirecciones(`${q}, Argentina`);
            sugBox.innerHTML = "";

            if (!data.length) return (sugBox.style.display = "none");

            data.forEach(d => {
                const div = document.createElement("div");
                div.textContent = d.display_name;

                div.addEventListener("click", async () => {
                    dirInput.value = d.display_name;
                    sugBox.style.display = "none";

                    envioCosto = await calcularEnvio(d.lat, d.lon);
                    total = renderItems(cart, envioCosto, metodoEnvio);
                });

                sugBox.appendChild(div);
            });

            sugBox.style.display = "block";
        }, 400);
    });

    // Pago
    $("#btn-pagar").addEventListener("click", async () => {
        const nombre = $("#chk-nombre").value.trim();
        const email = $("#chk-email").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const direccion = $("#chk-direccion")?.value.trim() || "";

        if (!nombre || !email || !tel) return alert("Completá nombre, correo y teléfono.");
        if (metodoEnvio === "envio" && !direccion) return alert("Ingresá tu dirección.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Correo inválido.");

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
                        costoEnvio: envioCosto,
                    }),
                }
            );

            const data = await res.json();

            if (data.init_point) {

                if (!pedido?.id) {
                    alert("Error interno: carrito sin ID.");
                    return;
                }

                await supabase.from("carts").update({ status: "ordered" }).eq("id", pedido.id);
                window.location.href = data.init_point;

            } else {
                alert("Error al generar pago.");
            }
        } finally {
            $("#checkout-loader").style.display = "none";
        }
    });

    if (user?.email) $("#chk-email").value = user.email;
});
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const TIENDA_LAT = -34.661435;
const TIENDA_LON = -58.617912;
const CART_KEY = "pp_cart";

/* ============================================================
   HELPERS
============================================================ */
function money(n) {
    return Number(n || 0).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
}

function getCartFromLocalStorage() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function normalizeCartItems(items = []) {
    return items.map(item => {
        const cantidad = Number(item.cantidad || 0);
        const precio_unitario = Number(item.precio_unitario || 0);
        const subtotal = cantidad * precio_unitario;

        const partes = [];
        if (item.modelo) partes.push(item.modelo);
        if (item.tipo === "bulto") partes.push("Por Bulto");
        if (item.tipo === "unidad") partes.push("Por Unidad");

        return {
            ...item,
            imagen: item.imagen || "https://via.placeholder.com/80",
            cantidad,
            precio_unitario,
            subtotal,
            variante: partes.join(" · ")
        };
    });
}

/* ============================================================
   SESIÓN
============================================================ */
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

/* ============================================================
   CART ID DESDE URL
============================================================ */
function getCartIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* ============================================================
   SUPABASE CARTS
============================================================ */
async function loadCartById(cartId, userId) {
    if (!cartId) return null;

    const { data, error } = await supabase
        .from("carts")
        .select("*")
        .eq("id", cartId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Error cargando carrito por ID:", error);
        return null;
    }

    return data || null;
}

async function loadActiveCart(userId) {
    const { data, error } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error cargando carrito activo:", error);
        return null;
    }

    return data || null;
}

async function createActiveCart(userId) {
    const { data, error } = await supabase
        .from("carts")
        .insert([{ user_id: userId, items: [], status: "active" }])
        .select()
        .single();

    if (error) {
        console.error("Error creando carrito:", error);
        return null;
    }

    return data;
}

async function updateCartItems(cartId, items) {
    const normalized = normalizeCartItems(items);
    const total = normalized.reduce((acc, item) => acc + item.subtotal, 0);

    const { error } = await supabase
        .from("carts")
        .update({
            items: normalized,
            total,
            updated_at: new Date().toISOString()
        })
        .eq("id", cartId);

    if (error) {
        console.error("Error guardando carrito:", error);
        return false;
    }

    return true;
}

/* ============================================================
   RENDER ITEMS
============================================================ */
function renderItems(items, envioCosto = 0, metodoEnvio = "retiro") {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");

    if (!cont || !totals) return 0;

    const normalized = normalizeCartItems(items);

    cont.innerHTML = `<ul class="checkout-ul" style="padding:0;margin:0;"></ul>`;
    const ul = cont.querySelector(".checkout-ul");

    let subtotal = 0;

    normalized.forEach((it) => {
        subtotal += it.subtotal;

        ul.innerHTML += `
            <li class="checkout-item">
                <div class="checkout-item-info">
                    <img src="${it.imagen}" class="checkout-item-img" alt="${it.nombre}">
                    <div class="checkout-item-details">
                        <div class="checkout-item-title">${it.nombre} ×${it.cantidad}</div>
                        <div class="checkout-item-desc">${it.variante || ""}</div>
                        <div class="checkout-item-desc">Unitario: ${money(it.precio_unitario)}</div>
                    </div>
                </div>
                <span class="checkout-item-subtotal">
                    ${money(it.subtotal)}
                </span>
            </li>
        `;
    });

    const total = subtotal + Number(envioCosto || 0);

    if (metodoEnvio === "retiro") {
        totals.innerHTML = `
            <div>
                <span>Total:</span>
                <span class="precio-total">${money(total)}</span>
            </div>
        `;
    } else {
        totals.innerHTML = `
            <div>
                <span>Subtotal:</span>
                <span class="precio-subtotal">${money(subtotal)}</span>
            </div>
            <div>
                <span>Envío:</span>
                <span class="precio-envio">${envioCosto ? money(envioCosto) : "Gratis"}</span>
            </div>
            <hr style="margin:.5em 0;border-color:#ff7600;">
            <div>
                <span>Total:</span>
                <span class="precio-total">${money(total)}</span>
            </div>
        `;
    }

    return total;
}

/* ============================================================
   ENVÍO
============================================================ */
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

async function buscarDirecciones(q) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ar&limit=5&q=${encodeURIComponent(q)}`
    );

    return await res.json();
}

/* ============================================================
   MAIN
============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    const user = await getUser();

    if (!user) {
        alert("Debés iniciar sesión para continuar.");
        window.location.href = "/login";
        return;
    }

    let cartId = getCartIdFromQuery();
    let cartRow = null;

    if (cartId) {
        cartRow = await loadCartById(cartId, user.id);
    }

    if (!cartRow) {
        cartRow = await loadActiveCart(user.id);
    }

    if (!cartRow) {
        cartRow = await createActiveCart(user.id);
    }

    if (!cartRow) {
        alert("No se pudo cargar el carrito.");
        return;
    }

    cartId = cartRow.id;

    const url = new URL(window.location);
    url.searchParams.set("id", cartId);
    window.history.replaceState({}, "", url);

    let cartItems = Array.isArray(cartRow.items) ? cartRow.items : [];

    if (!cartItems.length) {
        const localItems = getCartFromLocalStorage();

        if (localItems.length) {
            const ok = await updateCartItems(cartId, localItems);
            if (ok) {
                cartItems = normalizeCartItems(localItems);
            }
        }
    }

    if (!cartItems.length) {
        alert("Tu carrito está vacío.");
        window.location.href = "/productos";
        return;
    }

    let metodoEnvio = "retiro";
    let envioCosto = 0;
    let total = renderItems(cartItems, envioCosto, metodoEnvio);

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

            total = renderItems(cartItems, envioCosto, metodoEnvio);
        });
    });

    const dirInput = $("#chk-direccion");
    const sug = $("#direccion-sugerencias");
    let timer;

    dirInput?.addEventListener("input", () => {
        clearTimeout(timer);
        const q = dirInput.value.trim();

        if (q.length < 4) {
            sug.style.display = "none";
            return;
        }

        timer = setTimeout(async () => {
            const data = await buscarDirecciones(`${q}, Argentina`);
            sug.innerHTML = "";

            if (!data.length) {
                sug.style.display = "none";
                return;
            }

            data.forEach(d => {
                const div = document.createElement("div");
                div.textContent = d.display_name;

                div.addEventListener("click", async () => {
                    dirInput.value = d.display_name;
                    sug.style.display = "none";

                    envioCosto = await calcularEnvio(d.lat, d.lon);
                    total = renderItems(cartItems, envioCosto, metodoEnvio);
                });

                sug.appendChild(div);
            });

            sug.style.display = "block";
        }, 400);
    });

    if (user?.email && $("#chk-email")) {
        $("#chk-email").value = user.email;
    }

    $("#btn-pagar")?.addEventListener("click", async () => {
        const nombre = $("#chk-nombre")?.value.trim();
        const email = $("#chk-email")?.value.trim();
        const tel = $("#chk-telefono")?.value.trim();
        const direccion = $("#chk-direccion")?.value.trim() || "";

        if (!nombre || !email || !tel) {
            alert("Completá nombre, correo y teléfono.");
            return;
        }

        if (metodoEnvio === "envio" && !direccion) {
            alert("Ingresá tu dirección.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Correo inválido.");
            return;
        }

        $("#checkout-loader").style.display = "block";

        try {
            const res = await fetch(
                "https://pkptcnxgetrvmblphucg.supabase.co/functions/v1/create-preference",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cartId,
                        total,
                        items: normalizeCartItems(cartItems),
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
                await supabase
                    .from("carts")
                    .update({
                        status: "ordered",
                        total,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", cartId);

                localStorage.removeItem(CART_KEY);
                window.location.href = data.init_point;
            } else {
                alert("Error al generar pago.");
            }
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al iniciar el pago.");
        } finally {
            $("#checkout-loader").style.display = "none";
        }
    });

    setTimeout(() => {
        const items = document.querySelectorAll(".checkout-item");

        items.forEach((li, i, arr) => {
            li.addEventListener("mouseenter", () => {
                if (i > 0) arr[i - 1].classList.add("previous-active");
            });

            li.addEventListener("mouseleave", () => {
                if (i > 0) arr[i - 1].classList.remove("previous-active");
            });
        });
    }, 300);
});
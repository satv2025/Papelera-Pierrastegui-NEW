import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const CART_KEY = "pp_cart";

// 📍 Dirección real de la tienda
const TIENDA_LAT = -34.661435;
const TIENDA_LON = -58.617912;
const TIENDA_DIRECCION = "Anunciación 3796, Morón, Buenos Aires, Argentina";

// 🔐 Usuario
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// 🛒 Carrito
async function readCart() {
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

async function clearCart() {
    const user = await getUser();
    if (!user) localStorage.removeItem(CART_KEY);
    else {
        await supabase.from("carts").update({ items: [], total: 0 })
            .eq("user_id", user.id)
            .eq("status", "active");
    }
}

// 💵 Render totales
function renderItems(cart, envioCosto = 0) {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");
    cont.innerHTML = "";
    let subtotal = 0;

    cart.forEach(it => {
        subtotal += it.subtotal;
        cont.innerHTML += `
      <div class="checkout-item">
        <img src="${it.img}" alt="">
        <div class="checkout-item-info">${it.nombre} (${it.size}) ×${it.cantidad}</div>
        <div>${it.subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</div>
      </div>`;
    });

    const total = subtotal + envioCosto;
    totals.innerHTML = `
    <div><span>Subtotal:</span><span>${subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span></div>
    <div><span>Envío:</span><span>${envioCosto > 0 ? envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) : "Gratis"}</span></div>
    <hr style="margin:.5em 0;border-color:#ff7600;">
    <div><span>Total:</span><span>${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span></div>
  `;
    return total;
}

// 🚚 Calcular costo de envío
async function calcularEnvio(lat, lon) {
    try {
        const routeRes = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${TIENDA_LON},${TIENDA_LAT};${lon},${lat}?overview=false`
        );
        const routeData = await routeRes.json();
        const distanciaM = routeData.routes?.[0]?.distance || 0;
        const km = distanciaM / 1000;
        return Math.round(300 + km * 100);
    } catch (err) {
        console.error("Error al calcular envío:", err);
        return 0;
    }
}

// 📍 Autocompletado (Argentina)
async function buscarDirecciones(q) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=ar&limit=5&q=${encodeURIComponent(q)}`);
    return await res.json();
}

// ⚙️ Principal
document.addEventListener("DOMContentLoaded", async () => {
    const cart = await readCart();
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        window.location.href = "/productos";
        return;
    }

    let metodoEnvio = "retiro";
    let envioCosto = 0;
    let total = renderItems(cart, envioCosto);
    $("#envio-costo-texto").textContent = "Ingresá tu dirección"; // 👈 no “Gratis” por defecto

    // 🟧 Método de envío
    $$(".envio-opcion").forEach(op => {
        op.addEventListener("click", () => {
            $$(".envio-opcion").forEach(x => x.classList.remove("activa"));
            op.classList.add("activa");
            metodoEnvio = op.dataset.metodo;

            if (metodoEnvio === "envio") {
                $("#direccion-container").style.display = "block";
                $("#envio-costo-texto").textContent = "Ingresá tu dirección";
            } else {
                $("#direccion-container").style.display = "none";
                envioCosto = 0;
                $("#envio-costo-texto").textContent = "Gratis";
                total = renderItems(cart, envioCosto);
            }
        });
    });

    // 🔎 Autocompletado direcciones
    const dirInput = $("#chk-direccion");
    const sugBox = $("#direccion-sugerencias");
    let timer;

    dirInput?.addEventListener("input", () => {
        clearTimeout(timer);
        const q = dirInput.value.trim();
        if (q.length < 4) {
            sugBox.style.display = "none";
            return;
        }
        timer = setTimeout(async () => {
            const data = await buscarDirecciones(`${q}, Argentina`);
            sugBox.innerHTML = "";
            if (data.length === 0) {
                sugBox.style.display = "none";
                return;
            }
            data.forEach(d => {
                const div = document.createElement("div");
                div.textContent = d.display_name;
                div.addEventListener("click", async () => {
                    dirInput.value = d.display_name;
                    sugBox.style.display = "none";
                    $("#envio-costo-texto").textContent = "Calculando...";
                    envioCosto = await calcularEnvio(d.lat, d.lon);
                    $("#envio-costo-texto").textContent = envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
                    total = renderItems(cart, envioCosto);
                });
                sugBox.appendChild(div);
            });
            sugBox.style.display = "block";
        }, 400);
    });

    // 💳 Pago
    $("#btn-pagar").addEventListener("click", async () => {
        const user = await getUser();
        if (!user) {
            alert("Debes iniciar sesión para continuar con el pago.");
            window.location.href = "/login";
            return;
        }

        const nombre = $("#chk-nombre").value.trim();
        const email = $("#chk-email").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const direccion = $("#chk-direccion")?.value.trim() || "";

        if (!nombre || !email || !tel) {
            alert("Completá nombre, correo y teléfono.");
            return;
        }
        if (metodoEnvio === "envio" && !direccion) {
            alert("Ingresá tu dirección para el envío.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Ingresá un correo electrónico válido.");
            return;
        }

        $("#checkout-loader").style.display = "block";

        try {
            const res = await fetch("https://pkptcnxgetrvmblphucg.supabase.co/functions/v1/create-preference", {
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
                }),
            });

            const data = await res.json();
            if (data.init_point) {
                await clearCart();
                window.location.href = data.init_point;
            } else {
                console.error("Respuesta:", data);
                alert("Error al generar el pago: " + (data.error || data.message || "Intentá nuevamente"));
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor.");
        } finally {
            $("#checkout-loader").style.display = "none";
        }
    });

    // Autocompletar email si el usuario está logueado
    const user = await getUser();
    if (user?.email) $("#chk-email").value = user.email;
});
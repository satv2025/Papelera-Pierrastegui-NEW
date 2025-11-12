import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const CART_KEY = "pp_cart";

// 📍 Coordenadas de tu tienda en Morón
const TIENDA_LAT = -34.6841658;
const TIENDA_LON = -58.6357296;

// 🔐 Verifica usuario logueado
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// 🛒 Leer carrito
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

// 🧹 Vaciar carrito
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

// 🚚 Calcular costo de envío (Leaflet + OSRM)
async function calcularEnvio(lat, lon) {
    try {
        const routeRes = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${TIENDA_LON},${TIENDA_LAT};${lon},${lat}?overview=false`
        );
        const routeData = await routeRes.json();
        const distanciaM = routeData.routes?.[0]?.distance || 0;
        const km = distanciaM / 1000;
        return Math.round(300 + km * 100); // $300 base + $100/km
    } catch (err) {
        console.error("Error al calcular envío:", err);
        return 0;
    }
}

// ⚙️ Inicialización principal
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
    $("#envio-costo-texto").textContent = "Gratis";

    let userMarker = null;
    let map;

    // 🟩 Mostrar marcador fijo de la tienda
    function addTiendaMarker(map) {
        L.marker([TIENDA_LAT, TIENDA_LON])
            .addTo(map)
            .bindPopup("<b>Papelera Pierrastegui</b><br>Morón")
            .openPopup();
    }

    // 🟧 Selección del método de envío
    $$(".envio-opcion").forEach(op => {
        op.addEventListener("click", () => {
            $$(".envio-opcion").forEach(x => x.classList.remove("activa"));
            op.classList.add("activa");
            metodoEnvio = op.dataset.metodo;

            if (metodoEnvio === "envio") {
                $("#map-container").style.display = "block";

                if (!map) {
                    map = L.map("map").setView([TIENDA_LAT, TIENDA_LON], 12);
                    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; OpenStreetMap",
                    }).addTo(map);
                    addTiendaMarker(map);

                    // Usuario selecciona ubicación
                    map.on("click", async (e) => {
                        if (userMarker) userMarker.remove();
                        userMarker = L.marker(e.latlng).addTo(map);

                        $("#envio-costo-texto").textContent = "Calculando...";
                        envioCosto = await calcularEnvio(e.latlng.lat, e.latlng.lng);
                        $("#envio-costo-texto").textContent =
                            "+ " + envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
                        total = renderItems(cart, envioCosto);
                    });
                }
            } else {
                // 🟩 Retiro en tienda
                $("#map-container").style.display = "none";
                envioCosto = 0;
                $("#envio-costo-texto").textContent = "Gratis";
                total = renderItems(cart, envioCosto);
            }
        });
    });

    // 💳 Pago con MercadoPago
    $("#btn-pagar").addEventListener("click", async () => {
        const user = await getUser();
        if (!user) {
            alert("Debes iniciar sesión para continuar con el pago.");
            window.location.href = "/login";
            return;
        }

        const nombre = $("#chk-nombre").value.trim();
        const email = $("#chk-email").value.trim(); // 🟩 Nuevo campo
        const tel = $("#chk-telefono").value.trim();

        // 🟩 Validación
        if (!nombre || !email || !tel) {
            alert("Completá nombre, correo y teléfono.");
            return;
        }
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
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
                    email, // 🟩 Enviado al servidor
                    tel,
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

    // 🟩 Si el usuario está logueado, autocompleta su email
    const user = await getUser();
    if (user?.email) $("#chk-email").value = user.email;
});
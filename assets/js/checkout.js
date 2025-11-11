import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const CART_KEY = "pp_cart";
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";
const TIENDA_DIRECCION = "Av. Pierrastegui 123, Concordia, Entre Ríos";

async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

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

// 🧮 Calcula el costo de envío según distancia
async function calcularEnvio(direccionCliente) {
    if (!direccionCliente) return 0;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(TIENDA_DIRECCION)}&destinations=${encodeURIComponent(direccionCliente)}&key=${GOOGLE_API_KEY}&region=ar&language=es`;

    const proxy = "https://api.allorigins.win/get?url=" + encodeURIComponent(url); // evitar CORS
    try {
        const res = await fetch(proxy);
        const dataRaw = await res.json();
        const data = JSON.parse(dataRaw.contents);

        const distanciaM = data.rows[0].elements[0].distance?.value || 0;
        const km = distanciaM / 1000;
        const costo = Math.round(300 + km * 100); // $300 base + $100 por km
        return costo;
    } catch (err) {
        console.error("Error calculando envío:", err);
        return 0;
    }
}

function renderItems(cart, envioCosto = 0) {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");
    cont.innerHTML = "";
    let subtotal = 0;

    cart.forEach((it) => {
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

    // seleccionar método de envío
    $$(".envio-opcion").forEach((op) => {
        op.addEventListener("click", async () => {
            $$(".envio-opcion").forEach((x) => x.classList.remove("activa"));
            op.classList.add("activa");
            metodoEnvio = op.dataset.metodo;

            if (metodoEnvio === "envio") {
                const direccionCliente = $("#chk-direccion").value.trim();
                $("#envio-costo-texto").textContent = "Calculando...";
                envioCosto = await calcularEnvio(direccionCliente);
                $("#envio-costo-texto").textContent = "+ " + envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
            } else {
                envioCosto = 0;
                $("#envio-costo-texto").textContent = "+ $0";
            }

            total = renderItems(cart, envioCosto);
        });
    });

    // recalcular envío si el usuario cambia dirección
    $("#chk-direccion").addEventListener("blur", async () => {
        if (metodoEnvio === "envio") {
            $("#envio-costo-texto").textContent = "Calculando...";
            envioCosto = await calcularEnvio($("#chk-direccion").value.trim());
            $("#envio-costo-texto").textContent = "+ " + envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
            total = renderItems(cart, envioCosto);
        }
    });

    // botón de pago
    $("#btn-pagar").addEventListener("click", async () => {
        const user = await getUser();

        // 🚫 si no hay usuario logueado, bloquea pago
        if (!user) {
            alert("Debes iniciar sesión o registrarte para continuar con el pago.");
            window.location.href = "/login";
            return;
        }

        const nombre = $("#chk-nombre").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const dir = $("#chk-direccion").value.trim();
        const loc = $("#chk-localidad").value.trim();
        if (!nombre || !tel || !dir || !loc) {
            alert("Completá todos los datos de entrega.");
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
                    tel,
                    dir,
                    loc,
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
});
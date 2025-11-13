import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// 📍 Dirección real de la tienda
const TIENDA_LAT = -34.661435;
const TIENDA_LON = -58.617912;
const TIENDA_DIRECCION = "Anunciación 3796, Morón, Buenos Aires, Argentina";

// 🔐 Usuario
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// 🆔 Obtener ID del pedido desde ?id=
function getCartIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// 💵 Render totales
function renderItems(cart, envioCosto = 0, metodoEnvio = "retiro") {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");
    cont.innerHTML = "";
    let subtotal = 0;

    cart.forEach((it, i) => {
        subtotal += it.subtotal;
        const isFirstItem = i === 0 ? 'style="border-top: 1px solid #ff7600;"' : ''; // Borde superior solo en el primer item
        cont.innerHTML += `
        <ul class="checkout-item-list" style="padding: 0; margin: 0;">
          <li class="checkout-item" ${isFirstItem}>
            <div class="checkout-item-info" style="display: flex; gap: 10px;">
              <img src="${it.img}" alt="${it.nombre}" class="checkout-item-img" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
              <div class="checkout-item-details">
                <div class="checkout-item-title" style="font-weight: bold;">${it.nombre} (${it.size}) ×${it.cantidad}</div>
                <div class="checkout-item-desc" style="font-size: 12px; color: #555;">${it.desc || "Sin descripción"}</div>
              </div>
            </div>
            <span class="checkout-item-subtotal">${it.subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span>
          </li>
        </ul>`;
    });

    const total = subtotal + envioCosto;

    // 👇 Si es retiro, solo mostrar total
    if (metodoEnvio === "retiro") {
        totals.innerHTML = `
        <div><span>Total:</span>
          <span class="precio-total" id="precio-total">
            ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </span>
        </div>`;
    } else {
        // 👇 Si es envío, mostrar todo
        totals.innerHTML = `
        <div><span>Subtotal:</span>
          <span class="precio-subtotal" id="precio-subtotal">
            ${subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </span>
        </div>
        <div><span>Envío:</span>
          <span class="precio-envio" id="precio-envio">
            ${envioCosto > 0 ? envioCosto.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) : "Gratis"}
          </span>
        </div>
        <hr style="margin:.5em 0;border-color:#ff7600;">
        <div><span>Total:</span>
          <span class="precio-total" id="precio-total">
            ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </span>
        </div>`;
    }

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
    const user = await getUser();
    if (!user) {
        alert("Usuario no autenticado. Iniciá sesión para continuar.");
        window.location.href = "/productos";
        return;
    }

    let cartId = getCartIdFromQuery();
    let pedido = null;

    // 🧾 Buscar carrito activo o crear uno nuevo si no hay id
    if (!cartId) {
        const { data: existing, error: existingErr } = await supabase
            .from("carts")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["active", "pending"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (existing && !existingErr) {
            pedido = existing;
            cartId = existing.id;
            console.log("🔁 Carrito existente detectado:", cartId);
        } else {
            // 🆕 Crear un carrito nuevo vacío
            const { data: nuevo, error: newErr } = await supabase
                .from("carts")
                .insert([{ user_id: user.id, items: [], status: "active" }])
                .select()
                .single();

            if (newErr || !nuevo) {
                console.error("Error creando carrito:", newErr);
                alert("No se pudo iniciar tu carrito. Intentá nuevamente.");
                window.location.href = "/productos";
                return;
            }

            pedido = nuevo;
            cartId = nuevo.id;
            console.log("🆕 Nuevo carrito creado:", cartId);
        }

        // 🔗 Actualizar la URL sin recargar
        const url = new URL(window.location);
        url.searchParams.set("id", cartId);
        window.history.replaceState({}, "", url);
    } else {
        // 🔹 Cargar pedido desde Supabase
        const { data: cartData, error: loadErr } = await supabase
            .from("carts")
            .select("*")
            .eq("id", cartId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (loadErr || !cartData) {
            alert("No se pudo cargar el pedido.");
            window.location.href = "/productos";
            return;
        }

        pedido = cartData;
    }

    // 📦 Si el carrito está vacío, intentar traer del localStorage
    let cart = pedido.items || [];
    if (!cart.length) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length) {
            await supabase.from("carts").update({ items: localCart }).eq("id", cartId);
            cart = localCart;
            console.log("🛒 Carrito sincronizado desde localStorage.");
        } else {
            alert("Tu carrito está vacío.");
            window.location.href = "/productos";
            return;
        }
    }

    let metodoEnvio = "retiro";
    let envioCosto = 0;
    let total = renderItems(cart, envioCosto, metodoEnvio);
    $("#envio-costo-texto").textContent = "Ingresá tu dirección";

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
            }

            total = renderItems(cart, envioCosto, metodoEnvio);
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
                    total = renderItems(cart, envioCosto, metodoEnvio);
                });
                sugBox.appendChild(div);
            });
            sugBox.style.display = "block";
        }, 400);
    });

    // 💳 Pago
    $("#btn-pagar").addEventListener("click", async () => {
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
                await supabase
                    .from("carts")
                    .update({ status: "ordered" })
                    .eq("id", pedido.id);
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
    if (user?.email) $("#chk-email").value = user.email;
});
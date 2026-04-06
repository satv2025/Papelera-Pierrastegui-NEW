import { auth, db } from "/assets/js/supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
    const qs = new URLSearchParams(location.search);
    const cartId = qs.get("cart");

    if (!cartId) {
        alert("Carrito inválido");
        location.href = "/";
        return;
    }

    const { data: carrito, error } = await db
        .from("carritos")
        .select("*")
        .eq("id", cartId)
        .single();

    if (error || !carrito) {
        console.error(error);
        alert("No se pudo cargar el carrito");
        return;
    }

    const items = Array.isArray(carrito.items) ? carrito.items : [];

    const { data } = await auth.auth.getSession();
    const user = data.session?.user || null;

    const state = {
        metodoEntrega: "retiro",
        costoEnvio: 0,
        subtotal: 0,
        total: 0
    };

    const els = {
        checkoutItems: document.getElementById("checkout-items"),
        checkoutTotals: document.getElementById("checkout-totals"),
        btnPagar: document.getElementById("btn-pagar"),
        loader: document.getElementById("checkout-loader"),
        error: document.getElementById("checkout-error"),
        opcionesEnvio: document.querySelectorAll(".envio-opcion"),
        direccionContainer: document.getElementById("direccion-container"),
        direccionInput: document.getElementById("chk-direccion"),
        envioCostoTexto: document.getElementById("envio-costo-texto"),
        nombre: document.getElementById("chk-nombre"),
        email: document.getElementById("chk-email"),
        telefono: document.getElementById("chk-telefono")
    };

    if (user) {
        els.nombre.value = user?.user_metadata?.nombre || "";
        els.email.value = user?.email || "";
        els.telefono.value = user?.user_metadata?.telefono || "";
    }

    function money(n) {
        return "$" + Number(n || 0).toLocaleString("es-AR");
    }

    function escapeHtml(str = "") {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function buildItemDescription(it) {
        const parts = [];
        if (it.modelo) parts.push(it.modelo);
        if (it.tipo === "bulto") parts.push("Por Bulto");
        if (it.tipo === "unidad") parts.push("Por Unidad");
        return parts.join(" · ");
    }

    function calcularSubtotal() {
        return items.reduce((acc, it) => {
            return acc + Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
        }, 0);
    }

    function calcularPesoTotal() {
        return items.reduce((acc, it) => {
            const peso = Number(it.peso_kg || 0.25); // fallback si no tenés peso guardado
            const cantidad = Number(it.cantidad || 0);
            return acc + (peso * cantidad);
        }, 0);
    }

    function renderItems() {
        if (!els.checkoutItems) return;

        if (!items.length) {
            els.checkoutItems.innerHTML = `<p style="padding:16px 0;font-weight:800;color:#666;">Tu carrito está vacío.</p>`;
            return;
        }

        els.checkoutItems.innerHTML = `
            <ul class="checkout-ul">
                ${items.map(it => {
                    const subtotal = Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
                    const descripcion = buildItemDescription(it);

                    return `
                        <li class="checkout-item">
                            <div class="checkout-item-info">
                                <img 
                                    src="${escapeHtml(it.imagen || "https://via.placeholder.com/80")}" 
                                    class="checkout-item-img" 
                                    alt="${escapeHtml(it.nombre || "Producto")}"
                                />
                                <div class="checkout-item-details">
                                    <div class="checkout-item-title">
                                        ${escapeHtml(it.nombre || "Producto")}
                                    </div>
                                    ${descripcion ? `
                                        <div class="checkout-item-desc">
                                            ${escapeHtml(descripcion)}
                                        </div>
                                    ` : ""}
                                    <div class="checkout-item-desc">
                                        Cantidad: ${Number(it.cantidad || 0)}
                                    </div>
                                    <div class="checkout-item-desc">
                                        Unitario: ${money(it.precio_unitario || 0)}
                                    </div>
                                </div>
                            </div>

                            <span class="checkout-item-subtotal">
                                ${money(subtotal)}
                            </span>
                        </li>
                    `;
                }).join("")}
            </ul>
        `;
    }

    function renderTotals() {
        if (!els.checkoutTotals) return;

        state.subtotal = calcularSubtotal();
        state.total = state.subtotal + state.costoEnvio;

        els.checkoutTotals.innerHTML = `
            <div>
                <span>Subtotal:</span>
                <span class="precio-subtotal">${money(state.subtotal)}</span>
            </div>
            <div>
                <span>Envío:</span>
                <span>${state.metodoEntrega === "retiro" ? "Gratis" : money(state.costoEnvio)}</span>
            </div>
            <div>
                <span>Total:</span>
                <span class="precio-total">${money(state.total)}</span>
            </div>
        `;
    }

    function setMetodoEntrega(metodo) {
        state.metodoEntrega = metodo;

        els.opcionesEnvio.forEach(op => {
            op.classList.toggle("activa", op.dataset.metodo === metodo);
        });

        if (metodo === "envio") {
            els.direccionContainer.style.display = "block";
            els.envioCostoTexto.textContent = "Ingresá tu dirección";
        } else {
            els.direccionContainer.style.display = "none";
            state.costoEnvio = 0;
            els.envioCostoTexto.textContent = "Gratis";
            renderTotals();
        }
    }

    // DEMO SIMPLE:
    // después lo reemplazás por un cálculo real en backend
    async function cotizarEnvioDemo() {
        const direccion = els.direccionInput.value.trim();

        if (!direccion) {
            state.costoEnvio = 0;
            els.envioCostoTexto.textContent = "Ingresá tu dirección";
            renderTotals();
            return;
        }

        const pesoTotal = calcularPesoTotal();

        // ejemplo básico por zonas
        const dir = direccion.toLowerCase();

        let base = 0;

        if (dir.includes("morón") || dir.includes("haedo") || dir.includes("ramos mejía")) {
            base = 3500;
        } else if (
            dir.includes("caba") ||
            dir.includes("capital federal") ||
            dir.includes("ituzaingó") ||
            dir.includes("castelar")
        ) {
            base = 4500;
        } else if (dir.includes("buenos aires")) {
            base = 5900;
        } else {
            base = 7900;
        }

        // recargo por peso
        const extraPeso = Math.max(0, pesoTotal - 1) * 900;

        state.costoEnvio = Math.round(base + extraPeso);
        els.envioCostoTexto.textContent = money(state.costoEnvio);

        renderTotals();
    }

    function validarFormulario() {
        const nombre = els.nombre.value.trim();
        const email = els.email.value.trim();
        const telefono = els.telefono.value.trim();
        const direccion = els.direccionInput.value.trim();

        if (!nombre) return "Completá tu nombre y apellido.";
        if (!email) return "Completá tu correo electrónico.";
        if (!telefono) return "Completá tu teléfono.";

        if (state.metodoEntrega === "envio" && !direccion) {
            return "Completá la dirección para el envío.";
        }

        return null;
    }

    async function pagar() {
        const errorMsg = validarFormulario();

        if (errorMsg) {
            els.error.textContent = errorMsg;
            return;
        }

        els.error.textContent = "";
        els.loader.style.display = "block";
        els.btnPagar.disabled = true;

        try {
            const res = await fetch(
                "https://login.papelerapierrastegui.com.ar/functions/v1/create-preference",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cartId: carrito.id,
                        items,
                        subtotal: state.subtotal,
                        shipping_cost: state.costoEnvio,
                        total: state.total,
                        delivery_method: state.metodoEntrega,
                        buyer: {
                            nombre: els.nombre.value.trim(),
                            email: els.email.value.trim(),
                            telefono: els.telefono.value.trim(),
                            direccion: els.direccionInput.value.trim()
                        }
                    })
                }
            );

            const data = await res.json();

            if (!data.init_point) {
                throw new Error(data?.error || "No vino init_point");
            }

            window.location.href = data.init_point;
        } catch (err) {
            console.error(err);
            els.error.textContent = "Error iniciando pago.";
        } finally {
            els.loader.style.display = "none";
            els.btnPagar.disabled = false;
        }
    }

    // listeners
    els.opcionesEnvio.forEach(op => {
        op.addEventListener("click", () => {
            setMetodoEntrega(op.dataset.metodo);
        });
    });

    let typingTimer;
    els.direccionInput?.addEventListener("input", () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            if (state.metodoEntrega === "envio") {
                cotizarEnvioDemo();
            }
        }, 500);
    });

    els.btnPagar?.addEventListener("click", pagar);

    renderItems();
    setMetodoEntrega("retiro");
    renderTotals();
});
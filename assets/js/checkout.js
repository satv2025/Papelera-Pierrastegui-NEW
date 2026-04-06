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

        if (it.tipo === "bulto") {
            parts.push("Por Bulto");
        } else if (it.tipo === "unidad") {
            parts.push("Por Unidad");
        }

        if (it.slug) {
            // no se muestra siempre, pero queda listo si algún día querés usarlo
        }

        return parts.join(" · ");
    }

    function renderItems() {
        const container = document.getElementById("checkout-items");
        if (!container) return;

        if (!items.length) {
            container.innerHTML = `<p style="padding:16px 0;font-weight:800;color:#666;">Tu carrito está vacío.</p>`;
            return;
        }

        container.innerHTML = `
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
        const totals = document.getElementById("checkout-totals");
        if (!totals) return;

        const subtotal = items.reduce((acc, it) => {
            return acc + Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
        }, 0);

        const total = Number(carrito.total || subtotal);

        totals.innerHTML = `
            <div>
                <span>Subtotal:</span>
                <span class="precio-subtotal">${money(subtotal)}</span>
            </div>
            <div>
                <span>Total:</span>
                <span class="precio-total">${money(total)}</span>
            </div>
        `;
    }

    renderItems();
    renderTotals();

    async function pagar() {
        try {
            const res = await fetch(
                "https://login.papelerapierrastegui.com.ar/functions/v1/create-preference",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        total: carrito.total,
                        items,
                        user: {
                            nombre: user?.user_metadata?.nombre || "",
                            email: user?.email || ""
                        }
                    })
                }
            );

            const data = await res.json();

            if (!data.init_point) {
                throw new Error("No vino init_point");
            }

            window.location.href = data.init_point;

        } catch (err) {
            console.error(err);
            alert("Error iniciando pago");
        }
    }

    document.getElementById("btn-pagar")?.addEventListener("click", pagar);
});
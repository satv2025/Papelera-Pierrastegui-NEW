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

    const items = carrito.items || [];

    const { data } = await auth.auth.getSession();
    const user = data.session?.user || null;

    // 👉 render simple
    const container = document.getElementById("checkout-items");
    if (container) {
        container.innerHTML = items.map(it => `
            <div>
                <strong>${it.nombre}</strong>
                <small>x${it.cantidad}</small>
                <span>$${it.precio_unitario}</span>
            </div>
        `).join("");
    }

    const totalEl = document.getElementById("checkout-total");
    if (totalEl) {
        totalEl.textContent = "$" + Number(carrito.total).toLocaleString("es-AR");
    }

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

    document.getElementById("pagar-btn")?.addEventListener("click", pagar);
});
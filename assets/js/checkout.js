import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const CART_KEY = "pp_cart";

// === 1️⃣ Obtener usuario actual ===
async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// === 2️⃣ Leer carrito desde localStorage o Supabase ===
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

// === 3️⃣ Renderizar carrito ===
function renderItems(cart) {
    const cont = $("#checkout-items");
    const totals = $("#checkout-totals");

    cont.innerHTML = "";
    let total = 0;

    cart.forEach(it => {
        total += it.subtotal;
        cont.innerHTML += `
      <div class="checkout-item">
        <img src="${it.img}" alt="">
        <div class="checkout-item-info">${it.nombre} (${it.size}) ×${it.cantidad}</div>
        <div>${it.subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</div>
      </div>`;
    });

    totals.innerHTML = `<div><span>Total:</span><span>${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span></div>`;
    return total;
}

// === 4️⃣ Evento principal ===
document.addEventListener("DOMContentLoaded", async () => {
    const cart = await readCart();
    const total = renderItems(cart);

    $("#btn-pagar").addEventListener("click", async () => {
        const nombre = $("#chk-nombre").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const dir = $("#chk-direccion").value.trim();
        const loc = $("#chk-localidad").value.trim();

        if (!nombre || !tel || !dir || !loc) {
            alert("Completá todos los datos de entrega.");
            return;
        }

        $("#checkout-loader").style.display = "block";
        const user = await getUser();

        try {
            const res = await fetch("https://pkptcnxgetrvmblphucg.supabase.co/functions/v1/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // ✅ Solo una clave: Authorization con tu anon key pública
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHRjbnhnZXRydm1ibHBidWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMjI1NjAsImV4cCI6MjA0NjU5ODU2MH0.8ZkKjDgoOqNa_v8y0Zt6YQ2YyGb0hms6uKT3ffSh3nQ"
                },
                body: JSON.stringify({ total, items: cart, user, nombre, tel, dir, loc }),
            });

            const data = await res.json();

            if (data.init_point) {
                window.location.href = data.init_point; // 🔁 Redirige al checkout de MP
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
import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

const $ = (s) => document.querySelector(s);
const CART_KEY = "pp_cart";

async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

async function readCart() {
    const user = await getUser();
    if (!user) return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const { data } = await supabase.from("carts").select("*").eq("user_id", user.id).eq("status", "active").maybeSingle();
    return data?.items || [];
}

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

    totals.innerHTML = `<div><span>Total:</span><span>$${total.toLocaleString("es-AR")}</span></div>`;
    return total;
}

document.addEventListener("DOMContentLoaded", async () => {
    const cart = await readCart();
    const total = renderItems(cart);

    $("#btn-pagar").addEventListener("click", async () => {
        const nombre = $("#chk-nombre").value.trim();
        const tel = $("#chk-telefono").value.trim();
        const dir = $("#chk-direccion").value.trim();
        const loc = $("#chk-localidad").value.trim();

        if (!nombre || !tel || !dir || !loc) return alert("Completá todos los datos de entrega.");

        $("#checkout-loader").style.display = "block";

        const user = await getUser();

        const res = await fetch("https://<tu-proyecto>.functions.supabase.co/create-preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total, items: cart, user }),
        });

        const { init_point } = await res.json();

        window.location.href = init_point; // redirige al checkout de MP
    });
});
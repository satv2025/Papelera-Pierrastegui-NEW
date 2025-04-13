document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "hamburguesa": { u50: '11.000', u100: '21.000' }
    };

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precio50 = document.getElementById("precio-50");
    const precio50Moneda = document.getElementById("precio-50-moneda");

    const precio100 = document.getElementById("precio-100");
    const precio100Moneda = document.getElementById("precio-100-moneda");

    // Aquí no es necesario un dropdown, solo se establecen los precios directos
    const data = precios["hamburguesa"];

    if (data) {
        const { u50, u100 } = data;

        const isStock = !(u50.toLowerCase().includes("no está") || u100.toLowerCase().includes("no está"));

        if (isStock) {
            precio50.textContent = `$${u50}`;
            precio50Moneda.textContent = "ARS";

            precio100.textContent = `$${u100}`;
            precio100Moneda.textContent = "ARS";

            sinStock.style.display = "none";
            precioBox.style.display = "block";
        } else {
            precioBox.style.display = "none";
            sinStock.style.display = "block";
        }
    }
});
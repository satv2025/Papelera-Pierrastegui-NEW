document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "chico": { unidad: "2.300" },
        "kg": { unidad: "13.000" }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const medida = item.getAttribute("data-medida");
            btn.textContent = item.textContent;

            const data = precios[medida];

            if (data) {
                precioUnidad.textContent = `Por Unidad: $${data.unidad}`;
                precioUnidadMoneda.textContent = "ARS";

                sinStock.style.display = "none";
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
                sinStock.textContent = "Sin stock";
                sinStock.style.display = "block";
            }
        });
    });
});
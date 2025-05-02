document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "M": { unidad: '6.500', x10: '58.000' },
        "L": { unidad: '6.500', x10: '58.000' }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    const precio10 = document.getElementById("precio-10");
    const precio10Moneda = document.getElementById("precio-10-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const talle = item.getAttribute("data-talle");
            btn.textContent = item.textContent;

            const data = precios[talle];

            if (data) {
                const { unidad, x10 } = data;

                precioUnidad.textContent = `$${unidad}`;
                precioUnidadMoneda.textContent = "ARS";

                precio10.textContent = `$${x10}`;
                precio10Moneda.textContent = "ARS";

                sinStock.style.display = "none";
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
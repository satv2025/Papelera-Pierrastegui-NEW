document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "20x25": { kg1: '4.000', kg10: '38.000' },
        "folexburger": { kg1: '5.800', kg10: '60.000' }
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
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                const { kg1, kg10 } = data;

                precioUnidad.textContent = `$${kg1}`;
                precioUnidadMoneda.textContent = "ARS";

                precio10.textContent = `$${kg10}`;
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
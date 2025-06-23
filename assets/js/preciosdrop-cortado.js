document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "35x45": { kg: "2.500", kg20: "45.000" },
        "40x50": { kg: "2.800", kg20: "50.000" },
        "50x70": { kg: "3.200", kg20: "58.000" },
        "60x90": { kg: "4.000", kg20: "70.000" }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    const precio20 = document.getElementById("precio-20");
    const precio20Moneda = document.getElementById("precio-20-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const medida = item.getAttribute("data-medida");
            btn.textContent = item.textContent;

            const data = precios[medida];

            if (data) {
                precioUnidad.textContent = `$${data.kg}`;
                precioUnidadMoneda.textContent = "ARS";

                precio20.textContent = `$${data.kg20}`;
                precio20Moneda.textContent = "ARS";

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
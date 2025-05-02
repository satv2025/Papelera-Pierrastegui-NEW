document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "5mts": '1.500',
        "38x300": '4.800',
        "38x500": '8.300',
        "45x500": '9.900',
        "38x700": '16.500',
        "45x700": '19.800'
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const precio = precios[size];

            if (precio && precio !== "none") {
                precioUnidad.textContent = `$${precio}`;
                precioUnidadMoneda.textContent = "ARS";

                sinStock.style.display = "none";
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
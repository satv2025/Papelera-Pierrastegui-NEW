document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "virgen10cm": '1.700',
        "virgenmango": '5.500',
        "virgenmanual": '16.500',
        "negromango": '7.000',
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    const productoImg = document.querySelector("#producto-detalle img");

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
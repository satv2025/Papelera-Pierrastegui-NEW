document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "40cm": "13.000",
        "60cm": "20.200"
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const tamaño = item.getAttribute("data-tamaño");
            btn.textContent = item.textContent;

            const precio = precios[tamaño];

            if (precio) {
                precioUnidad.textContent = `Precio por unidad: $${precio}`;
                precioUnidadMoneda.textContent = "ARS";
            } else {
                precioUnidad.textContent = "Sin Stock";
                precioUnidadMoneda.textContent = "";
            }

            precioBox.style.display = "block";
        });
    });
});
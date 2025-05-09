document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "cnegra": "850",     // Punta Chata Negra
        "rnegra": null       // Punta Redonda Negra = Sin stock
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const color = item.getAttribute("data-color");
            btn.textContent = item.textContent;

            const precio = precios[color];

            if (precio) {
                precioUnidad.textContent = `$${precio}`;
                precioUnidadMoneda.textContent = "ARS";
            } else {
                precioUnidad.textContent = "Sin stock";
                precioUnidadMoneda.textContent = "";
            }

            precioBox.style.display = "block";
        });
    });
});
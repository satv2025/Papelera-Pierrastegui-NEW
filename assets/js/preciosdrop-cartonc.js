document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "100x20": { unidad: '10.000' },
        "120x20": { unidad: '12.000' }
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

            const data = precios[size];

            if (data) {
                const { unidad } = data;

                const isStock = !(unidad.toLowerCase().includes("no está"));

                if (isStock) {
                    precioUnidad.textContent = `$${unidad}`;
                    precioUnidadMoneda.textContent = "ARS";
                    sinStock.style.display = "none";
                    precioBox.style.display = "block";
                } else {
                    precioBox.style.display = "none";
                    sinStock.style.display = "block";
                }
            }
        });
    });
});
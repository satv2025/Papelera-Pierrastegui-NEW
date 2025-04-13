document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "24x50": { unidad: '500', x10: '4.000' },
        "48x100": { unidad: '1.400', x10: '11.000' }
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
                const { unidad, x10 } = data;

                const mostrarUnidad = unidad !== "none" && unidad !== "";
                const mostrar10 = x10 !== "none" && x10 !== "";

                if (mostrarUnidad || mostrar10) {
                    precioUnidad.textContent = mostrarUnidad ? `$${unidad}` : "";
                    precioUnidadMoneda.textContent = mostrarUnidad ? "ARS" : "";

                    precio10.textContent = mostrar10 ? `$${x10}` : "";
                    precio10Moneda.textContent = mostrar10 ? "ARS" : "";

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
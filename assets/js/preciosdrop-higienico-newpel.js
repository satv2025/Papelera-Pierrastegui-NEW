document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        eco: { unidad: "450", bulto: "12.000" },
        prem: { unidad: "1.500", bulto: "13.000" }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    const precioBulto = document.getElementById("precio-bulto");
    const precioBultoMoneda = document.getElementById("precio-bulto-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const tipo = item.getAttribute("data-tipo");
            btn.textContent = item.textContent;

            const data = precios[tipo];

            if (data) {
                const { unidad, bulto } = data;

                precioUnidad.textContent = `$${unidad}`;
                precioUnidadMoneda.textContent = "ARS";

                precioBulto.textContent = `$${bulto}`;
                precioBultoMoneda.textContent = "ARS";

                sinStock.style.display = "none";
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
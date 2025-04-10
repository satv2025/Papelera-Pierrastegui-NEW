document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "N3": { pp: 1.300, pb: 24.000, ppb: 20 },
        "N4A": { pp: 1.800, pb: 32.000, ppb: 20 },
        "N6L": { pp: 2.400, pb: 42.000, ppb: 20 },
        "N7": { pp: 2.800, pb: 26.000, ppb: 10 },
        "N8": { pp: 3.500, pb: 32.000, ppb: 10 }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");

    const precioPaquete = document.getElementById("precio-paquete");
    const precioPaqueteMoneda = document.getElementById("precio-paquete-moneda");

    const precioBulto = document.getElementById("precio-bulto");
    const precioBultoMoneda = document.getElementById("precio-bulto-moneda");
    const precioBultoCantidad = document.getElementById("precio-bulto-cantidad");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                const { pp, pb, ppb } = data;

                // Precio por paquete
                if (!isNaN(pp)) {
                    precioPaquete.textContent = `$${pp}`;
                    precioPaqueteMoneda.textContent = "ARS";
                } else {
                    precioPaquete.textContent = "";
                    precioPaqueteMoneda.textContent = "";
                }

                // Precio por bulto
                if (!isNaN(pb)) {
                    precioBulto.textContent = `$${pb}`;
                    precioBultoMoneda.textContent = "ARS";
                    precioBultoCantidad.textContent = `(${ppb} paquetes)`;
                } else {
                    precioBulto.textContent = "";
                    precioBultoMoneda.textContent = "";
                    precioBultoCantidad.textContent = "";
                }

                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
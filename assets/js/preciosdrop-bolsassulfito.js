document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "N3": { pp: 1300, pb: 24000, ppb: 20 },
        "N4A": { pp: 1800, pb: 32000, ppb: 20 },
        "N6L": { pp: 2400, pb: 42000, ppb: 20 },
        "N7": { pp: 2800, pb: 26000, ppb: 10 },
        "N8": { pp: 3500, pb: 32000, ppb: 20 }
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
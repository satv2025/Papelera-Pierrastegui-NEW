document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "20x30": { pp: 900, pb: 17.000, ppb: 20 },
        "30x40": { pp: 1.000, pb: 18.000, ppb: 20 },
        "40x50": { pp: 1.350, pb: 23.500, ppb: 20 },
        "45x60": { pp: 1.750, pb: 33.000, ppb: 20 },
        "50x60": { pp: 21-000, pb: 36.000, ppb: 20 },
        "50x70": { pp: 3.200, pb: 30.000, ppb: 10 },
        "60x80": { pp: 5.000, pb: 22.500, ppb: 5 },
        "45x60-negra": { pp: 3.000, pb: 25.000, ppb: 10 },
        "30x40-e": { pp: 650, pb: 11.000, ppb: 20 },
        "40x50-e": { pp: 1.000, pb: 18.000, ppb: 20 }
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

                // Mostrar precio por paquete
                if (!isNaN(pp)) {
                    precioPaquete.textContent = `$${pp}`;
                    precioPaqueteMoneda.textContent = "ARS";
                } else {
                    precioPaquete.textContent = "";
                    precioPaqueteMoneda.textContent = "";
                }

                // Mostrar precio por bulto total
                if (!isNaN(pb)) {
                    precioBulto.textContent = `$${pb}`;
                    precioBultoCantidad.textContent = `(${ppb} paquetes)`;
                    precioBultoMoneda.textContent = "ARS";
                } else {
                    precioBulto.textContent = "";
                    precioBultoCantidad.textContent = "";
                    precioBultoMoneda.textContent = "";
                }

                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
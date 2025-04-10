document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "20x30": { pp: 900, pb: 17000, ppb: 20 },
        "30x40": { pp: 1000, pb: 18000, ppb: 20 },
        "40x50": { pp: 1350, pb: 23500, ppb: 20 },
        "45x60": { pp: 1750, pb: 33000, ppb: 20 },
        "50x60": { pp: 21000, pb: 36000, ppb: 20 },
        "50x70": { pp: 3200, pb: 30000, ppb: 10 },
        "60x80": { pp: 5000, pb: 22500, ppb: 5 },
        "45x60-negra": { pp: 3000, pb: 25000, ppb: 10 },
        "30x40-e": { pp: 650, pb: 11000, ppb: 20 },
        "40x50-e": { pp: 1000, pb: 18000, ppb: 20 }
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
                    precioPaquete.textContent = "FALTAN DATOS";
                    precioPaqueteMoneda.textContent = "";
                }

                // Precio por bulto
                if (!isNaN(pb) && !isNaN(ppb)) {
                    const totalBulto = pb * ppb;
                    precioBulto.textContent = `$${totalBulto}`;
                    precioBultoCantidad.textContent = `(${ppb} paquetes)`;
                    precioBultoMoneda.textContent = "ARS";
                } else {
                    precioBulto.textContent = "FALTAN DATOS";
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
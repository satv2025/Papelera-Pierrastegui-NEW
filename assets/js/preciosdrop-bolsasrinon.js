document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "15x20": { pp: '1.900', pb: '17.000', ppb: 10 },
        "20x30": { pp: '2.500', pb: '23.000', ppb: 10 },
        "25x35": { pp: '3.500', pb: '32.000', ppb: 10 },
        "30x40": { pp: '4.300', pb: '40.000', ppb: 10 },
        "35x45": { pp: '5.500', pb: '52.000', ppb: 10 },
        "40x50": { pp: '6.800', pb: '65.000', ppb: 10 },
        "50x60": { pp: 'SIN STOCK', pb: 'SIN STOCK' },
        "vino": { pp: 'SIN STOCK', pb: 'SIN STOCK' }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");

    const precioPaquete = document.getElementById("precio-paquete");
    const precioPaqueteMoneda = document.getElementById("precio-paquete-moneda");

    const precioBulto = document.getElementById("precio-bulto");
    const precioBultoMoneda = document.getElementById("precio-bulto-moneda");
    const precioBultoCantidad = document.getElementById("precio-bulto-cantidad");

    const precioPaqueteLabel = document.getElementById("precio-paquete-label");
    const precioBultoLabel = document.getElementById("precio-bulto-label");

    const sinStockTexto = document.getElementById("sin-stock");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                const { pp, pb, ppb } = data;

                const ambosSinStock = pp === "SIN STOCK" && pb === "SIN STOCK";

                if (ambosSinStock) {
                    precioBox.style.display = "block";
                    sinStockTexto.style.display = "block";

                    precioPaqueteLabel.style.display = "none";
                    precioBultoLabel.style.display = "none";
                } else {
                    sinStockTexto.style.display = "none";

                    // Precio por paquete
                    if (pp === "SIN STOCK") {
                        precioPaqueteLabel.style.display = "none";
                    } else {
                        precioPaqueteLabel.style.display = "block";
                        precioPaquete.textContent = pp;
                        precioPaqueteMoneda.textContent = "ARS";
                    }

                    // Precio por bulto
                    if (pb === "SIN STOCK") {
                        precioBultoLabel.style.display = "none";
                    } else {
                        precioBultoLabel.style.display = "block";
                        precioBulto.textContent = pb;
                        precioBultoMoneda.textContent = "ARS";
                        precioBultoCantidad.textContent = `por bulto (${ppb} unidades):`;
                    }

                    precioBox.style.display = "block";
                }
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
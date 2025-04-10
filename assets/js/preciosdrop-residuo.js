document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "45x60": { pp: 470, pb: '4.300', ppb: 10 },
        "50x70": { pp: 650, pb: '6.000', ppb: 10 },
        "60x90": { pp: 800, pb: '7.500', ppb: 10 },
        "80x110": { pp: '1.350', pb: '12.800', ppb: 10 }
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
    precioBulto.textContent = `(${ppb} unidades): $${pb}`;
    precioBultoMoneda.textContent = "ARS";
    precioBultoCantidad.textContent = ""; // Ya no lo usamos acá
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
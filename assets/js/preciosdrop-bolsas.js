document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "20x30": { pp: 900, pb: '(20 unidades): 17000 },
        "30x40": { pp: 1000, pb: '(20 unidades): 18000' },
        "40x50": { pp: 1350, pb: '(20 unidades): 23500' },
        "45x60": { pp: 1750, pb: '(20 unidades): 33000' },
        "50x60": { pp: 2100, pb: '(20 unidades): 36000' },
        "50x70": { pp: 3200, pb: 3000 * 10 },
        "60x80": { pp: 5000, pb: 4500 * 5 },
        "45x60-negra": { pp: 3000, pb: 2500 * 10 },
        "30x40-e": { pp: 650, pb: 550 * 20 },
        "40x50-e": { pp: 1000, pb: 900 * 20 },
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");
    const precioPaquete = document.getElementById("precio-paquete");
    const precioBulto = document.getElementById("precio-bulto");
    const precioBox = document.getElementById("uni");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            if (precios[size]) {
                precioPaquete.textContent = precios[size].pp;
                precioBulto.textContent = precios[size].pb;
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
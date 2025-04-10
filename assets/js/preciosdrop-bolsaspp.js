document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "6x10": { pp: 900, pb: FALTAN DATOS },
        "8x10": { pp: 1000, pb: FALTAN DATOS },
        "10x25": { pp: 1350, pb: FALTAN DATOS },
        "12x25": { pp: 1750, pb: FALTAN DATOS },
        "15x25": { pp: 2100, pb: FALTAN DATOS },
        "15x35": { pp: 3200, pb: FALTAN DATOS },
        "20x30": { pp: 5000, pb: FALTAN DATOS },
        "25x35": { pp: 3000, pb: FALTAN DATOS },
        "30x40": { pp: 650, pb: FALTAN DATOS }, 
        "35x45": { pp: 1000, pb: FALTAN DATOS },
        "40x50": { pp: 1000, pb: FALTAN DATOS },
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
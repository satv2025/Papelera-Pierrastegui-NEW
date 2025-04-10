document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "6x30": { pp: 500},
        "8x10": { pp: 410},
        "10x25": { pp: 770},
        "12x25": { pp: 900},
        "15x25": { pp: '1.100'},
        "15x35": { pp: '1.500'},
        "20x30": { pp: '2.000'},
        "25x35": { pp: '2.250'},
        "30x40": { pp: '3.100'}, 
        "35x45": { pp: '4.100'},
        "40x50": { pp: '5.800'},
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

                if (!isNaN(precios[size].pb)) {
                    precioBulto.previousSibling.textContent = "Precio por bulto: $";
                    precioBulto.textContent = precios[size].pb;
                } else {
                    precioBulto.previousSibling.textContent = "Precio por bulto:";
                    precioBulto.textContent = precios[size].pb;
                }

                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
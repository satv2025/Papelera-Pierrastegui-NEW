document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        chico: {
            por50: "$6.200",
            por100: "$12.000"
        },
        mediano: {
            por50: "$6.500",
            por100: "$12.500"
        },
        grande: {
            por50: "$6.800",
            por100: "$13.000"
        }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const productoInfo = document.querySelector(".producto-info");

    let preciosContainer = document.createElement("div");
    preciosContainer.id = "precios-container";

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            const data = precios[size];

            btn.textContent = item.textContent;

            if (data) {
                preciosContainer.innerHTML = `
                    <p class="precio">Por 50 unidades: ${data.por50}</p>
                    <p class="precio">Por 100 unidades: ${data.por100}</p>
                `;
            } else {
                preciosContainer.innerHTML = `<p class="precio">$Consultar</p>`;
            }

            // Asegurarse de que el contenedor esté dentro del bloque de producto
            if (!productoInfo.contains(preciosContainer)) {
                productoInfo.insertBefore(preciosContainer, productoInfo.querySelector(".agregar-carrito"));
            }
        });
    });
});
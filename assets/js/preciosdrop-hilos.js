// preciosdrop-hilos.js

document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");
    const precioDiv = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    // Precios definidos para cada tipo de hilo
    const precios = {
        "amarillo-chico": { unidad: 500, pack10: 4500 },
        "amarillo-grande": { unidad: 800, pack10: 7500 },
        "blanco-chico": { unidad: 550, pack10: 5000 },
        "blanco-grande": { unidad: 850, pack10: 8000 }
    };

    // Mostrar u ocultar el menú al hacer click
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Al seleccionar una opción del dropdown
    dropdownMenu.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", function () {
            const tipo = item.getAttribute("data-size");
            const precio = precios[tipo];

            dropdownBtn.textContent = item.textContent;
            dropdownMenu.style.display = "none";

            if (precio) {
                sinStock.style.display = "none";
                precioDiv.style.display = "block";

                precioUnidad.innerHTML = `
                    $${precio.unidad} (1 unidad) <br>
                    $${precio.pack10} (10 unidades)
                `;
                precioUnidadMoneda.textContent = "ARS";
            } else {
                precioDiv.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
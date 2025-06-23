// preciosdrop-hilos.js

document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const precioUnidad = document.getElementById("precio-unidad");
    const precioDiv = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    // Precios definidos para cada tipo de hilo
    const precios = {
        "amarillo-chico": { unidad: 500, pack10: 4000 },
        "amarillo-grande": { unidad: 2500, pack10: 20000 },
        "blanco-chico": { unidad: 400, pack10: 3000 },
        "blanco-grande": { unidad: 1800, pack10: 15000 }
    };

    // Formatea número a $ con separador de miles (ej: 15000 → $15.000)
    function formatearPrecio(valor) {
        return `$${valor.toLocaleString('es-AR')}`;
    }

    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

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
                    Por Unidad: ${formatearPrecio(precio.unidad)}<br>
                    Por 10 Unidades: ${formatearPrecio(precio.pack10)}
                `;
            } else {
                precioDiv.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
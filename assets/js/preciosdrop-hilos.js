// preciosdrop-hilos.js

document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const precioUnidad = document.getElementById("precio-unidad");
    const precioDiv = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");
    const productoImg = document.getElementById("producto-img");

    const precios = {
        "amarillo-chico": { unidad: 500, pack10: 4000 },
        "amarillo-grande": { unidad: 2500, pack10: 20000 },
        "blanco-chico": { unidad: 400, pack10: 3000 },
        "blanco-grande": { unidad: 1800, pack10: 15000 }
    };

    const imagenes = {
        "amarillo-chico": "https://www.smpdescartables.com/cdn/shop/products/HiloChoricero-chico_1000x1000@2x.progressive.jpg?v=1584757803",
        "amarillo-grande": "https://www.smpdescartables.com/cdn/shop/products/HiloChoricero-Grande-1_1000x1000@2x.progressive.jpg?v=1584757709",
        "blanco-chico": "https://www.smpdescartables.com/cdn/shop/products/Hilo-Algodon-Chico_1000x1000@2x.progressive.jpg?v=1584757448",
        "blanco-grande": "https://www.smpdescartables.com/cdn/shop/products/Hilo-Algodon-Grande1_1000x1000@2x.progressive.jpg?v=1584757427"
    };

    // Función para formatear número con separador de miles y $ delante
    function formatearPrecio(valor) {
        return `$${valor.toLocaleString('es-AR')}`;
    }

    // Toggle dropdown menú
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Selección de opción en dropdown
    dropdownMenu.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", function () {
            const tipo = item.getAttribute("data-size");
            const precio = precios[tipo];
            const imagen = imagenes[tipo];

            dropdownBtn.textContent = item.textContent;
            dropdownMenu.style.display = "none";

            if (precio) {
                sinStock.style.display = "none";
                precioDiv.style.display = "block";

                precioUnidad.innerHTML = `
                    Por unidad: ${formatearPrecio(precio.unidad)}<br>
                    Por 10 unidades: ${formatearPrecio(precio.pack10)}
                `;

                if (imagen) {
                    productoImg.src = imagen;
                    productoImg.alt = item.textContent;
                }
            } else {
                precioDiv.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });

    // Opcional: cerrar dropdown si se clickea afuera
    document.addEventListener("click", function (e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
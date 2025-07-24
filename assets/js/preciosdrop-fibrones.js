document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "cnegra": "850",   // Negro chata
        "rnegra": "850",   // Negro redonda
        "crojo": "850",     // Rojo chata
        "rrojo": "850",     // Rojo redonda
        "cazul": "850",     // Azul chata
        "razul": "850",     // Azul redonda
        "cverde": "850",    // Verde chata
        "rverde": "850"     // Verde redonda
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const precioTexto = document.querySelector("#uni .precio");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioUnidadMoneda = document.getElementById("precio-unidad-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const color = item.getAttribute("data-color");
            btn.textContent = item.textContent;

            const precio = precios[color];

            if (precio) {
                precioTexto.innerHTML = `
                    Precio por unidad: 
                    <span id="precio-unidad">$${precio}</span>
                    <span id="precio-unidad-moneda">ARS</span>
                `;
            } else {
                precioTexto.innerHTML = `<span class="sin-stock">Sin Stock</span>`;
            }

            precioBox.style.display = "block";
        });
    });
});
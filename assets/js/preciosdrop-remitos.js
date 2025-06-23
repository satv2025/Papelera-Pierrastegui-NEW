document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "chico": "1.300",
        "grande": "2.000"
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const precioTexto = document.querySelector("#uni .precio");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const medida = item.getAttribute("data-medida");
            btn.textContent = item.textContent;

            const precio = precios[medida];

            if (precio) {
                precioTexto.innerHTML = `
                    Precio por unidad: 
                    <span id="precio-unidad">$${precio}</span>
                    <span id="precio-unidad-moneda">ARS</span>
                `;
            } else {
                precioTexto.innerHTML = `<span class="sin-stock">Sin stock</span>`;
            }

            precioBox.style.display = "block";
        });
    });
});
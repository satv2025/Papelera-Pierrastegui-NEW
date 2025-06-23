document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "chico": "1.000",
        "1kg": "9.000"
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const precioTexto = precioBox.querySelector(".precio");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const tamaño = item.getAttribute("data-tamaño");
            btn.textContent = item.textContent;

            const precio = precios[tamaño];

            if (precio && precio !== "none") {
                precioTexto.textContent = `Precio por unidad: $${precio} ARS`;
            } else {
                // Sin stock, mostrar solo texto sin "Precio por unidad"
                precioTexto.textContent = "Sin Stock";
            }
            precioBox.style.display = "block";
        });
    });
});
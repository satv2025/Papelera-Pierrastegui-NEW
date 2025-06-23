document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const precioTexto = document.getElementById("precio-unidad"); // Elemento donde mostrar precio

    // Precios según tamaño
    const precios = {
        chico: 1300,
        grande: 2000
    };

    // Abrir/cerrar dropdown al hacer click en el botón
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    // Acción al elegir una opción del dropdown
    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const tamaño = this.dataset.tamaño; // dataset "tamaño" según HTML
            const nombre = this.textContent.trim();

            // Cambiar texto del botón
            dropdownBtn.textContent = `Tamaño: ${nombre}`;

            // Mostrar precio si existe
            if (precios[tamaño] !== undefined) {
                const precioFormateado = precios[tamaño].toLocaleString('es-AR');
                precioTexto.textContent = `Por Unidad: $${precioFormateado}`;
            } else {
                precioTexto.textContent = "Por Unidad: $Consultar";
            }

            // Cerrar dropdown
            dropdownMenu.classList.remove("show");
        });
    });

    // Cerrar dropdown si se hace clic fuera
    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});
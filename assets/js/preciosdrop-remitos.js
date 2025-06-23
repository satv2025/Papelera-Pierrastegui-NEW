document.addEventListener("DOMContentLoaded", function () {
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const precioTexto = document.getElementById("precio-unidad");

    // Precios por tamaño
    const precios = {
        chico: 1300,
        grande: 2000
    };

    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const tamaño = this.dataset.tamaño;
            if (precios[tamaño] !== undefined) {
                const precioFormateado = precios[tamaño].toLocaleString('es-AR');
                precioTexto.textContent = `Por Unidad: $${precioFormateado}`;
            } else {
                precioTexto.textContent = "Por Unidad: $Consultar";
            }
        });
    });
});
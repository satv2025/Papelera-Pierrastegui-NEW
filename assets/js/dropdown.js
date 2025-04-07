document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const uniSpan = document.getElementById('uni');

    // Abrir/cerrar dropdown al hacer click en el botón
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    // Acción al elegir una opción del dropdown
    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
            dropdownMenu.classList.remove("show");
            uniSpan.style.display = 'inline'; // Mostrar precios
        });
    });

    // Cerrar dropdown si se hace clic fuera
    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});
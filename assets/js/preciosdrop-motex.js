document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const dropdownItems = dropdownMenu.querySelectorAll("li");

    // Mostrar/ocultar el menú
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    // Cambiar texto del botón cuando se elige un color
    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const colorNombre = item.textContent.trim();
            dropdownBtn.textContent = colorNombre;
            dropdownMenu.classList.remove("show");
        });
    });
});
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
}

// Mostrar/ocultar el menú desplegable de "Más"
function toggleMoreDropdown(event) {
    event.stopPropagation(); // evitar que se cierre por el click global
    document.getElementById("more-dropdown").classList.toggle("show");
}

// Cerrar el dropdown si se hace clic afuera
window.addEventListener("click", () => {
    document.getElementById("more-dropdown").classList.remove("show");
});

// Activar categoría y mostrar productos que coincidan
function filtrarCategoria(categoria) {
    const normalizada = normalizeText(categoria);

    // Quitar clase 'active' a todos los botones
    document.querySelectorAll(".category-menu span").forEach((span) => {
        span.classList.remove("active");
    });

    // Marcar como activa la categoría correspondiente
    document.querySelectorAll(".category-menu span").forEach((span) => {
        if (normalizeText(span.textContent) === normalizada) {
            span.classList.add("active");
        }
    });

    // Mostrar solo los productos de la categoría
    document.querySelectorAll(".producto").forEach((producto) => {
        const cat = producto.querySelector(".categoria");
        if (!cat) return;

        const productoCategoria = normalizeText(cat.textContent);
        if (
            normalizada === "todos" ||
            productoCategoria === normalizada
        ) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });

    // Cerrar el dropdown después de hacer click en una categoría
    document.getElementById("more-dropdown").classList.remove("show");
}

// Inicializar al cargar
window.addEventListener("DOMContentLoaded", () => {
    // Mostrar todos los productos al inicio
    filtrarCategoria("todos");
});
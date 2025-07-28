function filtrarCategoria(categoria) {
    const normalizada = normalizeText(categoria);

    document.querySelectorAll(".category-menu span, .dropdown-categorias span").forEach(span => {
        span.classList.remove("active");
    });

    document.querySelectorAll(".category-menu span, .dropdown-categorias span").forEach(span => {
        if (normalizeText(span.textContent) === normalizada) {
            span.classList.add("active");
        }
    });

    document.querySelectorAll(".producto").forEach(producto => {
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

    const moreDropdown = document.getElementById("more-dropdown");
    if (moreDropdown) moreDropdown.classList.remove("show");

    const dropdownCategorias = document.querySelector('.dropdown-categorias');
    if (dropdownCategorias) dropdownCategorias.classList.remove('show');
}
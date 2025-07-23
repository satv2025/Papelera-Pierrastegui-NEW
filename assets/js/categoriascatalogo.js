function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
}

function toggleMoreDropdown(event) {
    event.stopPropagation();
    const moreDropdown = document.getElementById("more-dropdown");
    if (moreDropdown) {
        moreDropdown.classList.toggle("show");
    }
}

window.addEventListener("click", () => {
    const moreDropdown = document.getElementById("more-dropdown");
    if (moreDropdown) moreDropdown.classList.remove("show");

    const dropdownCategorias = document.querySelector('.dropdown-categorias');
    if (dropdownCategorias) dropdownCategorias.classList.remove('show');
});

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
        if (normalizada === "todos" || productoCategoria === normalizada) {
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

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.menu-scroll-wrapper');
    if (!wrapper) return;

    wrapper.style.position = 'relative';

    let btnCategorias = document.querySelector('.btn-categorias');
    let dropdownCategorias = document.querySelector('.dropdown-categorias');

    if (!btnCategorias) {
        btnCategorias = document.createElement('button');
        btnCategorias.className = 'btn-categorias';
        btnCategorias.textContent = 'Categorías';
        wrapper.appendChild(btnCategorias);
    }

    if (!dropdownCategorias) {
        dropdownCategorias = document.createElement('div');
        dropdownCategorias.className = 'dropdown-categorias';
        wrapper.appendChild(dropdownCategorias);
    }

    // Cargar categorías del menú principal y "Más"
    const categorias = [];

    document.querySelectorAll('.category-menu span:not(.more-btn)').forEach(span => {
        const match = span.getAttribute('onclick')?.match(/filtrarCategoria\('(.+)'\)/);
        if (match) categorias.push({ text: span.textContent, filtro: match[1] });
    });

    document.querySelectorAll('#more-dropdown span').forEach(span => {
        const match = span.getAttribute('onclick')?.match(/filtrarCategoria\('(.+)'\)/);
        if (match) categorias.push({ text: span.textContent, filtro: match[1] });
    });

    dropdownCategorias.innerHTML = '';
    categorias.forEach(({ text, filtro }) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
            filtrarCategoria(filtro);
            dropdownCategorias.classList.remove('show');
        });
        dropdownCategorias.appendChild(span);
    });

    btnCategorias.addEventListener('click', e => {
        e.stopPropagation();
        dropdownCategorias.classList.toggle('show');
    });

    // Cerrar dropdown si clic afuera
    window.addEventListener('click', () => {
        dropdownCategorias.classList.remove('show');
    });

    // Mostrar todos al cargar
    filtrarCategoria('todos');
});
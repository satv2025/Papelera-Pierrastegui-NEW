document.addEventListener("DOMContentLoaded", async () => {
    const sb = window.sb;
    const grid = document.getElementById("productos-grid");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("search-input");
    const mobileSearchInput = document.getElementById("mobile-search-input");
    const desktopMenu = document.getElementById("desktopMenu");
    const mobileMenuContent = document.getElementById("mobileMenuContent");

    let productos = [];

    // MENU AUTO POR CATEGORÍA
    function renderMenu(productos) {
        // Agrupa por categoría
        const cats = {};
        productos.forEach(p => {
            if (!cats[p.categoria]) cats[p.categoria] = [];
            cats[p.categoria].push(p);
        });

        // Desktop
        desktopMenu.innerHTML = "";
        const mainDropdown = document.createElement("div");
        mainDropdown.className = "nav-item dropdown";
        mainDropdown.innerHTML = `
            <a href="javascript:void(0)">Todos los productos <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span></a>
            <div class="dropdown-menu"></div>
        `;
        const dropdownMenu = mainDropdown.querySelector(".dropdown-menu");

        Object.entries(cats).forEach(([cat, productos]) => {
            const submenu = document.createElement("div");
            submenu.className = "dropdown-submenu";
            submenu.innerHTML = `<a href="/?cat=${encodeURIComponent(cat)}">${cat}</a>`;
            if (productos.length) {
                const subList = document.createElement("div");
                subList.className = "submenu";
                productos.forEach(prod => {
                    const prodA = document.createElement("a");
                    prodA.href = `/producto?id=${prod.id}&slug=${prod.slug || ""}`;
                    prodA.textContent = prod.nombre;
                    subList.appendChild(prodA);
                });
                submenu.appendChild(subList);
            }
            dropdownMenu.appendChild(submenu);
        });

        mainDropdown.appendChild(dropdownMenu);
        desktopMenu.appendChild(mainDropdown);
        desktopMenu.insertAdjacentHTML("beforeend", `<div class="nav-item"><a href="/nosotros">¿Quiénes somos?</a></div>`);

        // Mobile
        if (mobileMenuContent) mobileMenuContent.innerHTML = desktopMenu.innerHTML;
    }

    // GRID
    function render(list) {
        grid.innerHTML = "";
        if (!list.length) {
            grid.innerHTML = "<p>No hay productos</p>";
            return;
        }
        list.forEach(p => {
            const slug = p.slug || (p.nombre || "").toLowerCase().replace(/\s+/g, "-");
            grid.insertAdjacentHTML("beforeend", `
                <div class="card" onclick="location.href='/producto?id=${p.id}&slug=${slug}'">
                    <img src="${p.imagen || 'https://via.placeholder.com/300'}">
                    <div class="info">
                        <div class="nombre">${p.nombre}</div>
                        <div class="desc">${p.descripcion || ''}</div>
                        <div class="cat">${p.categoria || ''}</div>
                    </div>
                </div>
            `);
        });
    }

    // Cargar productos
    async function cargarProductos() {
        loader.style.display = "block";
        const { data, error } = await sb.from("productos").select("*").eq("activo", true).order("orden");
        loader.style.display = "none";
        if (error) {
            grid.innerHTML = "Error cargando productos";
            return;
        }
        productos = data;
        renderMenu(productos);
        render(productos);
    }

    // Buscador
    searchInput.oninput = () => {
        const q = searchInput.value.toLowerCase();
        render(productos.filter(p =>
            p.nombre.toLowerCase().includes(q) ||
            (p.descripcion || "").toLowerCase().includes(q) ||
            (p.categoria || "").toLowerCase().includes(q)
        ));
    };
    // Buscador mobile
    if (mobileSearchInput) {
        mobileSearchInput.oninput = () => {
            const q = mobileSearchInput.value.toLowerCase();
            render(productos.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                (p.descripcion || "").toLowerCase().includes(q) ||
                (p.categoria || "").toLowerCase().includes(q)
            ));
        };
    }

    await cargarProductos();

    // Dropcart y mobile menu (copiar tu lógica si ya tenés, si no avisame y te paso todo)
});
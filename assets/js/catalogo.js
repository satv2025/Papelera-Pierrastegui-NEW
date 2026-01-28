document.addEventListener("DOMContentLoaded", async () => {

    const sb = window.sb;

    const grid = document.getElementById("productos-grid");
    const loader = document.getElementById("loader");

    const searchInput = document.getElementById("search-input");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    const desktopMenu = document.getElementById("desktopMenu");
    const mobileMenuContent = document.getElementById("mobileMenuContent");

    const accountContainer = document.getElementById("account-container");
    const mobileAccountBtn = document.getElementById("mobile-account");

    let productos = [];

    /* =====================================================
       MENU AUTO POR CATEGORÍA
    ===================================================== */

    function renderMenu(productos) {

        const cats = {};

        productos.forEach(p => {
            if (!cats[p.categoria]) cats[p.categoria] = [];
            cats[p.categoria].push(p);
        });

        desktopMenu.innerHTML = "";

        const mainDropdown = document.createElement("div");
        mainDropdown.className = "nav-item dropdown";

        mainDropdown.innerHTML = `
            <a href="javascript:void(0)">
                Todos los productos
            </a>
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

        desktopMenu.insertAdjacentHTML(
            "beforeend",
            `<div class="nav-item"><a href="/nosotros">¿Quiénes somos?</a></div>`
        );

        if (mobileMenuContent)
            mobileMenuContent.innerHTML = desktopMenu.innerHTML;
    }

    /* =====================================================
       GRID PRODUCTOS
    ===================================================== */

    function render(list) {

        grid.innerHTML = "";

        if (!list.length) {
            grid.innerHTML = "<p>No hay productos</p>";
            return;
        }

        list.forEach(p => {

            const slug =
                p.slug ||
                (p.nombre || "").toLowerCase().replace(/\s+/g, "-");

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

    /* =====================================================
       CARGAR PRODUCTOS
    ===================================================== */

    async function cargarProductos() {

        loader.style.display = "block";

        const { data, error } = await sb
            .from("productos")
            .select("*")
            .eq("activo", true)
            .order("orden");

        loader.style.display = "none";

        if (error) {
            grid.innerHTML = "Error cargando productos";
            return;
        }

        productos = data;

        renderMenu(productos);
        render(productos);
    }

    /* =====================================================
       BUSCADOR
    ===================================================== */

    function filtrar(q) {
        q = q.toLowerCase();

        render(productos.filter(p =>
            p.nombre.toLowerCase().includes(q) ||
            (p.descripcion || "").toLowerCase().includes(q) ||
            (p.categoria || "").toLowerCase().includes(q)
        ));
    }

    if (searchInput)
        searchInput.oninput = () => filtrar(searchInput.value);

    if (mobileSearchInput)
        mobileSearchInput.oninput = () => filtrar(mobileSearchInput.value);

    await cargarProductos();

    /* =====================================================
       ACCOUNT / AUTH UI (SUPABASE)
    ===================================================== */

    function renderLoggedOut() {

        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <a class="btn-login" href="/login">
                <img src="https://papelerapierrastegui.com.ar/assets/images/svg/web/account.svg">
                Acceder
            </a>
        `;
    }

    function renderLoggedIn(user) {

        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <div class="account-dropdown">

                <button class="account-trigger">
                    <img src="https://papelerapierrastegui.com.ar/assets/images/svg/web/account.svg">
                    Mi cuenta
                </button>

                <div class="account-menu">

                    <a href="/perfil">
                        <img src="https://papelerapierrastegui.com.ar/assets/images/svg/web/edit.svg">
                        Editar perfil
                    </a>

                    <button id="logout-btn">
                        <img src="https://papelerapierrastegui.com.ar/assets/images/svg/web/exit.svg">
                        Cerrar sesión
                    </button>

                </div>
            </div>
        `;

        document.getElementById("logout-btn").onclick = async () => {
            await sb.auth.signOut();
            location.href = "/";
        };
    }

    function checkAuth() {
        const user = sb.auth.user();
        user ? renderLoggedIn(user) : renderLoggedOut();
    }

    checkAuth();

    sb.auth.onAuthStateChange(() => checkAuth());

    /* =====================================================
       MOBILE ACCOUNT CLICK
    ===================================================== */

    if (mobileAccountBtn) {
        mobileAccountBtn.onclick = () => {
            const user = sb.auth.user();
            location.href = user ? "/perfil" : "/login";
        };
    }

});
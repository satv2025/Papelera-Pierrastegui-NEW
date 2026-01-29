import { auth, db } from "/assets/js/supabaseClient.js"; // 🔵 login + 🟢 productos

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

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
            <a href="javascript:void(0)">Todos los productos</a>
            <div class="dropdown-menu"></div>
        `;

        const dropdownMenu = mainDropdown.querySelector(".dropdown-menu");

        Object.entries(cats).forEach(([cat, productos]) => {
            const submenu = document.createElement("div");
            submenu.className = "dropdown-submenu";

            submenu.innerHTML = `<a href="/?cat=${encodeURIComponent(cat)}">${cat}</a>`;

            const subList = document.createElement("div");
            subList.className = "submenu";

            productos.forEach(prod => {
                subList.insertAdjacentHTML(
                    "beforeend",
                    `<a href="/producto?id=${prod.id}&slug=${prod.slug || ""}">${prod.nombre}</a>`
                );
            });

            submenu.appendChild(subList);
            dropdownMenu.appendChild(submenu);
        });

        mainDropdown.appendChild(dropdownMenu);
        desktopMenu.appendChild(mainDropdown);

        if (mobileMenuContent)
            mobileMenuContent.innerHTML = desktopMenu.innerHTML;
    }

    /* =====================================================
       GRID
    ===================================================== */

    function render(list) {

        if (!grid) return;

        grid.innerHTML = "";

        if (!list.length) {
            grid.innerHTML = "<p>No hay productos</p>";
            return;
        }

        list.forEach(p => {

            grid.insertAdjacentHTML("beforeend", `
                <div class="card"
                     onclick="location.href='/producto?id=${p.id}&slug=${p.slug || ""}'">

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
       CARGAR PRODUCTOS (USA DB 🟢)
    ===================================================== */

    async function cargarProductos() {

        loader.style.display = "block";

        const { data, error } = await db
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

    await cargarProductos();

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

    /* =====================================================
       AUTH UI (USA AUTH 🔵)
    ===================================================== */

    function renderLoggedOut() {

        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <a class="btn-login" href="/login">Acceder</a>
        `;
    }

    function renderLoggedIn(user) {

        if (!accountContainer) return;

        accountContainer.innerHTML = `
            <div class="account-dropdown">
                <button class="account-trigger">Mi cuenta</button>
                <div class="account-menu">
                    <a href="/perfil">Perfil</a>
                    <button id="logout-btn">Cerrar sesión</button>
                </div>
            </div>
        `;

        document.getElementById("logout-btn").onclick = async () => {
            await auth.auth.signOut(); // 🔵 LOGIN CLIENT
            location.href = "/";
        };
    }

    async function checkAuth() {
        const { data } = await auth.auth.getSession(); // 🔵 LOGIN CLIENT
        data.session?.user ? renderLoggedIn(data.session.user) : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn(s.user) : renderLoggedOut();
    });

    /* =====================================================
       MOBILE ACCOUNT CLICK
    ===================================================== */

    if (mobileAccountBtn) {
        mobileAccountBtn.onclick = async () => {
            const { data } = await auth.auth.getSession();
            location.href = data.session ? "/perfil" : "/login";
        };
    }

});
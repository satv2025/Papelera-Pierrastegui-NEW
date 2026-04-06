import { auth, db } from "/assets/js/supabaseClient.js";

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

    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const closeMobileMenuBtn = document.getElementById("closeMobileMenu");

    const cartContainer = document.querySelector(".dropcart-container");
    const cartToggle = document.getElementById("cart-toggle");
    const dropcart = document.getElementById("dropcart");
    const dropcartClose = document.getElementById("dropcart-close");
    const dropcartItems = document.getElementById("dropcart-items");
    const dropcartTotal = document.getElementById("dropcart-total");
    const dropcartEmpty = document.getElementById("dropcart-empty");
    const cartBadge = document.getElementById("cart-badge");
    const mobileCartBtn = document.getElementById("mobile-cart");
    const checkoutBtn = document.getElementById("dropcart-checkout");

    let productos = [];

    /* =====================================================
       HELPERS
    ===================================================== */
    const CART_KEY = "pp_cart";
    const SESSION_KEY = "pp_session_id";

    function money(n) {
        return "$" + Number(n || 0).toLocaleString("es-AR");
    }

    function escapeHtml(str = "") {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function buildProductUrl(prod) {
        return `/producto?id=${encodeURIComponent(prod.id)}&slug=${encodeURIComponent(prod.slug || "")}`;
    }

    function getOrCreateSessionId() {
        let sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    /* =====================================================
       MOBILE MENU
    ===================================================== */
    function openMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add("active");
        mobileMenu.setAttribute("aria-hidden", "false");
    }

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("active");
        mobileMenu.setAttribute("aria-hidden", "true");
    }

    mobileMenuBtn?.addEventListener("click", openMobileMenu);
    closeMobileMenuBtn?.addEventListener("click", closeMobileMenu);

    /* =====================================================
       CARRITO LOCALSTORAGE + UI
    ===================================================== */
    let cartPinnedOpen = false;

    function getCart() {
        try {
            const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCart();
        window.dispatchEvent(new CustomEvent("pp-cart-updated"));
    }

    function getCartCount(cart = getCart()) {
        return cart.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    }

    function getCartTotal(cart = getCart()) {
        return cart.reduce((acc, item) => {
            return acc + Number(item.precio_unitario || 0) * Number(item.cantidad || 0);
        }, 0);
    }

    function cartLineLabel(item) {
        const extras = [];
        if (item.modelo) extras.push(item.modelo);
        if (item.tipo === "bulto") extras.push("Por Bulto");
        else if (item.tipo === "unidad") extras.push("Por Unidad");
        return extras.join(" · ");
    }

    function renderCart() {
        const cart = getCart();

        if (cartBadge) {
            cartBadge.textContent = String(getCartCount(cart));
        }

        if (dropcartTotal) {
            dropcartTotal.textContent = money(getCartTotal(cart));
        }

        if (!dropcartItems) return;

        if (!cart.length) {
            dropcartItems.innerHTML = `<p class="empty">Tu carrito está vacío</p>`;
            return;
        }

        dropcartItems.innerHTML = cart.map((item, index) => {
            const lineTotal = Number(item.precio_unitario || 0) * Number(item.cantidad || 0);
            const label = cartLineLabel(item);

            return `
                <div class="dropcart-item" data-index="${index}">
                    <div class="dropcart-item-media">
                        <img src="${escapeHtml(item.imagen || "https://via.placeholder.com/80")}" alt="${escapeHtml(item.nombre || "Producto")}">
                    </div>
                    <div class="dropcart-item-info">
                        <strong>${escapeHtml(item.nombre || "Producto")}</strong>
                        ${label ? `<small>${escapeHtml(label)}</small>` : ""}
                        <small>Cantidad: ${Number(item.cantidad || 0)}</small>
                        <small>Unitario: ${money(item.precio_unitario || 0)}</small>
                        <strong>${money(lineTotal)}</strong>
                    </div>
                    <button class="dropcart-item-remove" type="button" data-remove-index="${index}" aria-label="Eliminar">✕</button>
                </div>
            `;
        }).join("");

        dropcartItems.querySelectorAll("[data-remove-index]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeCartIndex(Number(btn.dataset.removeIndex));
            });
        });
    }

    function removeCartIndex(index) {
        const cart = getCart();
        if (index < 0 || index >= cart.length) return;
        cart.splice(index, 1);
        saveCart(cart);
    }

    function emptyCart() {
        saveCart([]);
    }

    function openCart(pin = false) {
        if (!dropcart) return;
        if (pin) cartPinnedOpen = true;
        dropcart.classList.add("active");
        dropcart.setAttribute("aria-hidden", "false");
    }

    function closeCart(force = false) {
        if (!dropcart) return;

        if (!force && cartPinnedOpen) return;

        dropcart.classList.remove("active");
        dropcart.setAttribute("aria-hidden", "true");

        if (force) cartPinnedOpen = false;
    }

    function toggleCart() {
        if (!dropcart) return;

        const isOpen = dropcart.classList.contains("active");
        if (isOpen && cartPinnedOpen) {
            closeCart(true);
            return;
        }

        openCart(true);
    }

    if (cartContainer && dropcart) {
        cartContainer.addEventListener("mouseenter", () => {
            if (!cartPinnedOpen) openCart(false);
        });

        cartContainer.addEventListener("mouseleave", () => {
            if (!cartPinnedOpen) closeCart(false);
        });
    }

    cartToggle?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCart();
    });

    mobileCartBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCart();
    });

    dropcartClose?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeCart(true);
    });

    dropcartEmpty?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        emptyCart();
    });

    document.addEventListener("click", (e) => {
        if (!cartContainer?.contains(e.target)) {
            closeCart(true);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCart(true);
            closeMobileMenu();
        }
    });

    window.addEventListener("pp-cart-updated", renderCart);
    window.addEventListener("storage", (e) => {
        if (e.key === CART_KEY) renderCart();
    });

    renderCart();

    /* =====================================================
       MENU AUTO POR CATEGORÍA
    ===================================================== */
    function renderMenu(productosList) {
        if (!desktopMenu) return;

        const cats = {};

        productosList.forEach(p => {
            const cat = (p.categoria || "").trim();
            if (!cat) return;
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push(p);
        });

        desktopMenu.innerHTML = "";

        const mainDropdown = document.createElement("div");
        mainDropdown.className = "nav-item dropdown";

        mainDropdown.innerHTML = `
            <a href="javascript:void(0)">Todos los productos</a>
            <div class="dropdown-menu"></div>
        `;

        const dropdownMenu = mainDropdown.querySelector(".dropdown-menu");

        Object.entries(cats)
            .sort(([a], [b]) => a.localeCompare(b, "es"))
            .forEach(([cat, items]) => {
                const submenu = document.createElement("div");
                submenu.className = "dropdown-submenu";

                submenu.innerHTML = `<a href="/?cat=${encodeURIComponent(cat)}">${escapeHtml(cat)}</a>`;

                const subList = document.createElement("div");
                subList.className = "submenu";

                items
                    .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"))
                    .forEach(prod => {
                        subList.insertAdjacentHTML(
                            "beforeend",
                            `<a href="${buildProductUrl(prod)}">${escapeHtml(prod.nombre || "")}</a>`
                        );
                    });

                submenu.appendChild(subList);
                dropdownMenu.appendChild(submenu);
            });

        desktopMenu.appendChild(mainDropdown);

        const aboutItem = document.createElement("div");
        aboutItem.className = "nav-item";
        aboutItem.innerHTML = `<a href="/nosotros">¿Quiénes somos?</a>`;
        desktopMenu.appendChild(aboutItem);

        if (mobileMenuContent) {
            mobileMenuContent.innerHTML = desktopMenu.innerHTML;
        }
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
                <div class="card" onclick="location.href='${buildProductUrl(p)}'">
                    <img src="${escapeHtml(p.imagen || "https://via.placeholder.com/300")}" alt="${escapeHtml(p.nombre || "Producto")}">
                    <div class="info">
                        <div class="nombre">${escapeHtml(p.nombre || "")}</div>
                        <div class="desc">${escapeHtml(p.descripcion || "")}</div>
                        <div class="cat">${escapeHtml(p.categoria || "")}</div>
                        <div class="verproducto-btn" onclick="location.href='${buildProductUrl(p)}'">Ver producto</div>
                    </div>
                </div>
            `);
        });
    }

    /* =====================================================
       CARGAR PRODUCTOS
    ===================================================== */
    async function cargarProductos() {
        if (loader) loader.style.display = "block";

        const { data, error } = await db
            .from("productos")
            .select("*")
            .eq("activo", true)
            .order("orden");

        if (loader) loader.style.display = "none";

        if (error) {
            console.error("Error cargando productos:", error);
            if (grid) grid.innerHTML = "Error cargando productos";
            return;
        }

        productos = data || [];
        renderMenu(productos);
        render(productos);
    }

    await cargarProductos();

    /* =====================================================
       BUSCADOR
    ===================================================== */
    function filtrar(q) {
        q = String(q || "").toLowerCase();

        render(productos.filter(p =>
            (p.nombre || "").toLowerCase().includes(q) ||
            (p.descripcion || "").toLowerCase().includes(q) ||
            (p.categoria || "").toLowerCase().includes(q)
        ));
    }

    if (searchInput) {
        searchInput.oninput = () => filtrar(searchInput.value);
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                filtrar(searchInput.value);
            }
        });
    }

    if (mobileSearchInput) {
        mobileSearchInput.oninput = () => filtrar(mobileSearchInput.value);
        mobileSearchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                filtrar(mobileSearchInput.value);
                closeMobileMenu();
            }
        });
    }

    /* =====================================================
       AUTH UI
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
                <button class="account-trigger" type="button">Mi cuenta</button>
                <div class="account-menu">
                    <a href="/profile">Perfil</a>
                    <button id="logout-btn" type="button">Cerrar sesión</button>
                </div>
            </div>
        `;

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                await auth.auth.signOut();
                location.href = "/";
            };
        }
    }

    async function checkAuth() {
        const { data } = await auth.auth.getSession();
        data.session?.user ? renderLoggedIn(data.session.user) : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn(s.user) : renderLoggedOut();
    });

    if (mobileAccountBtn) {
        mobileAccountBtn.onclick = async () => {
            const { data } = await auth.auth.getSession();
            location.href = data.session ? "/profile" : "/login";
        };
    }

    /* =====================================================
       CHECKOUT
    ===================================================== */
    async function goToCheckout() {
        let cart;
        try {
            cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        } catch {
            cart = [];
        }

        if (!cart.length) {
            alert("El carrito está vacío");
            return;
        }

        const subtotal = cart.reduce((acc, item) => {
            return acc + Number(item.precio_unitario || 0) * Number(item.cantidad || 0);
        }, 0);

        const total = subtotal;

        const { data } = await auth.auth.getSession();
        const user = data.session?.user || null;
        const session_id = getOrCreateSessionId();

        const { data: inserted, error } = await db
            .from("carritos")
            .insert({
                user_id: user?.id || null,
                session_id: user ? null : session_id,
                items: cart,
                subtotal,
                total,
                status: "activo"
            })
            .select("id")
            .single();

        console.log("RESPUESTA CARRITO:", inserted, error);

        if (error || !inserted?.id) {
            console.error("Error creando carrito:", error, inserted);
            alert("Error creando carrito");
            return;
        }

        if (!inserted?.id) {
            console.error("Carrito sin ID:", inserted);
            alert("Error generando carrito");
            return;
        }

        location.href = `/checkout?cart=${encodeURIComponent(inserted.id)}`;
    }

    checkoutBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await goToCheckout();
    });
});
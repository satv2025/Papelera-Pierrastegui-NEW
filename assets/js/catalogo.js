import { auth, db } from "/assets/js/supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
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
        return cart.reduce((acc, item) => acc + Number(item.precio_unitario || 0) * Number(item.cantidad || 0), 0);
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

        if (cartBadge) cartBadge.textContent = String(getCartCount(cart));
        if (dropcartTotal) dropcartTotal.textContent = money(getCartTotal(cart));
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

                        <div class="dropcart-qty">
                            <button type="button" class="dropcart-qty-btn" data-action="minus" data-index="${index}" aria-label="Restar cantidad">−</button>
                            <span class="dropcart-qty-value">${Number(item.cantidad || 0)}</span>
                            <button type="button" class="dropcart-qty-btn" data-action="plus" data-index="${index}" aria-label="Sumar cantidad">+</button>
                        </div>

                        <small>Unitario: ${money(item.precio_unitario || 0)}</small>
                        <strong>${money(lineTotal)}</strong>
                    </div>
                    <button class="dropcart-item-remove" type="button" data-action="remove" data-index="${index}" aria-label="Eliminar">✕</button>
                </div>
            `;
        }).join("");
    }

    function changeCartQty(index, delta) {
        const cart = getCart();
        const item = cart[index];
        if (!item) return;

        const nuevaCantidad = Number(item.cantidad || 0) + Number(delta || 0);

        if (nuevaCantidad <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index] = { ...item, cantidad: nuevaCantidad };
        }

        saveCart(cart);
    }

    function bindDropcartActions() {
        if (!dropcartItems) return;
        if (dropcartItems.dataset.bound === "1") return;

        dropcartItems.dataset.bound = "1";

        dropcartItems.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-action]");
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            const index = Number(btn.dataset.index);
            if (Number.isNaN(index)) return;

            if (action === "plus") changeCartQty(index, 1);
            else if (action === "minus") changeCartQty(index, -1);
            else if (action === "remove") removeCartIndex(index);
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
        if (!cartContainer?.contains(e.target)) closeCart(true);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCart(true);
            closeMobileMenu();
            hideDesktopDropdown();
        }
    });

    window.addEventListener("pp-cart-updated", renderCart);
    window.addEventListener("storage", (e) => {
        if (e.key === CART_KEY) renderCart();
    });

    bindDropcartActions();
    renderCart();

    function getOrCreateDesktopDropdownPanel() {
        const navbar = document.querySelector(".main-navbar");
        if (!navbar) return null;

        let panel = document.getElementById("desktopProductsDropdown");
        if (!panel) {
            panel = document.createElement("div");
            panel.id = "desktopProductsDropdown";
            panel.className = "nav-dropdown-panel";
            navbar.appendChild(panel);
        }
        return panel;
    }

    function hideDesktopDropdown() {
        const panel = document.getElementById("desktopProductsDropdown");
        const trigger = document.getElementById("desktopProductsTrigger");
        panel?.classList.remove("show");
        trigger?.classList.remove("active");
    }

    function showDesktopDropdown() {
        const panel = document.getElementById("desktopProductsDropdown");
        const trigger = document.getElementById("desktopProductsTrigger");
        panel?.classList.add("show");
        trigger?.classList.add("active");
    }

    function bindDesktopDropdown() {
        const trigger = document.getElementById("desktopProductsTrigger");
        const panel = document.getElementById("desktopProductsDropdown");
        if (!trigger || !panel) return;

        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const willOpen = !panel.classList.contains("show");
            hideDesktopDropdown();
            if (willOpen) showDesktopDropdown();
        });

        trigger.addEventListener("mouseenter", showDesktopDropdown);
        panel.addEventListener("mouseenter", showDesktopDropdown);
        panel.addEventListener("mouseleave", hideDesktopDropdown);

        document.addEventListener("click", (e) => {
            if (!panel.contains(e.target) && !trigger.contains(e.target)) {
                hideDesktopDropdown();
            }
        });
    }

    function bindMobileDropdowns() {
        if (!mobileMenuContent) return;
        mobileMenuContent.querySelectorAll(".dropdown-submenu-trigger").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const parent = btn.closest(".dropdown-submenu");
                parent?.classList.toggle("active");
            });
        });
    }

    function renderMenu(productosList = [], currentPage = "catalogo") {
        const cats = {};

        productosList.forEach(p => {
            const cat = (p.categoria || "").trim();
            if (!cat) return;
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push(p);
        });

        if (desktopMenu) {
            desktopMenu.innerHTML = `
                <div class="nav-item">
                    <button class="nav-trigger-btn" id="desktopProductsTrigger" type="button">Todos los productos</button>
                </div>
                <div class="nav-item ${currentPage === "nosotros" ? "nav-item-about" : ""}">
                    <a href="/nosotros">¿Quiénes somos?</a>
                </div>
            `;
        }

        const panel = getOrCreateDesktopDropdownPanel();
        if (panel) {
            panel.innerHTML = Object.entries(cats)
                .sort(([a], [b]) => a.localeCompare(b, "es"))
                .map(([cat, items]) => `
                    <div class="dropdown-submenu">
                        <a href="/?cat=${encodeURIComponent(cat)}">${escapeHtml(cat)}</a>
                        <div class="submenu">
                            ${items
                        .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"))
                        .map(prod => `<a href="${buildProductUrl(prod)}">${escapeHtml(prod.nombre || "")}</a>`)
                        .join("")}
                        </div>
                    </div>
                `).join("") || `<a href="/" class="submenu-all">Ver catálogo</a>`;
        }

        bindDesktopDropdown();

        if (mobileMenuContent) {
            mobileMenuContent.innerHTML = `
                <div class="nav-items">
                    <div class="nav-item ${currentPage === "catalogo" ? "active" : ""}">
                        <a href="/">Inicio</a>
                    </div>
                    <div class="nav-item ${currentPage === "nosotros" ? "nav-item-about" : ""}">
                        <a href="/nosotros">¿Quiénes somos?</a>
                    </div>
                    ${Object.entries(cats)
                    .sort(([a], [b]) => a.localeCompare(b, "es"))
                    .map(([cat, items]) => `
                            <div class="dropdown-submenu">
                                <button class="dropdown-submenu-trigger" type="button">
                                    <span>${escapeHtml(cat)}</span>
                                    <span class="submenu-arrow">›</span>
                                </button>
                                <div class="submenu">
                                    <a href="/?cat=${encodeURIComponent(cat)}" class="submenu-all">Ver todo ${escapeHtml(cat)}</a>
                                    ${items
                            .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"))
                            .map(prod => `<a href="${buildProductUrl(prod)}">${escapeHtml(prod.nombre || "")}</a>`)
                            .join("")}
                                </div>
                            </div>
                        `).join("")}
                </div>
            `;
            bindMobileDropdowns();
        }
    }

    function render(list) {

        if (!grid) return;
        grid.innerHTML = "";

        if (!list.length) {
            grid.innerHTML = "<p>No hay productos</p>";
            return;
        }

        list.forEach(p => {

            const sinStock = p.sin_stock || Number(p.stock || 0) === 0;
            const tieneDescuento = p.oferta && Number(p.descuento || 0) > 0;

            const precioBase = Number(p.precio_unidad || 0);
            const precioFinal = tieneDescuento
                ? Math.round(precioBase * (1 - (Number(p.descuento) / 100)))
                : precioBase;

            grid.insertAdjacentHTML("beforeend", `
                <div class="card ${sinStock ? "card-sin-stock" : ""}"
                     onclick="location.href='${buildProductUrl(p)}'">
                    
                    <img 
                        src="${escapeHtml(p.imagen || "https://via.placeholder.com/300")}" 
                        alt="${escapeHtml(p.nombre || "")}"
                    >
    
                    <div class="info">
    
                        <div class="badges">
                            ${p.nuevo ? `<span class="badge badge-nuevo">NUEVO</span>` : ""}
                            ${sinStock ? `<span class="badge badge-stock">SIN STOCK</span>` : ""}
                            ${tieneDescuento ? `<span class="badge badge-descuento">-${p.descuento}%</span>` : ""}
                        </div>
    
                        <div class="nombre">${escapeHtml(p.nombre || "")}</div>
                        <div class="desc">${escapeHtml(p.descripcion || "")}</div>
                        <div class="cat">${escapeHtml(p.categoria || "")}</div>
    
                        <button class="verproducto-btn"
                            onclick="event.stopPropagation();location.href='${buildProductUrl(p)}'">
                            Ver producto
                        </button>
                    </div>
                </div>
            `);
        });
    }

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
            renderMenu([], "catalogo");
            return;
        }

        productos = data || [];
        renderMenu(productos, "catalogo");
        render(productos);
    }

    await cargarProductos();

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

    document.querySelector(".pp-search-btn")?.addEventListener("click", () => {
        filtrar(searchInput?.value || "");
    });

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

    function renderLoggedOut() {
        if (!accountContainer) return;
        accountContainer.innerHTML = `<a class="btn-login" href="/login">Acceder</a>`;
    }

    function renderLoggedIn() {
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

        document.getElementById("logout-btn")?.addEventListener("click", async () => {
            await auth.auth.signOut();
            location.href = "/";
        });
    }

    async function checkAuth() {
        const { data } = await auth.auth.getSession();
        data.session?.user ? renderLoggedIn() : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn() : renderLoggedOut();
    });

    mobileAccountBtn?.addEventListener("click", async () => {
        const { data } = await auth.auth.getSession();
        location.href = data.session ? "/profile" : "/login";
    });

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

        const subtotal = cart.reduce((acc, item) => acc + Number(item.precio_unitario || 0) * Number(item.cantidad || 0), 0);
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

        if (error || !inserted?.id) {
            console.error("Error creando carrito:", error, inserted);
            alert("Error creando carrito");
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
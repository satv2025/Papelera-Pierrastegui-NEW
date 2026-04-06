import { auth, db } from "/assets/js/supabaseClient.js";

(function () {
    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");
    const slug = qs.get("slug") || qs.get("nombre") || "";
    const css = document.getElementById("todo-css");
    if (css) {
        css.href = `assets/css/todo-en-uno.css?pid=${encodeURIComponent(id || "")}&slug=${encodeURIComponent(slug || "")}`;
    }
})();

function money(n) {
    return "$" + Number(n || 0).toLocaleString("es-AR");
}

function parseVariantes(raw) {
    if (!raw) return { drop1: [], drop2: [] };
    if (typeof raw === "string") {
        try {
            return JSON.parse(raw);
        } catch {
            return { drop1: [], drop2: [] };
        }
    }
    return raw;
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

document.addEventListener("DOMContentLoaded", async () => {
    const img = document.getElementById("producto-img");
    const nombre = document.getElementById("producto-nombre");
    const desc = document.getElementById("producto-desc");

    const decBtn = document.getElementById("decrementar");
    const incBtn = document.getElementById("incrementar");
    const cantidadVisual = document.getElementById("cantidad-visual");
    const totalDisplay = document.getElementById("totalDisplay");
    const dropdownsWrap = document.getElementById("dynamic-dropdowns");

    const searchInput = document.getElementById("search-input");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    const desktopMenu = document.getElementById("desktopMenu");
    const mobileMenuContent = document.getElementById("mobileMenuContent");

    const accountContainer =
        document.querySelector(".pp-account") ||
        document.getElementById("account-container");

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

    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");
    if (!id) return;

    let productos = [];
    let cantidad = 1;
    let selectedModel = null;
    let selectedType = "";
    let currentProduct = null;

    const CART_KEY = "pp_cart";
    const SESSION_KEY = "pp_session_id";

    function getOrCreateSessionId() {
        let sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    function goToSearchResult(q) {
        const value = String(q || "").trim().toLowerCase();
        if (!value) {
            location.href = "/";
            return;
        }

        const first = productos.find(p =>
            (p.nombre || "").toLowerCase().includes(value) ||
            (p.descripcion || "").toLowerCase().includes(value) ||
            (p.categoria || "").toLowerCase().includes(value)
        );

        if (first) {
            location.href = buildProductUrl(first);
            return;
        }

        location.href = `/?q=${encodeURIComponent(q)}`;
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

    function renderMenu(productosList = [], currentPage = "producto") {
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
                    <div class="nav-item">
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

    async function cargarProductos() {
        const { data, error } = await db
            .from("productos")
            .select("*")
            .eq("activo", true)
            .order("orden");

        if (error) {
            console.error("Error cargando productos para menú:", error);
            renderMenu([], "producto");
            return [];
        }

        productos = data || [];
        renderMenu(productos, "producto");
        return productos;
    }

    searchInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goToSearchResult(searchInput.value);
        }
    });

    mobileSearchInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goToSearchResult(mobileSearchInput.value);
            closeMobileMenu();
        }
    });

    document.querySelector(".pp-search-btn")?.addEventListener("click", () => {
        goToSearchResult(searchInput?.value || "");
    });

    const { data: p, error } = await db.from("productos").select("*").eq("id", id).maybeSingle();
    if (error || !p) return;

    currentProduct = p;
    await cargarProductos();

    document.title = `${p.nombre} | Papelera Pierrastegui`;
    if (nombre) nombre.textContent = p.nombre || "";
    if (desc) desc.textContent = p.descripcion || "";
    if (img) img.src = p.imagen || "";

    const variantes = parseVariantes(p.variantes);
    const modelOptions = Array.isArray(variantes?.drop1) ? variantes.drop1 : [];
    const typeOptionsRaw = Array.isArray(variantes?.drop2) ? variantes.drop2 : [];

    const hasModelOptions = modelOptions.length > 0;
    const hasTypeOptions = typeOptionsRaw.length > 0;
    const hasAnyOptions = hasModelOptions || hasTypeOptions;

    const typeOptions = hasTypeOptions
        ? typeOptionsRaw
        : [
            { label: "Por Unidad", meta: "unidad" },
            { label: "Por Bulto", meta: "bulto" }
        ];

    function normalizeType(raw) {
        const value = String(raw || "").toLowerCase();
        if (value.includes("bulto") || value.includes("x mayor") || value.includes("mayor") || value.includes("pack")) {
            return "bulto";
        }
        return "unidad";
    }

    function getModelPriceByType(model, type) {
        if (!model) return 0;
        return type === "bulto"
            ? Number(model.precio_bulto || 0)
            : Number(model.precio_unidad || 0);
    }

    function getFallbackPriceByType(type) {
        return type === "bulto"
            ? Number(p.precio_bulto || 0)
            : Number(p.precio_unidad || 0);
    }

    function getCurrentUnitPrice() {
        if (!hasAnyOptions) return Number(p.precio_unidad || 0);
        if (hasModelOptions && !selectedModel) return 0;
        if (!selectedType) return 0;

        const modelPrice = getModelPriceByType(selectedModel, selectedType);
        if (modelPrice > 0) return modelPrice;
        return getFallbackPriceByType(selectedType);
    }

    function getCurrentBultoCant() {
        return Number(selectedModel?.bulto_cant || p.bulto_cant || 0);
    }

    function updateTotal() {
        if (!totalDisplay) return;

        if (!hasAnyOptions) {
            const total = Number(p.precio_unidad || 0) * cantidad;
            totalDisplay.textContent = "Total: " + money(total);
            return;
        }

        if (hasModelOptions && !selectedModel) {
            totalDisplay.textContent = "Total: $0";
            return;
        }

        if (!selectedType) {
            totalDisplay.textContent = "Total: $0";
            return;
        }

        const total = getCurrentUnitPrice() * cantidad;
        totalDisplay.textContent = "Total: " + money(total);
    }

    function updateProductImage() {
        if (!img) return;
        img.src = selectedModel?.img || p.imagen || "";
    }

    function updateTypeVisibility() {
        const typeDropdown = document.getElementById("pp-type-dropdown");
        if (!typeDropdown) return;

        if (!hasTypeOptions && !hasModelOptions) {
            typeDropdown.style.display = "none";
            return;
        }

        if (hasModelOptions) {
            typeDropdown.style.display = selectedModel ? "block" : "none";
            return;
        }

        typeDropdown.style.display = "block";
    }

    function updateExtraInfo() {
        const extra = document.getElementById("dropdown-extra-info");
        if (!extra) return;

        if (!hasAnyOptions) {
            extra.innerHTML = p.bulto_cant
                ? `<small>Bulto de ${Number(p.bulto_cant)} unidades</small>`
                : "";
            return;
        }

        if (hasModelOptions && !selectedModel) {
            extra.innerHTML = "";
            return;
        }

        if (!selectedType) {
            extra.innerHTML = "";
            return;
        }

        if (selectedType === "bulto") {
            const bultoCant = getCurrentBultoCant();
            extra.innerHTML = bultoCant
                ? `<small>Bulto de ${bultoCant} unidades</small>`
                : `<small>Precio por bulto</small>`;
            return;
        }

        extra.innerHTML = `<small>Precio por unidad</small>`;
    }

    function closeDropdown(dropdown) {
        if (!dropdown) return;
        dropdown.querySelector(".dropdown-btn")?.classList.remove("active");
        dropdown.querySelector(".dropdown-menu")?.classList.remove("active");
    }

    function bindDropdownToggle(dropdown, onToggle) {
        const btn = dropdown?.querySelector(".dropdown-btn");
        const menu = dropdown?.querySelector(".dropdown-menu");

        btn?.addEventListener("click", () => {
            const willOpen = !menu?.classList.contains("active");
            if (typeof onToggle === "function") {
                const allowed = onToggle(willOpen);
                if (allowed === false) return;
            }
            menu?.classList.toggle("active");
            btn.classList.toggle("active");
        });
    }

    function renderNoOptionsView() {
        if (!dropdownsWrap) return;
        dropdownsWrap.innerHTML = `
            <div class="pp-product-price-info">
                <p><strong>Precio:</strong> ${money(p.precio_unidad || 0)}</p>
                ${p.bulto_cant ? `<small>Bulto de ${Number(p.bulto_cant)} unidades</small>` : ""}
            </div>
        `;
    }

    function renderOnlyTypeDropdown() {
        if (!dropdownsWrap) return;

        const typePlaceholder = p.dropdown2_placeholder || "Seleccioná el tipo";

        dropdownsWrap.innerHTML = `
            <div class="dropdown pp-product-dropdown" id="pp-type-dropdown">
                <button class="dropdown-btn" type="button">
                    <span class="text">${escapeHtml(typePlaceholder)}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="dropdown-menu">
                    ${typeOptions.map(item => `
                        <div class="dropdown-item" data-type="${escapeHtml(String(item.meta || item.label || "").toLowerCase())}">
                            ${escapeHtml(item.label || "")}
                        </div>
                    `).join("")}
                </div>
            </div>
            <div id="dropdown-extra-info" class="pp-dropdown-extra"></div>
        `;

        const typeDropdown = document.getElementById("pp-type-dropdown");
        const typeBtn = typeDropdown?.querySelector(".dropdown-btn");
        const typeItems = typeDropdown?.querySelectorAll(".dropdown-item") || [];

        bindDropdownToggle(typeDropdown);

        typeItems.forEach(item => {
            item.addEventListener("click", () => {
                typeItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");
                selectedType = normalizeType(item.dataset.type || item.textContent || "");
                typeBtn?.querySelector(".text")?.replaceChildren(document.createTextNode(item.textContent.trim()));
                updateExtraInfo();
                updateTotal();
                closeDropdown(typeDropdown);
            });
        });

        document.addEventListener("click", (e) => {
            if (!typeDropdown?.contains(e.target)) closeDropdown(typeDropdown);
        });

        updateExtraInfo();
        updateTotal();
    }

    function renderOnlyModelDropdown() {
        if (!dropdownsWrap) return;

        const modelPlaceholder = p.dropdown1_placeholder || "Seleccioná una opción";

        dropdownsWrap.innerHTML = `
            <div class="dropdown pp-product-dropdown" id="pp-model-dropdown">
                <button class="dropdown-btn" type="button">
                    <span class="text">${escapeHtml(modelPlaceholder)}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="dropdown-menu">
                    ${modelOptions.map((item, index) => `
                        <div class="dropdown-item" data-index="${index}">
                            ${escapeHtml(item.label || `Opción ${index + 1}`)}
                        </div>
                    `).join("")}
                </div>
            </div>
            <div id="dropdown-extra-info" class="pp-dropdown-extra"></div>
        `;

        const modelDropdown = document.getElementById("pp-model-dropdown");
        const modelBtn = modelDropdown?.querySelector(".dropdown-btn");
        const modelItems = modelDropdown?.querySelectorAll(".dropdown-item") || [];

        bindDropdownToggle(modelDropdown);

        modelItems.forEach(item => {
            item.addEventListener("click", () => {
                modelItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");
                selectedModel = modelOptions[Number(item.dataset.index)] || null;
                modelBtn?.querySelector(".text")?.replaceChildren(document.createTextNode(item.textContent.trim()));
                selectedType = "unidad";
                updateProductImage();
                updateExtraInfo();
                updateTotal();
                closeDropdown(modelDropdown);
            });
        });

        document.addEventListener("click", (e) => {
            if (!modelDropdown?.contains(e.target)) closeDropdown(modelDropdown);
        });

        updateExtraInfo();
        updateTotal();
    }

    function renderModelAndTypeDropdowns() {
        if (!dropdownsWrap) return;

        const modelPlaceholder = p.dropdown1_placeholder || "Seleccioná una opción";
        const typePlaceholder = p.dropdown2_placeholder || "Seleccioná el tipo";

        dropdownsWrap.innerHTML = `
            <div class="dropdown pp-product-dropdown" id="pp-model-dropdown">
                <button class="dropdown-btn" type="button">
                    <span class="text">${escapeHtml(modelPlaceholder)}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="dropdown-menu">
                    ${modelOptions.map((item, index) => `
                        <div class="dropdown-item" data-index="${index}">
                            ${escapeHtml(item.label || `Opción ${index + 1}`)}
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="dropdown pp-product-dropdown" id="pp-type-dropdown" style="display:none;">
                <button class="dropdown-btn" type="button">
                    <span class="text">${escapeHtml(typePlaceholder)}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="dropdown-menu">
                    ${typeOptions.map(item => `
                        <div class="dropdown-item" data-type="${escapeHtml(String(item.meta || item.label || "").toLowerCase())}">
                            ${escapeHtml(item.label || "")}
                        </div>
                    `).join("")}
                </div>
            </div>

            <div id="dropdown-extra-info" class="pp-dropdown-extra"></div>
        `;

        const modelDropdown = document.getElementById("pp-model-dropdown");
        const modelBtn = modelDropdown?.querySelector(".dropdown-btn");
        const modelItems = modelDropdown?.querySelectorAll(".dropdown-item") || [];

        const typeDropdown = document.getElementById("pp-type-dropdown");
        const typeBtn = typeDropdown?.querySelector(".dropdown-btn");
        const typeItems = typeDropdown?.querySelectorAll(".dropdown-item") || [];

        bindDropdownToggle(modelDropdown, () => {
            closeDropdown(typeDropdown);
            return true;
        });

        bindDropdownToggle(typeDropdown, () => {
            if (!selectedModel) return false;
            closeDropdown(modelDropdown);
            return true;
        });

        modelItems.forEach(item => {
            item.addEventListener("click", () => {
                modelItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");

                selectedModel = modelOptions[Number(item.dataset.index)] || null;
                modelBtn?.querySelector(".text")?.replaceChildren(document.createTextNode(item.textContent.trim()));

                selectedType = "";
                typeItems.forEach(i => i.classList.remove("selected"));
                if (typeBtn) {
                    typeBtn.querySelector(".text")?.replaceChildren(document.createTextNode(typePlaceholder));
                }

                updateProductImage();
                updateTypeVisibility();
                updateExtraInfo();
                updateTotal();
                closeDropdown(modelDropdown);
            });
        });

        typeItems.forEach(item => {
            item.addEventListener("click", () => {
                typeItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");
                selectedType = normalizeType(item.dataset.type || item.textContent || "");
                typeBtn?.querySelector(".text")?.replaceChildren(document.createTextNode(item.textContent.trim()));
                updateExtraInfo();
                updateTotal();
                closeDropdown(typeDropdown);
            });
        });

        document.addEventListener("click", (e) => {
            if (!modelDropdown?.contains(e.target)) closeDropdown(modelDropdown);
            if (!typeDropdown?.contains(e.target)) closeDropdown(typeDropdown);
        });

        updateTypeVisibility();
        updateExtraInfo();
        updateTotal();
    }

    function renderDropdowns() {
        if (!hasAnyOptions) return renderNoOptionsView();
        if (hasModelOptions && hasTypeOptions) return renderModelAndTypeDropdowns();
        if (hasModelOptions && !hasTypeOptions) return renderOnlyModelDropdown();
        if (!hasModelOptions && hasTypeOptions) return renderOnlyTypeDropdown();
    }

    if (cantidadVisual) cantidadVisual.textContent = cantidad;

    incBtn?.addEventListener("click", () => {
        cantidad++;
        if (cantidadVisual) cantidadVisual.textContent = cantidad;
        updateTotal();
    });

    decBtn?.addEventListener("click", () => {
        if (cantidad > 1) cantidad--;
        if (cantidadVisual) cantidadVisual.textContent = cantidad;
        updateTotal();
    });

    renderDropdowns();
    updateProductImage();
    updateTotal();

    function renderLoggedOut() {
        if (!accountContainer) return;
        accountContainer.innerHTML = `<a class="btn-login" href="/login">Acceder</a>`;
    }

    function renderLoggedIn(user) {
        if (!accountContainer || !user) return;

        accountContainer.innerHTML = `
            <div class="account-dropdown">
                <button class="account-trigger" type="button">Mi Cuenta</button>
                <div class="account-menu">
                    <a href="/profile">Editar perfil</a>
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
        data.session?.user ? renderLoggedIn(data.session.user) : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn(s.user) : renderLoggedOut();
    });

    mobileAccountBtn?.addEventListener("click", async () => {
        const { data } = await auth.auth.getSession();
        location.href = data.session ? "/profile" : "/login";
    });

    const addToCartBtn = document.getElementById("addToCartBtn");

    function mergeCartItem(cart, payload) {
        const foundIndex = cart.findIndex(item =>
            String(item.id) === String(payload.id) &&
            String(item.modelo || "") === String(payload.modelo || "") &&
            String(item.tipo || "") === String(payload.tipo || "")
        );

        if (foundIndex >= 0) {
            cart[foundIndex].cantidad = Number(cart[foundIndex].cantidad || 0) + Number(payload.cantidad || 0);
            return cart;
        }

        cart.push(payload);
        return cart;
    }

    addToCartBtn?.addEventListener("click", () => {
        if (!currentProduct) return;

        if (hasModelOptions && !selectedModel) {
            alert("Seleccioná un modelo antes de agregar al carrito.");
            return;
        }

        if (hasAnyOptions && !selectedType) {
            alert("Seleccioná un tipo antes de agregar al carrito.");
            return;
        }

        const payload = {
            id: currentProduct.id,
            nombre: currentProduct.nombre,
            slug: currentProduct.slug || "",
            imagen: selectedModel?.img || currentProduct.imagen || "",
            cantidad,
            modelo: hasModelOptions ? (selectedModel?.label || null) : null,
            tipo: hasAnyOptions ? selectedType : "unidad",
            precio_unitario: getCurrentUnitPrice(),
            bulto_cant: hasAnyOptions ? getCurrentBultoCant() : Number(currentProduct.bulto_cant || 0)
        };

        const cart = getCart();
        mergeCartItem(cart, payload);
        saveCart(cart);
        openCart(true);
        alert("Producto agregado al carrito");
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
            console.error(error);
            alert("Error creando carrito");
            return;
        }

        location.href = `/checkout?cart=${inserted.id}`;
    }

    checkoutBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToCheckout();
    });
});
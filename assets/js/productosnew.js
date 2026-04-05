import { auth, db } from "/assets/js/supabaseClient.js";

/* =====================================================
   CSS DINÁMICO
===================================================== */
(function () {
    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");
    const slug = qs.get("slug") || qs.get("nombre") || "";

    const css = document.getElementById("todo-css");
    if (css) {
        css.href =
            `assets/css/todo-en-uno.css?pid=${encodeURIComponent(id || "")}&slug=${encodeURIComponent(slug || "")}`;
    }
})();

/* =====================================================
   HELPERS
===================================================== */
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

/* =====================================================
   TODO UNIFICADO
===================================================== */
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

    const qs = new URLSearchParams(location.search);
    const id = qs.get("id");

    if (!id) return;

    let productos = [];
    let cantidad = 1;
    let selectedModel = null;
    let selectedType = "";
    let currentProduct = null;

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
       MENÚ AUTO POR CATEGORÍA
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
            .forEach(([cat, prods]) => {
                const submenu = document.createElement("div");
                submenu.className = "dropdown-submenu";

                submenu.innerHTML = `<a href="/?cat=${encodeURIComponent(cat)}">${escapeHtml(cat)}</a>`;

                const subList = document.createElement("div");
                subList.className = "submenu";

                prods
                    .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"))
                    .forEach(prod => {
                        subList.insertAdjacentHTML(
                            "beforeend",
                            `<a href="/producto?id=${prod.id}&slug=${encodeURIComponent(prod.slug || "")}">
                                ${escapeHtml(prod.nombre || "")}
                            </a>`
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
       CARGA GENERAL DE PRODUCTOS PARA MENÚ + BÚSQUEDA
    ===================================================== */
    async function cargarProductos() {
        const { data, error } = await db
            .from("productos")
            .select("*")
            .eq("activo", true)
            .order("orden");

        if (error) {
            console.error("Error cargando productos para menú:", error);
            return [];
        }

        productos = data || [];
        renderMenu(productos);
        return productos;
    }

    /* =====================================================
       BÚSQUEDA HEADER
    ===================================================== */
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
            location.href = `/producto?id=${first.id}&slug=${encodeURIComponent(first.slug || "")}`;
            return;
        }

        location.href = `/?q=${encodeURIComponent(q)}`;
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

    /* =====================================================
       CARGAR PRODUCTO ACTUAL
    ===================================================== */
    const { data: p, error } =
        await db.from("productos").select("*").eq("id", id).maybeSingle();

    if (error || !p) return;

    currentProduct = p;

    await cargarProductos();

    /* =====================================================
       RENDER BÁSICO PRODUCTO
    ===================================================== */
    document.title = `${p.nombre} | Papelera Pierrastegui`;

    if (nombre) nombre.textContent = p.nombre;
    if (desc) desc.textContent = p.descripcion || "";
    if (img) img.src = p.imagen || "";

    /* =====================================================
       DROPDOWNS + PRECIO + CANTIDAD
    ===================================================== */
    const variantes = parseVariantes(p.variantes);
    const modelOptions = Array.isArray(variantes?.drop1) ? variantes.drop1 : [];
    const typeOptionsRaw = Array.isArray(variantes?.drop2) ? variantes.drop2 : [];

    const typeOptions = typeOptionsRaw.length
        ? typeOptionsRaw
        : [
            { label: "Por Unidad", meta: "unidad" },
            { label: "Por Bulto", meta: "bulto" }
        ];

    function getModelPriceByType(model, type) {
        if (!model) return 0;

        if (type === "bulto") {
            return Number(model.precio_bulto || 0);
        }

        return Number(model.precio_unidad || 0);
    }

    function getFallbackPriceByType(type) {
        if (type === "bulto") {
            return Number(p.precio_bulto || 0);
        }

        return Number(p.precio_unidad || 0);
    }

    function getCurrentUnitPrice() {
        if (!selectedType) return 0;

        const modelPrice = getModelPriceByType(selectedModel, selectedType);
        if (modelPrice > 0) return modelPrice;

        return getFallbackPriceByType(selectedType);
    }

    function getCurrentBultoCant() {
        return Number(
            selectedModel?.bulto_cant ||
            p.bulto_cant ||
            0
        );
    }

    function updateTotal() {
        if (!totalDisplay) return;

        if (!selectedModel || !selectedType) {
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

        typeDropdown.style.display = selectedModel ? "block" : "none";
    }

    function updateExtraInfo() {
        const extra = document.getElementById("dropdown-extra-info");
        if (!extra) return;

        if (!selectedModel || !selectedType) {
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
        const btn = dropdown.querySelector(".dropdown-btn");
        const menu = dropdown.querySelector(".dropdown-menu");

        btn?.classList.remove("active");
        menu?.classList.remove("active");
    }

    function renderDropdowns() {
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
        const modelMenu = modelDropdown?.querySelector(".dropdown-menu");
        const modelItems = modelDropdown?.querySelectorAll(".dropdown-item") || [];

        const typeDropdown = document.getElementById("pp-type-dropdown");
        const typeBtn = typeDropdown?.querySelector(".dropdown-btn");
        const typeMenu = typeDropdown?.querySelector(".dropdown-menu");
        const typeItems = typeDropdown?.querySelectorAll(".dropdown-item") || [];

        modelBtn?.addEventListener("click", () => {
            modelMenu?.classList.toggle("active");
            modelBtn.classList.toggle("active");
            closeDropdown(typeDropdown);
        });

        modelItems.forEach(item => {
            item.addEventListener("click", () => {
                modelItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");

                const index = Number(item.dataset.index);
                selectedModel = modelOptions[index] || null;

                modelBtn.querySelector(".text").textContent = item.textContent.trim();

                selectedType = "";
                typeItems.forEach(i => i.classList.remove("selected"));
                if (typeBtn) {
                    typeBtn.querySelector(".text").textContent = typePlaceholder;
                }

                updateProductImage();
                updateTypeVisibility();
                updateExtraInfo();
                updateTotal();

                closeDropdown(modelDropdown);
            });
        });

        typeBtn?.addEventListener("click", () => {
            if (!selectedModel) return;

            typeMenu?.classList.toggle("active");
            typeBtn.classList.toggle("active");
            closeDropdown(modelDropdown);
        });

        typeItems.forEach(item => {
            item.addEventListener("click", () => {
                typeItems.forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");

                const rawType = String(item.dataset.type || "").toLowerCase();

                if (rawType.includes("bulto") || rawType.includes("x") || rawType.includes("mayor")) {
                    selectedType = "bulto";
                } else {
                    selectedType = "unidad";
                }

                typeBtn.querySelector(".text").textContent = item.textContent.trim();

                updateExtraInfo();
                updateTotal();

                closeDropdown(typeDropdown);
            });
        });

        document.addEventListener("click", (e) => {
            if (!modelDropdown?.contains(e.target)) {
                closeDropdown(modelDropdown);
            }

            if (!typeDropdown?.contains(e.target)) {
                closeDropdown(typeDropdown);
            }
        });
    }

    if (cantidadVisual) cantidadVisual.textContent = cantidad;

    if (incBtn) {
        incBtn.onclick = () => {
            cantidad++;
            cantidadVisual.textContent = cantidad;
            updateTotal();
        };
    }

    if (decBtn) {
        decBtn.onclick = () => {
            if (cantidad > 1) cantidad--;
            cantidadVisual.textContent = cantidad;
            updateTotal();
        };
    }

    renderDropdowns();
    updateProductImage();
    updateTotal();

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
        if (!accountContainer || !user) return;

        accountContainer.innerHTML = `
            <div class="account-dropdown">
                <button class="account-trigger">${escapeHtml(user.email || "Mi cuenta")}</button>
                <div class="account-menu">
                    <a href="/perfil">Editar perfil</a>
                    <button id="logout-btn">Cerrar sesión</button>
                </div>
            </div>
        `;

        document.getElementById("logout-btn").onclick = async () => {
            await auth.auth.signOut();
            location.href = "/";
        };
    }

    async function checkAuth() {
        const { data } = await auth.auth.getSession();
        data.session?.user
            ? renderLoggedIn(data.session.user)
            : renderLoggedOut();
    }

    await checkAuth();

    auth.auth.onAuthStateChange((_e, s) => {
        s?.user ? renderLoggedIn(s.user) : renderLoggedOut();
    });

    if (mobileAccountBtn) {
        mobileAccountBtn.onclick = async () => {
            const { data } = await auth.auth.getSession();
            location.href = data.session ? "/perfil" : "/login";
        };
    }

    /* =====================================================
       ADD TO CART
    ===================================================== */
    const addToCartBtn = document.getElementById("addToCartBtn");

    addToCartBtn?.addEventListener("click", () => {
        if (!currentProduct) return;

        if (!selectedModel || !selectedType) {
            alert("Seleccioná un modelo y un tipo antes de agregar al carrito.");
            return;
        }

        const payload = {
            id: currentProduct.id,
            nombre: currentProduct.nombre,
            slug: currentProduct.slug || "",
            imagen: selectedModel?.img || currentProduct.imagen || "",
            cantidad,
            modelo: selectedModel?.label || null,
            tipo: selectedType,
            precio_unitario: getCurrentUnitPrice(),
            bulto_cant: getCurrentBultoCant()
        };

        const currentCart = JSON.parse(localStorage.getItem("pp_cart") || "[]");
        currentCart.push(payload);
        localStorage.setItem("pp_cart", JSON.stringify(currentCart));

        window.dispatchEvent(new CustomEvent("pp-cart-updated"));
        alert("Producto agregado al carrito");
    });
});
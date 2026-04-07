import { auth, db } from "/assets/js/supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
    const ORIGEN = {
        nombre: "Papelera Pierrastegui",
        direccion: "Anunciación 3796, Morón, Buenos Aires, Argentina",
        lat: -34.6539,
        lon: -58.6192
    };

    const TARIFA = {
        porKm: 200
    };

    const CART_KEY = "pp_cart";

    const state = {
        carrito: null,
        items: [],
        metodoEntrega: "retiro",
        costoEnvio: 0,
        subtotal: 0,
        total: 0,
        distanciaKm: 0,
        duracionMin: 0,
        cotizando: false,
        guardandoCarrito: false,
        envioCostoTextoInicial: ""
    };

    const els = {
        checkoutItems: document.getElementById("checkout-items"),
        checkoutTotals: document.getElementById("checkout-totals"),
        btnPagar: document.getElementById("btn-pagar"),
        loader: document.getElementById("checkout-loader"),
        error: document.getElementById("checkout-error"),

        opcionesEnvio: document.querySelectorAll(".envio-opcion"),
        direccionContainer: document.getElementById("direccion-container"),
        direccionInput: document.getElementById("chk-direccion"),
        envioCostoTexto: document.getElementById("envio-costo-texto"),

        nombre: document.getElementById("chk-nombre"),
        email: document.getElementById("chk-email"),
        telefono: document.getElementById("chk-telefono"),

        shippingInfo: document.getElementById("shipping-info"),
        shippingDistance: document.getElementById("shipping-distance"),
        shippingDuration: document.getElementById("shipping-duration"),

        desktopMenu: document.getElementById("desktopMenu"),
        mobileMenuContent: document.getElementById("mobileMenuContent"),
        mobileMenu: document.getElementById("mobileMenu"),
        mobileMenuBtn: document.getElementById("mobile-menu-btn"),
        closeMobileMenuBtn: document.getElementById("closeMobileMenu"),
        mobileSearchInput: document.getElementById("mobile-search-input")
    };

    let productos = [];

    state.envioCostoTextoInicial =
        els.envioCostoTexto?.textContent?.trim() ||
        "El costo de envío se calcula según la distancia";

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

    function buildItemDescription(it) {
        const parts = [];
        if (it.modelo) parts.push(it.modelo);
        if (it.tipo === "bulto") parts.push("Por Bulto");
        if (it.tipo === "unidad") parts.push("Por Unidad");
        return parts.join(" · ");
    }

    function calcularSubtotal() {
        return state.items.reduce((acc, it) => {
            return acc + Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
        }, 0);
    }

    function calcularCostoEnvioPorDistancia(km) {
        return Math.round(km * TARIFA.porKm);
    }

    function resetShipping() {
        state.costoEnvio = 0;
        state.distanciaKm = 0;
        state.duracionMin = 0;
        renderTotals();
        renderShippingInfo();
    }

    function openMobileMenu() {
        if (!els.mobileMenu) return;
        els.mobileMenu.classList.add("active");
        els.mobileMenu.setAttribute("aria-hidden", "false");
    }

    function closeMobileMenu() {
        if (!els.mobileMenu) return;
        els.mobileMenu.classList.remove("active");
        els.mobileMenu.setAttribute("aria-hidden", "true");
    }

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
        if (!els.mobileMenuContent) return;

        els.mobileMenuContent.querySelectorAll(".dropdown-submenu-trigger").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const parent = btn.closest(".dropdown-submenu");
                parent?.classList.toggle("active");
            });
        });
    }

    function renderMenu(productosList = [], currentPage = "checkout") {
        const cats = {};

        productosList.forEach((p) => {
            const cat = (p.categoria || "").trim();
            if (!cat) return;
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push(p);
        });

        if (els.desktopMenu) {
            els.desktopMenu.innerHTML = `
                <div class="nav-item">
                    <button class="nav-trigger-btn" id="desktopProductsTrigger" type="button">
                        Todos los productos
                    </button>
                </div>
                <div class="nav-item nav-item-about">
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
                        .map((prod) => `<a href="${buildProductUrl(prod)}">${escapeHtml(prod.nombre || "")}</a>`)
                        .join("")}
                        </div>
                    </div>
                `).join("") || `<a href="/" class="submenu-all">Ver catálogo</a>`;
        }

        bindDesktopDropdown();

        if (els.mobileMenuContent) {
            els.mobileMenuContent.innerHTML = `
                <div class="nav-items">
                    <div class="nav-item">
                        <a href="/">Inicio</a>
                    </div>

                    <div class="nav-item nav-item-about">
                        <a href="/nosotros">¿Quiénes somos?</a>
                    </div>

                    <div class="nav-item active">
                        <a href="/checkout">Checkout</a>
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
                                    <a href="/?cat=${encodeURIComponent(cat)}" class="submenu-all">
                                        Ver todo ${escapeHtml(cat)}
                                    </a>
                                    ${items
                            .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"))
                            .map((prod) => `<a href="${buildProductUrl(prod)}">${escapeHtml(prod.nombre || "")}</a>`)
                            .join("")}
                                </div>
                            </div>
                        `).join("")}
                </div>
            `;

            bindMobileDropdowns();
        }
    }

    async function cargarProductosParaNav() {
        const { data, error } = await db
            .from("productos")
            .select("id, nombre, slug, categoria")
            .eq("activo", true)
            .order("orden");

        if (error) {
            console.error("Error cargando productos para nav:", error);
            renderMenu([], "checkout");
            return;
        }

        productos = data || [];
        renderMenu(productos, "checkout");
    }

    function syncLocalStorageCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(state.items));
            window.dispatchEvent(new CustomEvent("pp-cart-updated"));
        } catch (err) {
            console.error("No se pudo sincronizar localStorage:", err);
        }
    }

    async function guardarCarritoEnDB() {
        if (!state.carrito?.id) return false;
        if (state.guardandoCarrito) return false;

        state.guardandoCarrito = true;

        const subtotal = calcularSubtotal();
        const total = subtotal + Number(state.costoEnvio || 0);

        const { error } = await db
            .from("carritos")
            .update({
                items: state.items,
                subtotal,
                total
            })
            .eq("id", state.carrito.id);

        state.guardandoCarrito = false;

        if (error) {
            console.error("Error actualizando carrito:", error);
            if (els.error) {
                els.error.textContent = "No se pudo actualizar el carrito. Probá nuevamente.";
            }
            return false;
        }

        state.carrito.items = state.items;
        state.carrito.subtotal = subtotal;
        state.carrito.total = total;

        syncLocalStorageCart();
        return true;
    }

    function renderItems() {
        if (!els.checkoutItems) return;

        if (!state.items.length) {
            els.checkoutItems.innerHTML = `
                <p style="padding:16px 0;font-weight:800;color:#666;">
                    Tu pedido está vacío.
                </p>
            `;
            return;
        }

        els.checkoutItems.innerHTML = `
            <ul class="checkout-ul">
                ${state.items.map((it, index) => {
            const subtotal = Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
            const descripcion = buildItemDescription(it);

            return `
                        <li class="checkout-item" data-index="${index}">
                            <div class="checkout-item-info">
                                <img
                                    src="${escapeHtml(it.imagen || "https://via.placeholder.com/80")}"
                                    class="checkout-item-img"
                                    alt="${escapeHtml(it.nombre || "Producto")}"
                                />
                                <div class="checkout-item-details">
                                    <div class="checkout-item-title">${escapeHtml(it.nombre || "Producto")}</div>
                                    ${descripcion ? `<div class="checkout-item-desc">${escapeHtml(descripcion)}</div>` : ""}
                                    <div class="checkout-item-desc">Unitario: ${money(it.precio_unitario || 0)}</div>

                                    <div class="checkout-item-actions">
                                        <div class="checkout-qty">
                                            <button type="button" class="checkout-qty-btn" data-action="minus" data-index="${index}" aria-label="Restar cantidad">−</button>
                                            <span class="checkout-qty-value">${Number(it.cantidad || 0)}</span>
                                            <button type="button" class="checkout-qty-btn" data-action="plus" data-index="${index}" aria-label="Sumar cantidad">+</button>
                                        </div>

                                        <button type="button" class="checkout-remove-btn" data-action="remove" data-index="${index}">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <span class="checkout-item-subtotal">${money(subtotal)}</span>
                        </li>
                    `;
        }).join("")}
            </ul>
        `;

        bindCartItemActions();
    }

    function renderTotals() {
        state.subtotal = calcularSubtotal();
        state.total = state.subtotal + state.costoEnvio;

        if (!els.checkoutTotals) return;

        els.checkoutTotals.innerHTML = `
            <div>
                <span>Subtotal:</span>
                <span class="precio-subtotal">${money(state.subtotal)}</span>
            </div>
            ${state.metodoEntrega === "envio" ? `
                <div>
                    <span>Envío:</span>
                    <span class="precio-envio">${money(state.costoEnvio)}</span>
                </div>
            ` : ""}
            <div>
                <span>Total:</span>
                <span class="precio-total">${money(state.total)}</span>
            </div>
        `;
    }

    function renderShippingInfo() {
        if (!els.shippingInfo || !els.shippingDistance || !els.shippingDuration) return;

        if (state.metodoEntrega !== "envio" || !state.distanciaKm) {
            els.shippingInfo.style.display = "none";
            els.shippingDistance.textContent = "-";
            els.shippingDuration.textContent = "-";
            return;
        }

        els.shippingInfo.style.display = "grid";
        els.shippingDistance.textContent = `${state.distanciaKm.toFixed(1)} km`;

        if (state.duracionMin > 0) {
            if (state.duracionMin < 60) {
                els.shippingDuration.textContent = `${Math.round(state.duracionMin)} min`;
            } else {
                const horas = Math.floor(state.duracionMin / 60);
                const minutos = Math.round(state.duracionMin % 60);
                els.shippingDuration.textContent = minutos > 0
                    ? `${horas} h ${minutos} min`
                    : `${horas} h`;
            }
        } else {
            els.shippingDuration.textContent = "-";
        }
    }

    function setMetodoEntrega(metodo) {
        state.metodoEntrega = metodo;

        els.opcionesEnvio.forEach((op) => {
            op.classList.toggle("activa", op.dataset.metodo === metodo);
        });

        if (metodo === "envio") {
            if (els.direccionContainer) {
                els.direccionContainer.style.display = "block";
            }

            if (els.envioCostoTexto) {
                const direccionIngresada = els.direccionInput?.value.trim() || "";
                els.envioCostoTexto.textContent = direccionIngresada
                    ? "Calculando..."
                    : state.envioCostoTextoInicial;
            }
        } else {
            if (els.direccionContainer) {
                els.direccionContainer.style.display = "none";
            }

            if (els.error) {
                els.error.textContent = "";
            }

            if (els.envioCostoTexto) {
                els.envioCostoTexto.textContent = state.envioCostoTextoInicial;
            }

            resetShipping();
        }

        renderTotals();
    }

    async function cargarCarrito() {
        const qs = new URLSearchParams(location.search);
        const cartId = qs.get("cart");

        if (!cartId) {
            alert("Carrito inválido");
            location.href = "/";
            return false;
        }

        const { data: carrito, error } = await db
            .from("carritos")
            .select("*")
            .eq("id", cartId)
            .single();

        if (error || !carrito) {
            console.error(error);
            alert("No se pudo cargar el carrito");
            return false;
        }

        state.carrito = carrito;
        state.items = Array.isArray(carrito.items) ? carrito.items : [];
        return true;
    }

    async function completarUsuario() {
        try {
            const { data } = await auth.auth.getSession();
            const user = data.session?.user || null;

            if (!user) return;

            if (els.nombre) {
                els.nombre.value = user?.user_metadata?.nombre || "";
            }

            if (els.email) {
                els.email.value = user?.email || "";
            }

            if (els.telefono) {
                els.telefono.value = user?.user_metadata?.telefono || "";
            }
        } catch (err) {
            console.error("No se pudo completar usuario:", err);
        }
    }

    async function cotizarEnvio() {
        if (state.metodoEntrega !== "envio") return;
        if (state.cotizando) return;

        const direccionIngresada = els.direccionInput?.value.trim() || "";

        if (!direccionIngresada) {
            if (els.envioCostoTexto) {
                els.envioCostoTexto.textContent = state.envioCostoTextoInicial;
            }
            resetShipping();
            return;
        }

        state.cotizando = true;

        if (els.envioCostoTexto) {
            els.envioCostoTexto.textContent = "Calculando...";
        }

        if (els.error) {
            els.error.textContent = "";
        }

        try {
            const res = await fetch("/api/cotizar-envio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    direccion: direccionIngresada,
                    origen: {
                        lat: ORIGEN.lat,
                        lon: ORIGEN.lon,
                        direccion: ORIGEN.direccion
                    }
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "No se pudo calcular el envío");
            }

            state.distanciaKm = Number(data.distanceKm || 0);
            state.duracionMin = Number(data.durationMinutes || 0);
            state.costoEnvio = calcularCostoEnvioPorDistancia(state.distanciaKm);

            if (els.envioCostoTexto) {
                els.envioCostoTexto.textContent = money(state.costoEnvio);
            }

            renderTotals();
            renderShippingInfo();
            await guardarCarritoEnDB();
        } catch (err) {
            console.error(err);

            state.costoEnvio = 0;
            state.distanciaKm = 0;
            state.duracionMin = 0;

            if (els.envioCostoTexto) {
                els.envioCostoTexto.textContent = "No se pudo calcular";
            }

            if (els.error) {
                els.error.textContent = err.message || "No pudimos calcular el envío con esa dirección. Probá escribiéndola más completa.";
            }

            renderTotals();
            renderShippingInfo();
        } finally {
            state.cotizando = false;
        }
    }

    function validarFormulario() {
        const nombre = els.nombre?.value.trim() || "";
        const email = els.email?.value.trim() || "";
        const telefono = els.telefono?.value.trim() || "";

        if (!state.items.length) return "Tu carrito está vacío.";
        if (!nombre) return "Completá tu nombre y apellido.";
        if (!email) return "Completá tu correo electrónico.";
        if (!telefono) return "Completá tu teléfono.";

        if (state.metodoEntrega === "envio") {
            const direccion = els.direccionInput?.value.trim() || "";
            if (!direccion) return "Completá la dirección de entrega.";
            if (!state.costoEnvio) return "Primero calculá el costo de envío.";
        }

        return null;
    }

    async function pagar() {
        const errorMsg = validarFormulario();

        if (errorMsg) {
            if (els.error) {
                els.error.textContent = errorMsg;
            }
            return;
        }

        if (els.error) {
            els.error.textContent = "";
        }

        alert("Listo: el checkout ya permite editar productos y cantidades.");
    }

    async function cambiarCantidad(index, delta) {
        const item = state.items[index];
        if (!item) return;

        const nuevaCantidad = Number(item.cantidad || 0) + delta;

        if (nuevaCantidad <= 0) {
            await eliminarItem(index);
            return;
        }

        state.items[index] = {
            ...item,
            cantidad: nuevaCantidad
        };

        renderItems();
        renderTotals();

        if (state.metodoEntrega === "envio" && els.direccionInput?.value.trim()) {
            await cotizarEnvio();
        }

        await guardarCarritoEnDB();
    }

    async function eliminarItem(index) {
        if (index < 0 || index >= state.items.length) return;

        state.items.splice(index, 1);

        if (!state.items.length) {
            resetShipping();
        }

        renderItems();
        renderTotals();

        if (state.metodoEntrega === "envio" && state.items.length && els.direccionInput?.value.trim()) {
            await cotizarEnvio();
        }

        await guardarCarritoEnDB();
    }

    function bindCartItemActions() {
        els.checkoutItems?.querySelectorAll("[data-action]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const action = btn.dataset.action;
                const index = Number(btn.dataset.index);

                if (Number.isNaN(index)) return;

                if (els.error) {
                    els.error.textContent = "";
                }

                if (action === "plus") {
                    await cambiarCantidad(index, 1);
                } else if (action === "minus") {
                    await cambiarCantidad(index, -1);
                } else if (action === "remove") {
                    await eliminarItem(index);
                }
            });
        });
    }

    function bindEvents() {
        els.mobileMenuBtn?.addEventListener("click", openMobileMenu);
        els.closeMobileMenuBtn?.addEventListener("click", closeMobileMenu);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeMobileMenu();
                hideDesktopDropdown();
            }
        });

        els.opcionesEnvio.forEach((op) => {
            op.addEventListener("click", () => {
                setMetodoEntrega(op.dataset.metodo);
            });
        });

        let typingTimer;

        els.direccionInput?.addEventListener("input", () => {
            if (els.error) {
                els.error.textContent = "";
            }

            clearTimeout(typingTimer);

            if (state.metodoEntrega !== "envio") return;

            typingTimer = setTimeout(() => {
                cotizarEnvio();
            }, 900);
        });

        els.direccionInput?.addEventListener("blur", () => {
            if (state.metodoEntrega === "envio") {
                cotizarEnvio();
            }
        });

        els.btnPagar?.addEventListener("click", pagar);

        els.mobileSearchInput?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const q = els.mobileSearchInput.value.trim();
                location.href = q ? `/?q=${encodeURIComponent(q)}` : "/";
            }
        });
    }

    const carritoOk = await cargarCarrito();
    if (!carritoOk) return;

    await completarUsuario();
    await cargarProductosParaNav();

    renderItems();
    setMetodoEntrega("retiro");
    renderTotals();
    renderShippingInfo();
    bindEvents();
});
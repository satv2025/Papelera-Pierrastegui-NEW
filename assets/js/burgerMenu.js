document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       DATA DEL MENÚ (ÚNICA FUENTE)
    =============================== */
    const categorias = [
        {
            titulo: "Artículos de Embalaje",
            links: [
                ["Bandejas de cartón", "/productos/bandejas-y-potes"],
                ["Bandejas aluminio", "/productos/bandejas-y-potes/aluminio"],
                ["Bandejas telgopor", "/productos/bandejas-y-potes/telgopor"],
                ["Bandejas plásticas", "/productos/bandejas-y-potes/plastico"],
                ["Potes", "/productos/bandejas-y-potes/bisagra"]
            ]
        },
        {
            titulo: "Bolsas",
            links: [
                ["Arranques", "/productos/arranques"],
                ["Bolsas camiseta", "/productos/bolsas/camiseta"],
                ["Bolsas residuo", "/productos/bolsas/residuo"],
                ["Bolsas horno", "/productos/bolsas/horno"],
                ["Bolsas ziploc", "/productos/bolsas/ziploc"]
            ]
        },
        {
            titulo: "Cajas de Cartón",
            links: [
                ["Pizza", "/productos/cajas-de-carton/pizza"],
                ["Empanadas", "/productos/cajas-de-carton/empanada"],
                ["Hamburguesas", "/productos/cajas-de-carton/hamburguesa"],
                ["Sandwich", "/productos/cajas-de-carton/sandwich"]
            ]
        },
        {
            titulo: "Cubiertos",
            links: [
                ["Cucharas", "/productos/cubiertos/cucharas"],
                ["Tenedores", "/productos/cubiertos/tenedor"],
                ["Cuchillos", "/productos/cubiertos/cuchillos"]
            ]
        },
        {
            titulo: "Librería",
            links: [
                ["Biromes", "/productos/libreria/biromes"],
                ["Cuadernos", "/productos/libreria/cuadernos"],
                ["Resaltadores", "/productos/libreria/resaltadores"]
            ]
        },
        {
            titulo: "Papel",
            links: [
                ["Papel higiénico", "/productos/papel/higienico"],
                ["Rollo cocina", "/productos/papel/cocina"],
                ["Servilletas", "/productos/papel/servilletas"]
            ]
        }
    ];

    /* ==============================
       BARRA INFERIOR
    =============================== */
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mb-menu">☰</div>
  `;
    document.body.appendChild(bar);

    /* ==============================
       MENÚ
    =============================== */
    const menu = document.createElement("div");
    menu.className = "mobile-menu";

    let menuHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMenu">✕</button>
    </div>
    <div class="mobile-menu-body">
  `;

    categorias.forEach(cat => {
        menuHTML += `
      <div class="mobile-submenu">
        <div class="mobile-submenu-title">${cat.titulo}</div>
        <div class="mobile-submenu-content">
          ${cat.links.map(l => `<a href="${l[1]}">${l[0]}</a>`).join("")}
        </div>
      </div>
    `;
    });

    menuHTML += `</div>`;
    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);

    /* ==============================
       ESTILOS
    =============================== */
    const style = document.createElement("style");
    style.textContent = `
    .mobile-bottom-bar {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #ff7600;
      display: flex;
      justify-content: center;
      padding: 10px;
      z-index: 9999;
    }

    .mobile-menu {
      position: fixed;
      inset: 0;
      background: #fff;
      transform: translateY(100%);
      transition: .3s ease;
      z-index: 10000;
      overflow-y: auto;
    }

    .mobile-menu.active {
      transform: translateY(0);
    }

    .mobile-menu-header {
      padding: 16px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
    }

    .mobile-submenu-title {
      padding: 16px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      background: #f7f7f7;
    }

    .mobile-submenu-content {
      display: none;
      padding-left: 10px;
    }

    .mobile-submenu-content a {
      display: block;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      border-bottom: 1px solid #eee;
    }

    .mobile-submenu.active .mobile-submenu-content {
      display: block;
    }
  `;
    document.head.appendChild(style);

    /* ==============================
       EVENTOS
    =============================== */
    document.getElementById("mb-menu").onclick = () =>
        menu.classList.add("active");

    document.getElementById("closeMenu").onclick = () =>
        menu.classList.remove("active");

    document.querySelectorAll(".mobile-submenu-title").forEach(title => {
        title.addEventListener("click", () => {
            title.parentElement.classList.toggle("active");
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       DATA DEL MENÚ (ÚNICA FUENTE)
    =============================== */
    const categorias = [
        {
            titulo: "Artículos de Embalaje",
            links: [
                ["Bandejas de cartón", "/productos/bandejas-y-potes"],
                ["Bandejas aluminio", "/productos/bandejas-y-potes/aluminio"],
                ["Bandejas telgopor", "/productos/bandejas-y-potes/telgopor"],
                ["Bandejas plásticas", "/productos/bandejas-y-potes/plastico"],
                ["Potes", "/productos/bandejas-y-potes/bisagra"]
            ]
        },
        {
            titulo: "Bolsas",
            links: [
                ["Arranques", "/productos/arranques"],
                ["Bolsas camiseta", "/productos/bolsas/camiseta"],
                ["Bolsas residuo", "/productos/bolsas/residuo"],
                ["Bolsas horno", "/productos/bolsas/horno"],
                ["Bolsas ziploc", "/productos/bolsas/ziploc"]
            ]
        },
        {
            titulo: "Cajas de Cartón",
            links: [
                ["Pizza", "/productos/cajas-de-carton/pizza"],
                ["Empanadas", "/productos/cajas-de-carton/empanada"],
                ["Hamburguesas", "/productos/cajas-de-carton/hamburguesa"],
                ["Sandwich", "/productos/cajas-de-carton/sandwich"]
            ]
        },
        {
            titulo: "Cubiertos",
            links: [
                ["Cucharas", "/productos/cubiertos/cucharas"],
                ["Tenedores", "/productos/cubiertos/tenedor"],
                ["Cuchillos", "/productos/cubiertos/cuchillos"]
            ]
        },
        {
            titulo: "Librería",
            links: [
                ["Biromes", "/productos/libreria/biromes"],
                ["Cuadernos", "/productos/libreria/cuadernos"],
                ["Resaltadores", "/productos/libreria/resaltadores"]
            ]
        },
        {
            titulo: "Papel",
            links: [
                ["Papel higiénico", "/productos/papel/higienico"],
                ["Rollo cocina", "/productos/papel/cocina"],
                ["Servilletas", "/productos/papel/servilletas"]
            ]
        }
    ];

    /* ==============================
       BARRA INFERIOR
    =============================== */
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mb-menu">☰</div>
  `;
    document.body.appendChild(bar);

    /* ==============================
       MENÚ
    =============================== */
    const menu = document.createElement("div");
    menu.className = "mobile-menu";

    let menuHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMenu">✕</button>
    </div>
    <div class="mobile-menu-body">
  `;

    categorias.forEach(cat => {
        menuHTML += `
      <div class="mobile-submenu">
        <div class="mobile-submenu-title">${cat.titulo}</div>
        <div class="mobile-submenu-content">
          ${cat.links.map(l => `<a href="${l[1]}">${l[0]}</a>`).join("")}
        </div>
      </div>
    `;
    });

    menuHTML += `</div>`;
    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);

    /* ==============================
       ESTILOS
    =============================== */
    const style = document.createElement("style");
    style.textContent = `
    .mobile-bottom-bar {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #ff7600;
      display: flex;
      justify-content: center;
      padding: 10px;
      z-index: 9999;
    }

    .mobile-menu {
      position: fixed;
      inset: 0;
      background: #fff;
      transform: translateY(100%);
      transition: .3s ease;
      z-index: 10000;
      overflow-y: auto;
    }

    .mobile-menu.active {
      transform: translateY(0);
    }

    .mobile-menu-header {
      padding: 16px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
    }

    .mobile-submenu-title {
      padding: 16px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      background: #f7f7f7;
    }

    .mobile-submenu-content {
      display: none;
      padding-left: 10px;
    }

    .mobile-submenu-content a {
      display: block;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      border-bottom: 1px solid #eee;
    }

    .mobile-submenu.active .mobile-submenu-content {
      display: block;
    }
  `;
    document.head.appendChild(style);

    /* ==============================
       EVENTOS
    =============================== */
    document.getElementById("mb-menu").onclick = () =>
        menu.classList.add("active");

    document.getElementById("closeMenu").onclick = () =>
        menu.classList.remove("active");

    document.querySelectorAll(".mobile-submenu-title").forEach(title => {
        title.addEventListener("click", () => {
            title.parentElement.classList.toggle("active");
        });
    });
});
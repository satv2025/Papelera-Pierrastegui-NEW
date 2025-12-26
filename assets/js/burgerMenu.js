document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       BARRA INFERIOR
    =============================== */
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `<div class="mobile-item" id="mb-menu">☰</div>`;
    document.body.appendChild(bar);

    /* ==============================
       MENÚ
    =============================== */
    const menu = document.createElement("div");
    menu.className = "mobile-menu";

    menu.innerHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMenu">✕</button>
    </div>

    <div class="mobile-menu-body">
      ${document.querySelector(".dropdown-menu")?.innerHTML || ""}
    </div>
  `;
    document.body.appendChild(menu);

    /* ==============================
       CONVERTIR SUBMENÚS EXISTENTES
    =============================== */
    document.querySelectorAll(".mobile-menu .dropdown-submenu").forEach(sub => {
        const trigger = sub.querySelector("a");
        const content = sub.querySelector(".submenu");

        if (!trigger || !content) return;

        sub.classList.add("mobile-submenu");
        content.classList.add("mobile-submenu-content");

        content.style.display = "none";

        trigger.addEventListener("click", e => {
            e.preventDefault();

            document.querySelectorAll(".mobile-submenu").forEach(s => {
                if (s !== sub) {
                    s.classList.remove("active");
                    const c = s.querySelector(".mobile-submenu-content");
                    if (c) c.style.display = "none";
                }
            });

            const open = sub.classList.toggle("active");
            content.style.display = open ? "block" : "none";
        });
    });

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
      padding: 10px;
      text-align: center;
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
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
    }

    .mobile-submenu > a {
      display: block;
      padding: 16px;
      font-weight: 600;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }

    .mobile-submenu-content {
      display: none;
      background: #fafafa;
    }

    .mobile-submenu-content a {
      display: block;
      padding: 12px 18px;
      border-bottom: 1px solid #eee;
      text-decoration: none;
      color: #333;
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

});
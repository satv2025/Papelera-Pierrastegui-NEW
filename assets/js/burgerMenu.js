// burgerMenu.js
document.addEventListener("DOMContentLoaded", () => {
    // Evitar duplicados si se importa 2 veces
    if (document.querySelector(".mobile-bottom-bar") || document.querySelector(".mobile-menu")) return;

    /* ===========================
       CSS (INJECTADO)
    ============================ */
    const style = document.createElement("style");
    style.innerHTML = `
    .mobile-bottom-bar{
      position:fixed;
      bottom:0; left:0;
      width:100%;
      background:#ff7600;
      display:flex;
      justify-content:space-around;
      align-items:center;
      padding:10px 0;
      z-index:9999;
    }

    .mobile-item{
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      min-width:44px;
      min-height:44px;
      cursor:pointer;
      user-select:none;
      -webkit-tap-highlight-color: transparent;
    }

    .mobile-item img{
      width:26px;
      height:26px;
      /* Blanco sobre fondo naranja */
      filter: brightness(0) saturate(100%) invert(100%);
    }

    #mobile-menu-btn{
      color:#fff;
      font-size:24px;
      line-height:1;
      font-weight:700;
    }

    .mobile-menu{
      position:fixed;
      inset:0;
      background:#ffffff;
      transform:translateY(100%);
      transition:transform .35s ease;
      z-index:10000;
      display:flex;
      flex-direction:column;
    }

    .mobile-menu.active{ transform:translateY(0); }

    .mobile-menu-header{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:16px;
      font-size:20px;
      font-weight:700;
      border-bottom:1px solid #eee;
    }

    .mobile-menu-header button{
      background:none;
      border:none;
      font-size:26px;
      cursor:pointer;
      color:#000;
      padding:6px 10px;
      border-radius:10px;
    }
    .mobile-menu-header button:hover{
      background:#ff7600;
      color:#fff;
    }

    .mobile-search{
      padding:15px;
      border-bottom:1px solid #eee;
    }

    .mobile-search input{
      width:100%;
      padding:12px;
      border-radius:8px;
      border:1px solid #ccc;
      font-size:16px;
      outline:none;
    }

    #mobileMenuContent{
      padding:10px 16px 120px;
      overflow-y:auto;
      -webkit-overflow-scrolling:touch;
    }

    /* Ajustes para tu menú clonado */
    #mobileMenuContent a{
      color:#000;
      text-decoration:none;
    }
    #mobileMenuContent a:hover{
      color:#ff7600;
      background:rgba(255,118,0,.08);
    }

    @media (min-width: 769px){
      .mobile-bottom-bar,
      .mobile-menu{ display:none !important; }
    }
  `;
    document.head.appendChild(style);

    /* ===========================
       UI (GENERADA POR JS)
    ============================ */
    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mobile-cart" aria-label="Carrito" role="button" tabindex="0">
      <img alt="Carrito" src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/carrito.svg">
    </div>

    <a class="mobile-item" aria-label="Instagram" href="https://www.instagram.com/pierrastegui.papelera"
       rel="noopener noreferrer" target="_blank">
      <img alt="Instagram" src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/instagram.svg">
    </a>

    <a class="mobile-item" aria-label="WhatsApp" href="https://wa.me/541123054613"
       rel="noopener noreferrer" target="_blank">
      <img alt="WhatsApp" src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/social/whatsapp.svg">
    </a>

    <div class="mobile-item" id="mobile-account" aria-label="Mi Cuenta" role="button" tabindex="0">
      <img alt="Mi Cuenta" src="https://mediastatic.papelerapierrastegui.com.ar/assets/images/svg/web/account.svg">
    </div>

    <div class="mobile-item" id="mobile-menu-btn" aria-label="Abrir menú" role="button" tabindex="0">☰</div>
  `;
    document.body.appendChild(bar);

    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.innerHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMobileMenu" aria-label="Cerrar menú">✕</button>
    </div>

    <div class="mobile-search">
      <!-- MISMO ID QUE TU SCRIPT DE FILTRO -->
      <input id="search-input" placeholder="Buscar productos..." />
    </div>

    <div id="mobileMenuContent"></div>
  `;
    document.body.appendChild(menu);

    /* ===========================
       EVENTOS
    ============================ */
    const openBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("closeMobileMenu");

    openBtn.onclick = () => menu.classList.add("active");
    closeBtn.onclick = () => menu.classList.remove("active");

    // Cerrar tocando fuera del contenido (opcional, cómodo)
    menu.addEventListener("click", (e) => {
        if (e.target === menu) menu.classList.remove("active");
    });

    // Clonar menú desktop real
    const desktopMenu = document.querySelector(".nav-items");
    const mobileMenuContent = document.getElementById("mobileMenuContent");
    if (desktopMenu && mobileMenuContent) {
        mobileMenuContent.innerHTML = desktopMenu.innerHTML;
    } else if (mobileMenuContent) {
        mobileMenuContent.innerHTML = `<p style="padding:10px 0;">Menú no disponible</p>`;
    }

    // Carrito: abre tu dropcart (si existe)
    document.getElementById("mobile-cart")?.addEventListener("click", () => {
        document.getElementById("cart-toggle")?.click();
    });

    // Cuenta: no manejo supabase acá (porque pediste SOLO menú)
    // Si querés, lo engancho a tu lógica actual:
    document.getElementById("mobile-account")?.addEventListener("click", () => {
        // Si ya existe el sistema de mi-cuenta, esto dispara lo que tengas configurado
        const btn = document.querySelector(".mi-cuenta .btn-login") || document.querySelector(".mi-cuenta img");
        if (btn) btn.click();
        else window.location.href = "/login";
    });
});
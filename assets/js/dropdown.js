document.addEventListener("DOMContentLoaded", function () {
  // Código dropdown
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const sizeOptions = document.querySelectorAll(".dropdown-menu li");
  const uniSpan = document.getElementById('uni');

  dropdownBtn.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });

  sizeOptions.forEach(option => {
    option.addEventListener("click", function () {
      dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
      dropdownMenu.classList.remove("show");
      uniSpan.style.display = 'inline';
    });
  });

  document.addEventListener("click", function (event) {
    if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Código para cambiar href en footer
  const urlMap = {
    "https://www.facebook.com": "https://nueva-url-para-facebook.com",
    "https://instagram.com": "https://nueva-url-para-instagram.com",
    "https://twitter.com": "https://nueva-url-para-twitter.com",
    "https://wa.me": "https://nueva-url-para-whatsapp.com"
  };

  document.querySelectorAll("footer a").forEach(link => {
    for (const originalUrl in urlMap) {
      if (link.href.startsWith(originalUrl)) {
        link.href = urlMap[originalUrl];
        break;
      }
    }
  });
});

// Uso de PerfectScrollbar

document.addEventListener('DOMContentLoaded', function () {
  // Función para cargar CSS externo
  function loadCSS(href) {
    return new Promise(function (resolve, reject) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(`Error cargando CSS: ${href}`);
      document.head.appendChild(link);
    });
  }

  // Función para cargar JS externo
  function loadJS(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(`Error cargando JS: ${src}`);
      document.body.appendChild(script);
    });
  }

  // URLs CDN PerfectScrollbar
  const psCSS = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/css/perfect-scrollbar.css';
  const psJS = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/dist/perfect-scrollbar.min.js';

  // Estilos personalizados para scrollbar siempre visible y color verde
  const customStyle = `
    .dropdown-menu {
      overflow-x: hidden !important;
      overflow-y: hidden !important;
    }

    /* Ocultar scrollbar horizontal */
    .ps__rail-x {
      display: none !important;
    }

    /* Barra vertical */
    .ps__rail-y {
      background-color: transparent !important;
      width: 8px !important;
      opacity: 1 !important;
      transition: none !important;
      pointer-events: auto !important;
      right: 2px !important;
    }

    .ps__rail-y:hover {
      width: 8px !important;
      opacity: 1 !important;
    }

    /* Pulgar de la barra vertical */
    .ps__thumb-y {
      background-color: #02a22a !important;
      border-radius: 4px;
    }
  `;

  // Insertar estilos en <head>
  const styleTag = document.createElement('style');
  styleTag.textContent = customStyle;
  document.head.appendChild(styleTag);

  // Cargar CSS y JS de PerfectScrollbar y luego inicializar
  loadCSS(psCSS)
    .then(() => loadJS(psJS))
    .then(() => {
      const dropdownMenus = document.querySelectorAll('.dropdown .dropdown-menu');
      dropdownMenus.forEach(menu => {
        new PerfectScrollbar(menu, {
          wheelPropagation: false,
          suppressScrollX: true
        });
      });
    })
    .catch(console.error);
});
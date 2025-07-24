document.addEventListener("DOMContentLoaded", function () {
  const sizeOptions = document.querySelectorAll(".dropdown-menu li");
  const uniSpan = document.getElementById('uni');

  sizeOptions.forEach(option => {
    option.addEventListener("click", function () {
      const dropdownBtn = document.querySelector(".dropdown-btn");
      dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
      dropdownBtn.classList.remove("open"); // Quita rotación flecha
      const dropdownMenu = dropdownBtn.closest('.dropdown').querySelector('.dropdown-menu');
      dropdownMenu.classList.remove("show");
      uniSpan.style.display = 'inline';
    });
  });

  document.addEventListener("click", function (event) {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = dropdownBtn.closest('.dropdown').querySelector('.dropdown-menu');
    if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("show");
      dropdownBtn.classList.remove("open"); // Cierra flecha
    }
  });

  // Perfect Scrollbar
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

  function loadJS(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(`Error cargando JS: ${src}`);
      document.body.appendChild(script);
    });
  }

  const psCSS = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/css/perfect-scrollbar.css';
  const psJS = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/dist/perfect-scrollbar.min.js';

  const customStyle = `
    .dropdown-menu {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
    .ps__rail-x {
      display: none !important;
    }
    .ps__rail-y {
      background-color: transparent !important;
      width: 8px !important;
      opacity: 1 !important;
      visibility: visible !important;
      transition: none !important;
      pointer-events: auto !important;
      right: 2px !important;
    }
    .ps__rail-y.ps--active,
    .ps__rail-y:hover {
      opacity: 1 !important;
      visibility: visible !important;
      transition: none !important;
    }
    .ps__thumb-y {
      background-color: #02a22a !important;
      border-radius: 4px;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.textContent = customStyle;
  document.head.appendChild(styleTag);

  loadCSS(psCSS)
    .then(() => loadJS(psJS))
    .then(() => {
      const dropdownMenus = document.querySelectorAll('.dropdown .dropdown-menu');
      const psInstances = new Map();

      dropdownMenus.forEach(menu => {
        const psInstance = new PerfectScrollbar(menu, {
          wheelPropagation: false,
          suppressScrollX: true
        });
        psInstances.set(menu, psInstance);
      });

      document.querySelectorAll('.dropdown-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dropdown = btn.closest('.dropdown');
          if (!dropdown) return;

          const menu = dropdown.querySelector('.dropdown-menu');
          if (!menu) return;

          const isShown = menu.classList.toggle('show');
          btn.classList.toggle('open', isShown); // Flecha

          if (isShown) {
            const ps = psInstances.get(menu);
            if (ps) {
              ps.update();
            }
          }
        });
      });
    })
    .catch(console.error);
});
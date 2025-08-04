document.addEventListener("DOMContentLoaded", function () {
  const socialLinks = {
    Facebook: "https://facebook.com/papelerapierrastegui",
    Instagram: "https://instagram.com/pierrastegui.papelera",
    Twitter: "https://twitter.com/pierrastegui",
    WhatsApp: "http://wa.me/541123054613" // reemplazá por tu número real
  };

  const footer = document.querySelector("footer");

  if (footer) {
    const links = footer.querySelectorAll("a[aria-label]");

    links.forEach(link => {
      const label = link.getAttribute("aria-label");
      if (socialLinks[label]) {
        link.setAttribute("href", socialLinks[label]);
      }
      // Ocultar Facebook y Twitter
      if (label === "Facebook" || label === "Twitter") {
        link.style.display = "none";
      }
    });
  }

  // Corregir rutas de imágenes sociales
  const images = document.querySelectorAll('img[src^="../../../assets/images/svg/social/"]');

  images.forEach(img => {
    const fileName = img.src.split("/").pop(); // Obtener el nombre del archivo
    img.src = `https://papelerapierrastegui.com.ar/assets/images/svg/social/${fileName}`;
  });
});

// Scroll Perfect ScrollBar 
document.addEventListener('DOMContentLoaded', () => {
  const pageScrollDiv = document.createElement('div');
  pageScrollDiv.id = 'page-scroll';

  while (document.body.firstChild) {
    pageScrollDiv.appendChild(document.body.firstChild);
  }

  document.body.appendChild(pageScrollDiv);

  const style = document.createElement('style');
  style.textContent = `
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden !important; /* bloquea scroll nativo en body */
    }
    #page-scroll {
      height: 100vh;
      overflow: auto !important; /* mantiene scroll funcional */
      position: relative;

      /* Oculta barras nativas sin romper scroll */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }
    #page-scroll::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent; /* Chrome, Safari y Opera */
    }

    /* Perfect Scrollbar custom styles */
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
      z-index: 1000 !important;
    }
    .ps__rail-y.ps--active,
    .ps__rail-y:hover {
      opacity: 1 !important;
      visibility: visible !important;
      transition: none !important;
    }
    .ps__thumb-y {
      background-color: #3b2d00 !important;
      border-radius: 4px;
      width: 8px !important;
    }
    .ps__rail-y:hover > .ps__thumb-y {
      width: 8px !important;
    }
  `;
  document.head.appendChild(style);

  // Carga Perfect Scrollbar JS
  const psScript = document.createElement('script');
  psScript.src = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/dist/perfect-scrollbar.min.js';
  psScript.onload = () => {
    const psInstance = new PerfectScrollbar('#page-scroll', {
      wheelPropagation: false,
      suppressScrollX: true,
    });

    // Actualiza scrollbar al hacer selección y mover mouse para autoscroll
    let isSelecting = false;

    document.addEventListener('selectionchange', () => {
      const selection = document.getSelection();
      isSelecting = selection && !selection.isCollapsed;
    });

    document.addEventListener('mousemove', () => {
      if (isSelecting) {
        psInstance.update();
      }
    });
  };
  document.body.appendChild(psScript);

  // Carga Perfect Scrollbar CSS
  const psCSS = document.createElement('link');
  psCSS.rel = 'stylesheet';
  psCSS.href = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/css/perfect-scrollbar.css';
  document.head.appendChild(psCSS);
});
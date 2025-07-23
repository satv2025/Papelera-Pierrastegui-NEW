document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar Perfect Scrollbar JS (CDN)
    const psScript = document.createElement('script');
    psScript.src = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/dist/perfect-scrollbar.min.js';

    // 2. Al cargar Perfect Scrollbar
    psScript.onload = () => {
        const menu = document.querySelector('.dropdown-categorias'); // <-- Cambié acá
        if (menu) {
            // Asegurar scroll visible (en este caso, vertical u horizontal según necesidad)
            menu.style.overflowY = 'auto';
            menu.style.maxHeight = '300px'; // ejemplo para limitar alto y activar scroll
            menu.style.whiteSpace = 'normal'; // para que no se corte el texto y el scroll funcione bien

            // Inicializar Perfect Scrollbar
            new PerfectScrollbar(menu, {
                wheelPropagation: true,
            });
        }
    };

    // 3. Cargar el CSS de Perfect Scrollbar
    const psCSS = document.createElement('link');
    psCSS.rel = 'stylesheet';
    psCSS.href = 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/css/perfect-scrollbar.css';

    // 4. Agregar al documento
    document.body.appendChild(psScript);
    document.head.appendChild(psCSS);
});
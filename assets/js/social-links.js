document.addEventListener("DOMContentLoaded", function () {
    const socialLinks = {
        Facebook: "https://www.facebook.com/papelerapierrastegui",
        Instagram: "https://www.instagram.com/papelerapierrastegui",
        Twitter: "https://twitter.com/pierrastegui",
        WhatsApp: "https://wa.me/5491122334455" // reemplazá por tu número real
    };

    const footer = document.querySelector("footer");

    if (footer) {
        const links = footer.querySelectorAll("a[aria-label]");
        const imgs = footer.querySelectorAll("img");

        // Lista de rutas relativas (desde la raíz del proyecto)
        const exceptions = [
            "productos/cubiertos/cuchillos/blanco.html",
            "productos/cubiertos/cuchillos/negro.html",
            "productos/cubiertos/tenedor/blanco.html",
            "productos/cubiertos/tenedor/negro.html",
            "productos/papel/cocina/elegante.html",
            "productos/papel/cocina/newpel.html",
            "productos/papel/higienico/elegante.html",
            "productos/papel/higienico/newpel.html"
        ];

        // Detectar la ruta actual (desde la raíz)
        // Ejemplo: location.pathname puede ser "/productos/cubiertos/cuchillos/blanco.html"
        // Quitamos el '/' inicial para comparar
        let currentPath = location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname;

        // Función para verificar si es excepción
        const isException = exceptions.includes(currentPath);

        // Actualizar hrefs según label
        links.forEach(link => {
            const label = link.getAttribute("aria-label");
            if (socialLinks[label]) {
                link.setAttribute("href", socialLinks[label]);
            }
        });

        // Ajustar paths de imágenes según excepción
        imgs.forEach(img => {
            let src = img.getAttribute("src");
            if (!isException) {
                // Cambiar ../../../ por ../../ solo si está al principio del src
                if (src.startsWith("../../../")) {
                    src = src.replace("../../../", "../../");
                    img.setAttribute("src", src);
                }
            }
            // Si es excepción no cambiar nada (mantiene ../../../)
        });
    }
});
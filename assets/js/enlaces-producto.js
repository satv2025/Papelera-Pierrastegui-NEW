const rutasProductos = {
    "arranque grueso": "arranques/grueso",
    "arranque rendidor": "arranques/rendidor",
    "bandejas de aluminio": "bandejas/aluminio",
    "bandejas de carton": "bandejas/carton",
    "bandejas plasticas": "bandejas/plastico",
    "bandeja de telgopor": "bandejas/telgopor",
    "blonda": "bandejas/blonda",
    "bolsas camiseta": "bolsas/camiseta",
    "bolsas sulfito": "bolsas/sulfito",
    "bolsas horno": "bolsas/horno",
    "bolsas polipropileno": "bolsas/polipropileno",
    "bolsas residuo": "bolsas/residuo",
    "bolsas riñon": "bolsas/riñon",
    "caja de desayuno": "cajas/desayuno",
    "caja de sandwich": "cajas/sandwich",
    "caja de empanada": "cajas/empanada",
    "caja de pizza": "cajas/pizza",
    "caja de ravioles": "cajas/ravioles",
    "caja de hamburguesa": "cajas/hamburguesa",
    "cartón corrugado": "carton/corrugado",
    "tiras de carton satinado": "carton/tirascs",
    "cinta scotch": "cintas/scotch",
    "cinta papel": "cintas/papel",
    "cuchara sopera": "cubiertos/cucharasopera",
    "cucharita": "cubiertos/cucharita",
    "cuchillo blanco": "cubiertos/cuchillos/blanco",
    "cuchillo negro": "cubiertos/cuchillos/negro",
    "plato torta": "cubiertos/platotorta",
    "remos": "cubiertos/remos",
    "tenedor blanco": "cubiertos/tenedor/blanco",
    "tenedor negro": "cubiertos/tenedor/negro",
    "film": "film/film",
    "stretch": "stretch/stretch",
    "fólex": "folex/folex",
    "papel aluminio hamburguesa 30x40": "papel/aluminio",
    "guante nitrilo": "guantes/nitirlo",
    "guante polietileno": "guantes/polietileno",
    "abrochadoras": "libreria/abrochadoras",
    "biromes": "libreria/biromes",
    "cuadernos universitarios": "libreria/cuadernosuniv",
    "estallidos": "libreria/estallidos",
    "fibrones": "libreria/fibrones",
    "hilo": "libreria/hilo",
    "hojas a4": "libreria/hojas",
    "liquid paper": "libreria/liquidpaper",
    "máquina de mótex": "libreria/maquinamotex",
    "mótex": "libreria/motex",
    "talonarios - remitos": "libreria/remitos",
    "resaltador": "libreria/resaltador",
    "tacos de papel": "libreria/tacospapel",
    "voligoma": "libreria/voligoma",
    "papel aluminio": "papel/aluminio",
    "bobina de papel": "papel/bobina",
    "papel cortado": "papel/cortado",
    "papel manteca": "papel/manteca",
    "cono de papas": "pizzeria/conopapas",
    "fondo pizza chico": "pizzeria/fondopizzachico",
    "fondo pizza grande": "pizzeria/fondopizzagrande",
    "porta panchos": "pizzeria/portapanchos",
    "tripode": "pizzeria/tripode",
    "pote bisagra": "potes/bisagra",
    "pote dips": "potes/dips",
    "pote ensalada de fruta": "potes/ensaladafruta",
    "rollo termico": "rollostermicos/rollos",
    "sorbetes comun": "sorbetes/comun",
    "sorbetes negro": "sorbetes/negro",
    "sorbetes papel": "sorbetes/papel",
    "vasos de plastico": "vasos/plastico",
    "vasos de telgopor": "vasos/telgopor"
};

function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/[^a-z0-9 ]+/g, "") // eliminar caracteres especiales
        .trim();
}

document.querySelectorAll('.nombre').forEach(nombreEl => {
    const contenido = nombreEl.innerText || nombreEl.textContent;
    const contenidoSlug = slugify(contenido);
    const ruta = rutasProductos[contenidoSlug];

    if (ruta) {
        const parentDiv = nombreEl.closest('.producto');
        if (parentDiv) {
            const boton = parentDiv.querySelector('.producto-info button');
            if (boton) {
                const url = `https://papelerapierrastegui.com.ar/productos/${ruta}`;
                boton.onclick = () => {
                    window.location.href = url;
                };
            }
        }
    } else {
        console.warn(`No se encontró ruta para: "${contenido}" (normalizado: "${contenidoSlug}")`);
    }
});
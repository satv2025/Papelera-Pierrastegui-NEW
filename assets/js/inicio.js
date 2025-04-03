const productos = [
    // Arranques
    { nombre: 'Arranque grueso', descripcion: '', precioARS: '1523945', imagen: '//dcdn-us.mitiendanube.com/stores/005/415/561/products/20-52388681df134230d517386228465592-240-0.webp', magenHover: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARRANQUES/Arranques%20reforzados.jpg',ruta: 'productos\\arranques\\grueso.html', categoria: 'Arranques', boton: 'Ver Producto', tamanos: ["20x30", "25x35", "30x40", "35x45", "40x50", "45x60", "50x70", "60x90"]},
    { nombre: 'Arranque rendidor', descripcion: '', precioARS: '34875423', imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARRANQUES/Arranques%20reforzados.jpg', ruta: 'productos\\arranques\\rendidor.html', categoria: 'Arranques', boton: 'Ver Producto', tamanos: ["15x20", "15x25", "20x30", "25x35", "30x40", "35x45", "40x50"]},

    // Bandejas
    { nombre: 'Bandeja aluminio', descripcion: '', precioARS: '853937884', imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/ALUMINIO/bandeja%20de%20aluminio%20f100.jpg', ruta: 'productos\\bandejas\\aluminio.html', categoria: 'Bandejas', boton: 'Ver Producto', tamanos: ["f75", "f100"]},
    { nombre: 'Bandeja Carton', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20DE%20CART%C3%93N/bandeja%20de%20carton.webp', ruta: 'productos\\bandejas\\carton.html', categoria: 'Bandejas', boton: 'Ver Producto', tamanos: ["N°1", "N°2", "N°3", "N°4", "N°5", "N°6", "N°12", "N°12,5", "N°13", "N°13,5"]},
    { nombre: 'Bandeja plásticas', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BANDEJAS%20PLÁSTICAS/bandeja%20descartable%20n%20107.jpg', ruta: 'productos\\bandejas\\plasticas.html', categoria: 'Bandejas', boton: 'Ver Producto', tamanos: ["N°102", "N°103", "N°105 Ovalada", "N°107"]},
    { nombre: 'Bandeja Telgopor', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BANDEJAS%20EXPANDIDO/Bandeja%20expandido.jpg', ruta: 'productos\\bandejas\\Telgopor.html', categoria: 'Bandejas', boton: 'Ver Producto', tamanos: ["N°615", "N°617", "N°618", "N°619", "N°625", "N°628"]},

    // Blondas
    { nombre: 'Blonda', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\blondas\\blonda.html', categoria: 'Blondas', boton: 'Ver Producto', tamanos: ["N°28", "N°32"]},

    // Bolsas
    { nombre: 'Bolsa camiseta', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BOLSAS%20CAMISETA/bolsa%20camiseta%20foto.jpg', ruta: 'productos\\bolsas\\camiseta.html', categoria: 'Bolsas', boton: 'Ver Producto', tamanos: ["(R) 20x30", "(R) 30x40", "(R) 40x50", "(R) 45x60", "(R) 50x60", "(R) 50x70", "(R) 60x80", "(R) 45X60 Ciudad Negra ", "(E) 30x40", "(E) 40x50"]},
    { nombre: 'Bolsa factura', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BOLSAS%20DE%20SULFITO/bolsa%20sulfito%201.jpg', ruta: 'productos\\bolsas\\factura.html', categoria: 'Bolsas', boton: 'Ver Producto', tamanos: ["N°3", "N°4", "N°6", "N°7", "N°8", "Delivery 26x38x17"]},
    { nombre: 'Bolsa horno', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\bolsas\\horno.html', categoria: 'Bolsas', boton: 'Ver Producto' },
    { nombre: 'Bolsa polipropileno', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BOLSAS%20POLPROPILENO/SOBRES%20POLIPROPILENO.jpg', ruta: 'productos\\bolsas\\polipropileno.html', categoria: 'Bolsas', boton: 'Ver Producto', tamanos: ["10x15", "10x25", "15x20", "15x25", "20x25", "20x30", "25x35", "30x40", "35x45", "40x50"]},
    { nombre: 'Bolsa residuo', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BOLSAS%20DE%20RESIDUO/bolsas%20de%20residuo.jpg', ruta: 'productos\\bolsas\\residuo.html', categoria: 'Bolsas', boton: 'Ver Producto', tamanos: ["45x60", "50x70", "60x90", "80x1,10", "90x1,20"]},
    { nombre: 'Bolsa riñon', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/BOLSAS%20RIÑÓN/bolsas-rinon-todoplastic.jpg', ruta: 'productos\\bolsas\\riñon.html', categoria: 'Bolsas', boton: 'Ver Producto', tamanos: ["15x20", "20x30", "25x35", "30x40", "35x45", "40x50", "50x60", "Vino"]},
    { nombre: 'Bolsa Ziploc', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\bolsas\\ziploc.html', categoria: 'Bolsas', boton: 'Ver Producto' },

    // Cajas
    { nombre: 'Caja Desayuno', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\cajas\\desayuno.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Empanada para una docena', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/D_NQ_NP_786174-MLA73101670159_112023-O.webp', ruta: 'productos\\cajas\\empanadad.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Empanada para media docena', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/D_NQ_NP_786174-MLA73101670159_112023-O.webp', ruta: 'productos\\cajas\\empanadamd.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Pizza', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/caja%20de%20pizzas.jpg', ruta: 'productos\\cajas\\pizza.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Pizza Pequeña', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/caja%20de%20pizza%20chica.jpeg', ruta: 'productos\\cajas\\pizzapm.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Ravioles', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\cajas\\ravioles.html', categoria: 'Cajas', boton: 'Ver Producto' },
    { nombre: 'Caja De Hamburguesa', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/caja%20de%20hamburguesa.jpg', ruta: 'productos\\cajas\\hamburguesa.html', categoria: 'Cajas', boton: 'Ver Producto' },

    // Carton
    { nombre: 'Carton Corrugado', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CARTÓN%20CORRUGADO/carton%20corrugado.jpg', ruta: 'productos\\carton\\corrugado.html', categoria: 'Carton', boton: 'Ver Producto', tamanos: ["90x20", "100x20"]},
    { nombre: 'Tiras de Cartón Satinadas', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\carton\\tirascs.html', categoria: 'Carton', boton: 'Ver Producto' },

    // Cintas
    { nombre: 'Cinta scotch', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar//assets/images/Fotos%20productos%20papelera%20para%20catálogo/CINTAS%20ADHESIVAS/cintas%20de%20embalaje.jpg', ruta: 'productos\\cintas\\scotch.html', categoria: 'Cintas', boton: 'Ver Producto', tamanos: ["24x50", "48x100"]},
    { nombre: 'Cinta papel', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar//assets/images/Fotos%20productos%20papelera%20para%20catálogo/CINTAS%20ADHESIVAS/cinta%20de%20papel.jpg', ruta: 'productos\\cintas\\papel.html', categoria: 'Cintas', boton: 'Ver Producto', tamanos: ["18", "24", "36"]},

    // Cubiertos
    { nombre: 'Cuchara Sopera', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/cuchara%20sopera.jpg', ruta: 'productos\\cubiertos\\cucharasopera.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Cucharita', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_2X_601101-MLA46721113388_072021-F.webp', ruta: 'productos\\cubiertos\\cucharita.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Cuchillo', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/cuchillo%20descartable.webp', ruta: 'productos\\cubiertos\\cuchillo.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Cuchillo Negro', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/cuchillo negro descartable.png', ruta: 'productos\\cubiertos\\cuchillonegro.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Plato torta', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_2X_745062-MLA76109409291_042024-F.webp', ruta: 'productos\\cubiertos\\platostorta.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Remos', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_2X_677589-MLA51106764843_082022-F.webp', ruta: 'productos\\cubiertos\\remos.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Tenedor', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_2X_835147-MLU78458236278_082024-F.webp', ruta: 'productos\\cubiertos\\tenedor.html', categoria: 'Cubiertos', boton: 'Ver Producto' },
    { nombre: 'Tenedor negro', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_2X_600612-MLA80900595398_122024-F.webp', ruta: 'productos\\cubiertos\\tenedornegro.html', categoria: 'Cubiertos', boton: 'Ver Producto' },

    // Film
    { nombre: 'Film', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FILM%20-%20STRETCH/D_NQ_NP_2X_724993-MLA74413303619_022024-F.webp', ruta: 'productos\\film\\film.html', categoria: 'Film', boton: 'Ver Producto', tamanos: ["38x700", "45x700"]},
    { nombre: 'Film boliviano', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FILM%20-%20STRETCH/D_NQ_NP_2X_896757-MLA82920461463_032025-F.webp', ruta: 'productos\\film\\filmboliviano.html', categoria: 'Film', boton: 'Ver Producto', tamanos: ["38", "45"]},
    { nombre: 'Film económico', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FILM%20-%20STRETCH/film%205mts.jpg', ruta: 'productos\\film\\filmeconomico.html', categoria: 'Film', boton: 'Ver Producto', tamanos: ["38x300 (respuesto)", "45x300 (repuesto)"]},
    { nombre: 'Stretch virgen', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FILM%20-%20STRETCH/strech%20con%20manija.jpg', ruta: 'productos\\film\\stretchvirgen.html', categoria: 'Film', boton: 'Ver Producto', tamanos: ["10cm", "con mango", "manual"]},
    { nombre: 'Stretch negro', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FILM%20-%20STRETCH/rollo%20strech%20negro.jpg', ruta: 'productos\\film\\stretchnegro.html', categoria: 'Film', boton: 'Ver Producto', tamanos: ["10cm", "con mango"]},

    // Fólex
    { nombre: 'Fólex 20x25', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FÓLEX/Folex.webp', ruta: 'productos\\folex\\folex.html', categoria: 'Fólex', boton: 'Ver Producto' },
    { nombre: 'Fólex hamburguesa', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FÓLEX/Folex%20hamburguesa.webp', ruta: 'productos\\folex\\folexhamburguesa.html', categoria: 'Fólex', boton: 'Ver Producto' },
    { nombre: 'Papel aluminio hamburguesa 30x40', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/FÓLEX/Folex%20hamburguesa.webp', ruta: 'productos\\folex\\papelaluminiohamburguesa.html', categoria: 'Fólex', boton: 'Ver Producto' },

    // Guantes
    { nombre: 'Guante nitrilo', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/GUANTES/D_NQ_NP_2X_764586-MLU72636722033_112023-F.webp', ruta: 'productos\\guantes\\nitirlo.html', categoria: 'Guantes', boton: 'Ver Producto', tamanos: ["Talle M", "Talle L"]},
    { nombre: 'Guante polietileno', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/GUANTES/D_NQ_NP_2X_829059-MLA80203053115_102024-F.webp', ruta: 'productos\\guantes\\polietileno.html', categoria: 'Guantes', boton: 'Ver Producto' },

    // Libreria
    { nombre: 'Abrochadoras', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/LIBRERÍA/abrochadora.jpg', ruta: 'productos\\libreria\\abrochadoras.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Biromes', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\biromes.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Cuadernos Universitarios', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\cuadernosuniv.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Estallidos', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/LIBRERÍA/estallidos.jpg', ruta: 'productos\\libreria\\estallidos.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Fibrones', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\fibrones.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Hilo', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\hilo.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Hojas', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\hojas.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Liquid Paper', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\liquidpaper.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Máquina De Mótex', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/LIBRERÍA/maquina%20motex.jpg', ruta: 'productos\\libreria\\maquinamotex.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Mótex', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\motex.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Remitos', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\remitos.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Resaltador', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\resaltador.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Tacos De Papel', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/LIBRERÍA/tacos%20de%20papel.jpg', ruta: 'productos\\libreria\\tacospapel.html', categoria: 'Libreria', boton: 'Ver Producto' },
    { nombre: 'Voligoma', descripcion: '', precioARS: 0, imagen: '', ruta: 'productos\\libreria\\voligoma.html', categoria: 'Libreria', boton: 'Ver Producto' },

    // Papel
    { nombre: 'Papel aluminio', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ALUMINIO/aluminio%205%20mts.jpg', ruta: 'productos\\papel\\aluminio.html', categoria: 'Papel', boton: 'Ver Producto' },
    { nombre: 'Bobina De Papel', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20SULFITO/bobina%20de%20papel.jpg', ruta: 'productos\\papel\\bobina.html', categoria: 'Papel', boton: 'Ver Producto', tamanos: ["35x45", "40cm", "60cm"]},
    { nombre: 'Papel cortado', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20SULFITO/Papel%20cortado.webp', ruta: 'productos\\papel\\cortado.html', categoria: 'Papel', boton: 'Ver Producto', tamanos: ["35x45", "40x50", "50x70", "60x90"]},
    { nombre: 'Papel Manteca', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20MANTECA/Papel%20manteca.webp', ruta: 'productos\\papel\\manteca.html', categoria: 'Papel', boton: 'Ver Producto' },
    { nombre: 'Rollo De Cocina', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20HIGIÉNICO%20-%20ROLLO%20DE%20COCINA/rollo%20de%20cocina%20elegante.jpg', ruta: 'productos\\papel\\rollococina.html', categoria: 'Papel', boton: 'Ver Producto' },
    { nombre: 'Papel Higiénico Económico', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20HIGIÉNICO%20-%20ROLLO%20DE%20COCINA/papel%20higenico%20elegante.jpg', ruta: 'productos\\papel\\higienicoeco.html', categoria: 'Papel', boton: 'Ver Producto' },
    { nombre: 'Papel Higiénico Reforzado', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/PAPEL%20HIGIÉNICO%20-%20ROLLO%20DE%20COCINA/Higiénico%20new%20pel%20línea%20premium%20triple%20hoja.jpg', ruta: 'productos\\papel\\higienicorefo.html', categoria: 'Papel', boton: 'Ver Producto' },

    // Pizzeria
    { nombre: 'Cono de papas', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/conos%20de%20papas%20fritas.jpg', ruta: 'productos\\pizzeria\\conopapas.html', categoria: 'Pizzeria', boton: 'Ver Producto' },
    { nombre: 'Fondo pizza chico', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/papel%20fondo%20para%20pizza.jpg', ruta: 'productos\\pizzeria\\fondopizzachico.html', categoria: 'Pizzeria', boton: 'Ver Producto' },
    { nombre: 'Fondo pizza grande', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/papel%20fondo%20para%20pizza.jpg', ruta: 'productos\\pizzeria\\fondopizzagrande.html', categoria: 'Pizzeria', boton: 'Ver Producto' },
    { nombre: 'Porta Panchos', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/porta%20panchos.jpg', ruta: 'productos\\pizzeria\\portapanchos.html', categoria: 'Pizzeria', boton: 'Ver Producto' },
    { nombre: 'Tripode', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ARTÍCULOS%20DE%20PIZZERÍA/Tripode-Pizza.webp', ruta: 'productos\\pizzeria\\tripode.html', categoria: 'Pizzeria', boton: 'Ver Producto' },

    // Potes
    { nombre: 'Pote bisagra', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/POTES/potes%20bisagra.jpg', ruta: 'productos\\potes\\bisagra.html', categoria: 'Potes', boton: 'Ver Producto' },
    { nombre: 'Pote dips', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/POTES/D_NQ_NP_2X_957775-MLA70448724893_072023-F.webp', ruta: 'productos\\potes\\dips.html', categoria: 'Potes', boton: 'Ver Producto' },
    { nombre: 'Pote Ensalada de fruta', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/POTES/D_NQ_NP_2X_957775-MLA70448724893_072023-F.webp', ruta: 'productos\\potes\\dips.html', categoria: 'Potes', boton: 'Ver Producto' },
    { nombre: 'Tapa de pote ensalada de fruta', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/POTES/D_NQ_NP_2X_957775-MLA70448724893_072023-F.webp', ruta: 'productos\\potes\\dips.html', categoria: 'Potes', boton: 'Ver Producto' },

    // Rollos térmicos
    { nombre: 'Rollo térmico', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/ROLLOS%20TÉRMICOS/rollo%20termico.jpeg', ruta: 'productos\\rollostermicos\\rollos.html', categoria: 'RollosTermicos', boton: 'Ver Producto', tamanos: ["44x50", "57x20", "57x30", "80x30"]},

    // Sorbetes
    { nombre: 'Sorbetes Común', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/D_NQ_NP_844300-MLA80844285453_112024-O.webp', ruta: 'productos\\sorbetes\\comun.html', categoria: 'Sorbetes', boton: 'Ver Producto' },
    { nombre: 'Sorbetes Negro', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/sorbetes%20descartables%20negros.jpg', ruta: 'productos\\sorbetes\\negro.html', categoria: 'Sorbetes', boton: 'Ver Producto' },
    { nombre: 'Sorbetes Papel', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/CUBIERTOS-PLATOS/images.jfif', ruta: 'productos\\sorbetes\\papel.html', categoria: 'Sorbetes', boton: 'Ver Producto' },

    // Vasos
    { nombre: 'Vasos Plástico', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/VASOS/D_841199-MLA52688134406_122022-O.jpg', ruta: 'productos\\vasos\\plastico.html', categoria: 'Vasos', boton: 'Ver Producto', tamanos: ["220ml", "330ml", "500ml", "1000ml"]},
    { nombre: 'Vasos Telgopor', descripcion: '', precioARS: 0, imagen: 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20catálogo/VASOS/vaso-termico-180-cc-50-unidades1-effa370a04aa41b56b15571658086178-480-0.jpg', ruta: 'productos\\vasos\\telgopor.html', categoria: 'Vasos', boton: 'Ver Producto', tamanos: ["120ml", "180ml", "240ml"]},
];

// Función para formatear números con puntos como separador de miles
function formatearNumeroConPuntos(numero) {
    if (!numero || isNaN(numero.toString().replace(/\./g, '')) || parseInt(numero.toString().replace(/\./g, ''), 10) === 0) {
        return "A confirmar"; // Si no hay precio, mostrar esto
    }

    // Convertir a número y formatear con puntos
    numero = parseInt(numero.toString().replace(/\./g, ''), 10);
    return numero.toLocaleString('es-AR'); 
}

document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar productos
    function cargarProductos() {
        const contenedor = document.getElementById('productos');
        contenedor.innerHTML = '';  // Limpiar productos existentes

        productos.forEach((producto, index) => {
            const precioFormateado = formatearNumeroConPuntos(producto.precioARS);
            const tamanos = producto.tamanos && producto.tamanos.length > 0 ? producto.tamanos : null;

            const productoHTML = `
                <div class="producto">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>
                        Precio: 
                        ${precioFormateado === "A confirmar" 
                            ? '<span class="precio">A confirmar</span>' 
                            : `<span class="precio">$${precioFormateado}</span>`}
                        
                        <!-- Dropdown solo si el producto tiene tamaños -->
                        ${tamanos ? `
                            <div class="droptmn">
                                <span class="textomed">Medidas</span>
                                <ul class="droptmn-menu">
                                    ${tamanos.map(tamano => `<li data-size="${tamano}">${tamano}</li>`).join('')}
                                </ul>
                            </div>` 
                        : ''}

                    </p>
                    <a href="${producto.ruta}" class="btn-ver-producto">${producto.boton}</a>
                </div>
            `;

            contenedor.innerHTML += productoHTML;

            // "clearfix" opcional cada 5 productos
            if ((index + 1) % 5 === 0) {
                contenedor.innerHTML += '<div class="clearfix"></div>';
            }
        });

        // Inicializar la funcionalidad del dropdown
        inicializarDropdown();
    }

    cargarProductos(); // Llamar a la función para cargar los productos
});

// Función para filtrar productos según la categoría
function filtrarCategoria(categoria) {
    console.log("Filtrando productos de la categoría:", categoria);

    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';  

    // Si la categoría es "todos", mostramos todos los productos
    if (categoria.toLowerCase() === 'todos') {
        cargarProductos(); 
        return;
    }

    // Filtrar productos según la categoría seleccionada
    const productosFiltrados = productos.filter(producto => producto.categoria.toLowerCase() === categoria.toLowerCase());

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en esta categoría.</p>';
        return;
    }

    // Mostrar los productos filtrados
    productosFiltrados.forEach((producto, index) => {
        const precioFormateado = formatearNumeroConPuntos(producto.precioARS);

        const productoHTML = `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>
                    Precio: 
                    ${precioFormateado === "A confirmar" 
                        ? '<span class="precio">A confirmar</span>' 
                        : `<span class="precio">$${precioFormateado}</span>`}
                </p>
                <a href="${producto.ruta}" class="btn-ver-producto">${producto.boton}</a>
            </div>
        `;
        
        contenedor.innerHTML += productoHTML;

        // Para hacer un "clearfix" cada 5 productos (opcional)
        if ((index + 1) % 5 === 0) {
            contenedor.innerHTML += '<div class="clearfix"></div>';
        }
    });
}

// Mostrar/Ocultar el dropdown de "Más"
function toggleMoreDropdown() {
    const moreDropdown = document.getElementById('more-dropdown');
    const isOpen = moreDropdown.style.display === 'block';
    
    if (isOpen) {
        moreDropdown.style.display = 'none';
    } else {
        moreDropdown.style.display = 'block';
    }
}

// Cerrar el dropdown si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const moreDropdown = document.getElementById('more-dropdown');
    const moreBtn = document.querySelector('.more-btn');
    if (!moreBtn.contains(event.target) && !moreDropdown.contains(event.target)) {
        moreDropdown.style.display = 'none';
    }
});

// Ejecutar la función de cargar productos cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos(); // Mostrar todos los productos por defecto al cargar la página
});

// Función para inicializar los dropdowns de medidas
function inicializarDropdown() {
    document.querySelectorAll('.droptmn').forEach(dropdown => {
        const btn = dropdown.querySelector('.textomed');
        const menu = dropdown.querySelector('.droptmn-menu');

        if (!btn || !menu) return;

        // Toggle del menú al hacer clic en el botón
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el clic cierre el menú inmediatamente

            // Cerrar otros menús abiertos antes de abrir el actual
            document.querySelectorAll('.droptmn-menu.droptmn-show').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('droptmn-show');
                }
            });

            // Alternar la visibilidad del menú actual
            menu.classList.toggle('droptmn-show');
        });

        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('droptmn-show');
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                menu.classList.remove('droptmn-show');
            }
        });

        // Seleccionar medida y cerrar menú
        menu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                btn.textContent = item.textContent; // Actualizar el texto del botón
                menu.classList.remove('droptmn-show'); // Cerrar el menú
            });
        });
    });
}

// Ejecutar la inicialización después de cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarDropdown();
});
document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio10Span = document.getElementById('precio-10');
    const precio50Span = document.getElementById('precio-50');
    const precio100Span = document.getElementById('precio-100'); // necesitas agregar esto en el HTML
    const monedaSpans = document.querySelectorAll('.moneda');
    const arsSpans = document.querySelectorAll('.ars');
    const imagenProducto = document.getElementById('producto-img');

    const data = {
        "101": {
            p10: "500", p50: "1600", p100: "3000",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/bandeja%20descartable%20n%20101.jpg"
        },
        "101t": {
            p100: "5500",
            img: "https://http2.mlstatic.com/D_NQ_NP_939710-MLA48445790146_122021-O.webp"
        },
        "102": {
            p10: "800", p50: "2500", p100: "3800",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/Bandeja%20descartable%20n102.jpg"
        },
        "102t": {
            p100: "6500",
            img: "https://www.papelerajb.com/wp-content/uploads/2023/05/bandeja_plastica_descartable_con_tapa_102_Boulevares.jpg"
        },
        "103": {
            p10: "900", p50: "3000", p100: "5200",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/bandeja%20descartable%20n%20103.jpg"
        },
        "105r": {
            p10: "1100", p50: "4200", p100: "8100",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/bandeja%20descartable%20n%20105%20rectangular.jpg"
        },
        "105o": {
            p10: "1000", p50: "3800", p100: "7200",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/bandeja%20descartable%20n%20105%20ovalada.jpg"
        },
        "107": {
            p10: "1500", p50: "6500", p100: "12000",
            img: "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20PL%C3%81STICAS/bandeja%20descartable%20n%20107.jpg"
        }
    };

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const producto = data[medida];

            dropdownBtn.textContent = `Tamaño: N° ${medida}`;
            uniDiv.style.display = 'block';

            // Mostrar precios
            precio10Span.textContent = producto.p10 ?? 'Sin Stock';
            precio50Span.textContent = producto.p50 ?? 'Sin Stock';

            // Asegurate de tener <span id="precio-100"> en el HTML
            if (document.getElementById('precio-100')) {
                document.getElementById('precio-100').textContent = producto.p100 ?? 'Sin Stock';
            }

            monedaSpans.forEach((el, i) => {
                el.style.display = [producto.p10, producto.p50, producto.p100][i] ? 'inline' : 'none';
            });

            arsSpans.forEach((el, i) => {
                el.style.display = [producto.p10, producto.p50, producto.p100][i] ? 'inline' : 'none';
            });

            imagenProducto.src = producto.img;

            dropdownMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
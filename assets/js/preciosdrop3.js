document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio50Span = document.getElementById('precio-10');  // Por 50 unidades
    const precio100Span = document.getElementById('precio-50'); // Por 100 unidades
    const arsSpans = document.querySelectorAll('.ars');
    const imagenProducto = document.getElementById('producto-img');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const p50 = item.getAttribute('data-price-bulk');
            const p100 = item.getAttribute('data-bulto');

            const isP50OutOfStock = p50 && p50.toLowerCase() === 'sin stock';
            const isP100OutOfStock = p100 && p100.toLowerCase() === 'sin stock';

            precio50Span.textContent = isP50OutOfStock ? 'Sin Stock' : p50;
            precio100Span.textContent = isP100OutOfStock ? 'Sin Stock' : p100;

            // Mostrar u ocultar ARS según stock
            arsSpans[0].style.display = isP50OutOfStock ? 'none' : 'inline';
            arsSpans[1].style.display = isP100OutOfStock ? 'none' : 'inline';

            dropdownBtn.textContent = `Tamaño: N° ${medida}`;
            uniDiv.style.display = 'block';

            if (['12', '12.5', '13', '13.5'].includes(medida)) {
                imagenProducto.src = 'https://http2.mlstatic.com/D_NQ_NP_973399-MLA43347970158_092020-O.webp';
            } else {
                imagenProducto.src = 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/BANDEJAS%20DE%20CART%C3%93N/bandeja%20de%20carton.webp';
            }

            dropdownMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
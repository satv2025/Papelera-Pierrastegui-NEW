document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio50Span = document.getElementById('precio-10');  // Por 50 unidades
    const precio100Span = document.getElementById('precio-50'); // Por 100 unidades
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

            const precio50Parent = precio50Span.parentElement;
            const precio100Parent = precio100Span.parentElement;

            // Actualizar precio de 50 unidades
            if (isP50OutOfStock) {
                precio50Parent.innerHTML = 'Por 50 Unidades: <span id="precio-10">Sin Stock</span>';
            } else {
                precio50Parent.innerHTML = 'Por 50 Unidades: $<span id="precio-10">' + p50 + '</span> ARS';
            }

            // Actualizar precio de 100 unidades
            if (isP100OutOfStock) {
                precio100Parent.innerHTML = 'Por 100 Unidades: <span id="precio-50">Sin Stock</span>';
            } else {
                precio100Parent.innerHTML = 'Por 100 Unidades: $<span id="precio-50">' + p100 + '</span> ARS';
            }

            dropdownBtn.textContent = `Tamaño: N° ${medida}`;
            uniDiv.style.display = 'block';

            // Mostrar imagen especial para ciertos tamaños
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
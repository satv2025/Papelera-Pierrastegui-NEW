document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio50 = document.getElementById('precio-10');  // Por 50 unidades
    const precio100 = document.getElementById('precio-50'); // Por 100 unidades
    const imagenProducto = document.getElementById('producto-img');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const p50 = item.getAttribute('data-price-bulk');
            const p100 = item.getAttribute('data-bulto');

            precio50.textContent = (p50 && p50.toLowerCase() === 'sin stock') ? 'Sin Stock' : p50;
            precio100.textContent = (p100 && p100.toLowerCase() === 'sin stock') ? 'Sin Stock' : p100;

            dropdownBtn.textContent = `Tamaño: N° ${medida}`;
            uniDiv.style.display = 'block';

            // Mostrar imagen especial para N° 12, 12.5, 13 y 13.5
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
document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio10 = document.getElementById('precio-10');
    const precio50 = document.getElementById('precio-50');
    const precio100 = document.getElementById('precio-100');
    const imagenProducto = document.getElementById('producto-img');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const p10 = item.getAttribute('data-price-unit');
            const p50 = item.getAttribute('data-price-bulk');
            const p100 = item.getAttribute('data-bulto');

            precio10.textContent = (p10 && p10.toLowerCase() === 'sin stock') ? 'Sin Stock' : p10;
            precio50.textContent = (p50 && p50.toLowerCase() === 'sin stock') ? 'Sin Stock' : p50;
            precio100.textContent = (p100 && p100.toLowerCase() === 'sin stock') ? 'Sin Stock' : p100;

            dropdownBtn.textContent = `Tamaño: ${medida}`;
            uniDiv.style.display = 'block';

            // Imagen opcional personalizada
            if (medida === 'P12') {
                imagenProducto.src = 'https://www.smpdescartables.com/cdn/shop/products/COD-565.jpg';
            } else {
                imagenProducto.src = 'https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/ALUMINIO/bandeja%20de%20aluminio%20f100.jpg';
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
document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precioValor = document.getElementById('precio-valor');
    const imagenProducto = document.getElementById('producto-img');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const pUnit = item.getAttribute('data-price-unit');

            precioValor.textContent = (pUnit && pUnit.toLowerCase() === 'sin stock') ? 'Sin Stock' : pUnit;
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
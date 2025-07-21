document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio100 = document.getElementById('precio-100');
    const imagenProducto = document.getElementById('producto-img');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const p100 = item.getAttribute('data-price-100');

            precio100.textContent = (p100 && p100.toLowerCase() === 'sin stock') ? 'Sin Stock' : p100;
            dropdownBtn.textContent = `Tamaño: ${medida}`;
            uniDiv.style.display = 'block';

            dropdownMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
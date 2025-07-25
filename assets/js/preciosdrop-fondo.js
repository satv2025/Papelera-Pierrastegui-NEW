document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio1kg = document.getElementById('precio-1kg');
    const precio10kg = document.getElementById('precio-10kg');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const p1kg = item.getAttribute('data-price-1kg');
            const p10kg = item.getAttribute('data-price-10kg');

            precio1kg.textContent = (p1kg && p1kg.toLowerCase() === 'sin stock') ? 'Sin Stock' : p1kg;
            precio10kg.textContent = (p10kg && p10kg.toLowerCase() === 'sin stock') ? 'Sin Stock' : p10kg;

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
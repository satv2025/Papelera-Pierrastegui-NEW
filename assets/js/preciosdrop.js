document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precioUnit = document.getElementById('precio-unit');
    const precioBulto = document.getElementById('precio-bulto');
    const cantidadBulto = document.getElementById('cantidad-bulto');

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const unitPrice = item.getAttribute('data-price-unit');
            const bulkPrice = item.getAttribute('data-price-bulk');
            const unidadesBulto = item.getAttribute('data-bulto');

            if (unitPrice && bulkPrice && unidadesBulto) {
                precioUnit.textContent = Number(unitPrice).toLocaleString('es-AR');
                precioBulto.textContent = Number(bulkPrice).toLocaleString('es-AR');
                cantidadBulto.textContent = unidadesBulto;

                dropdownBtn.textContent = `Tamaño: ${medida}`;
                uniDiv.style.display = 'block';
                dropdownMenu.style.display = 'none';
            } else {
                console.warn("Faltan datos para la medida:", medida);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
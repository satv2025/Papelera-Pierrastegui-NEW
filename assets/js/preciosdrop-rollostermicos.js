document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precioUnidad = document.getElementById('precio-unidad');
    const precioUnidadMoneda = document.getElementById('precio-unidad-moneda');
    const sinStockMsg = document.getElementById('sin-stock');

    // Definir precios por medida (podés cambiar los valores)
    const precios = {
        "44x50": { precio: "8.500", moneda: "ARS" },
        "57x20": { precio: "5.500", moneda: "ARS" },
        "57x30": { precio: "6.500", moneda: "ARS" },
        "80x30": { precio: "8.500", moneda: "ARS" } // ejemplo sin stock
    };

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-medida');
            dropdownBtn.textContent = `Medida: ${medida}`;
            dropdownMenu.style.display = 'none';

            const precioData = precios[medida];

            if (!precioData || precioData.precio.toString().toLowerCase() === "sin stock") {
                uniDiv.style.display = 'none';
                sinStockMsg.style.display = 'block';
            } else {
                precioUnidad.textContent = precioData.precio;
                precioUnidadMoneda.textContent = precioData.moneda;
                uniDiv.style.display = 'block';
                sinStockMsg.style.display = 'none';
            }
        });
    });

    // Cerrar dropdown al hacer click afuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
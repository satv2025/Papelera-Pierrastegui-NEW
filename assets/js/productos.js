document.addEventListener('DOMContentLoaded', () => {
    const sizeDropdownBtn = document.querySelector('#size-dropdown > .dropdown-btn');
    const sizeDropdownMenu = document.querySelector('#size-dropdown > .dropdown-menu');
    const sizeOptions = sizeDropdownMenu.querySelectorAll('.dropdown-item');

    const cantidadDropdown = document.querySelector('#cantidad-dropdown');
    const cantidadBtn = cantidadDropdown.querySelector('.dropdown-btn');
    const cantidadMenu = cantidadDropdown.querySelector('.dropdown-menu');
    const cantidadOptions = cantidadMenu.querySelectorAll('.dropdown-item');

    const limpiarBtn = document.getElementById('limpiar');
    const decrementarBtn = document.getElementById('decrementar');
    const incrementarBtn = document.getElementById('incrementar');
    const cantidadVisual = document.getElementById('cantidad-visual');
    const totalDisplay = document.querySelector('.total');
    const preciosBox = document.querySelector('.precios');
    const precioUnitText = document.querySelector('.precio-unit');
    const precioBulkText = document.querySelector('.precio-bulto');

    // Variables de estado
    let selectedSize = null;
    let selectedCantidad = 1;
    const unitPriceDefault = 4700;
    const bulkPriceDefault = 25200;

    // ---------- Funciones auxiliares ----------
    const createArrow = () => {
        const span = document.createElement('span');
        span.classList.add('arrow');
        span.textContent = '▼';
        return span;
    };

    const deselectCantidadDropdown = () => {
        cantidadOptions.forEach(o => o.classList.remove('selected'));
        cantidadBtn.textContent = `${selectedCantidad} `;
        cantidadBtn.appendChild(createArrow());
    };

    const updatePrices = () => {
        if (!selectedSize) {
            preciosBox.style.display = 'none';
            totalDisplay.textContent = 'Total: $0';
            return;
        }

        preciosBox.style.display = 'block';
        const unitPrice = selectedSize.priceUnit || unitPriceDefault;
        const bulkPrice = selectedSize.priceBulk || bulkPriceDefault;

        precioUnitText.textContent = `Por unidad: $${unitPrice.toLocaleString('es-AR')} ARS`;
        precioBulkText.textContent = `Por bulto (6 unidades): $${bulkPrice.toLocaleString('es-AR')} ARS`;

        let total = 0;
        if (selectedCantidad >= 6) {
            const bulkCount = Math.floor(selectedCantidad / 6);
            const remainingUnits = selectedCantidad % 6;
            total = (bulkCount * bulkPrice) + (remainingUnits * unitPrice);
        } else {
            total = selectedCantidad * unitPrice;
        }

        totalDisplay.textContent = `Total: $${total.toLocaleString('es-AR')} ARS`;
    };

    // ---------- Dropdown tamaño ----------
    sizeDropdownBtn.addEventListener('click', () => {
        sizeDropdownMenu.classList.toggle('active');
        sizeDropdownBtn.setAttribute('aria-expanded', sizeDropdownMenu.classList.contains('active'));
    });

    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedSize = {
                size: option.dataset.size,
                priceUnit: Number(option.dataset.priceUnit),
                priceBulk: Number(option.dataset.priceBulk),
            };
            sizeDropdownBtn.textContent = `${selectedSize.size} `;
            sizeDropdownBtn.appendChild(createArrow());
            sizeDropdownMenu.classList.remove('active');
            sizeDropdownBtn.setAttribute('aria-expanded', false);
            updatePrices();
        });
    });

    // ---------- Dropdown cantidad ----------
    cantidadBtn.addEventListener('click', () => {
        cantidadMenu.classList.toggle('active');
        cantidadBtn.setAttribute('aria-expanded', cantidadMenu.classList.contains('active'));
    });

    cantidadOptions.forEach(option => {
        option.addEventListener('click', () => {
            cantidadOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedCantidad = Number(option.dataset.value);
            cantidadBtn.textContent = option.textContent + ' ';
            cantidadBtn.appendChild(createArrow());
            cantidadMenu.classList.remove('active');
            cantidadBtn.setAttribute('aria-expanded', false);
            cantidadVisual.textContent = selectedCantidad;
            updatePrices();
        });
    });

    // ---------- Botones + y - ----------
    incrementarBtn.addEventListener('click', () => {
        if (selectedCantidad < 100) {
            selectedCantidad++;
            cantidadVisual.textContent = selectedCantidad;
            deselectCantidadDropdown();
            updatePrices();
        }
    });

    decrementarBtn.addEventListener('click', () => {
        if (selectedCantidad > 1) {
            selectedCantidad--;
            cantidadVisual.textContent = selectedCantidad;
            deselectCantidadDropdown();
            updatePrices();
        }
    });

    // ---------- Botón "Limpiar" ----------
    limpiarBtn.addEventListener('click', () => {
        selectedSize = null;
        selectedCantidad = 1;

        // Reset de UI
        sizeOptions.forEach(o => o.classList.remove('selected'));
        sizeDropdownBtn.textContent = 'Seleccionar Tamaño ';
        sizeDropdownBtn.appendChild(createArrow());
        cantidadVisual.textContent = '1';
        cantidadOptions.forEach(o => o.classList.remove('selected'));
        cantidadBtn.textContent = '1 ';
        cantidadBtn.appendChild(createArrow());
        preciosBox.style.display = 'none';
        totalDisplay.textContent = 'Total: $0';
    });

    // ---------- Cierre de dropdowns al hacer clic fuera ----------
    document.addEventListener('click', (e) => {
        if (!sizeDropdownBtn.contains(e.target) && !sizeDropdownMenu.contains(e.target)) {
            sizeDropdownMenu.classList.remove('active');
        }
        if (!cantidadDropdown.contains(e.target)) {
            cantidadMenu.classList.remove('active');
        }
    });
});
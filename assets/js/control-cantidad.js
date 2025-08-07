// JS y CSS combinados para que el dropdown, selección y precios funcionen correctamente

// === JavaScript: productos.js ===
document.addEventListener('DOMContentLoaded', function () {
    const sizeDropdown = document.querySelector('.producto-info .dropdown');
    const sizeBtn = sizeDropdown.querySelector('.dropdown-btn');
    const sizeMenu = sizeDropdown.querySelector('.dropdown-menu');
    const sizeItems = sizeMenu.querySelectorAll('.dropdown-item');

    const quantityDropdown = document.getElementById('cantidad-dropdown');
    const quantityBtn = quantityDropdown.querySelector('.dropdown-btn');
    const quantityMenu = quantityDropdown.querySelector('.dropdown-menu');
    const quantityItems = quantityMenu.querySelectorAll('.dropdown-item');

    const precioUnitElement = document.querySelector('.precio-unit');
    const precioBultoElement = document.querySelector('.precio-bulto');
    const totalElement = document.querySelector('.total');
    const cantidadVisual = document.getElementById('cantidad-visual');
    const incrementarBtn = document.getElementById('incrementar');
    const decrementarBtn = document.getElementById('decrementar');
    const limpiarBtn = document.getElementById('limpiar');

    let selectedUnitPrice = 4700;
    let selectedBulkPrice = 25200;
    let selectedSize = null;
    let selectedQuantity = 1;

    // Utilidad para mostrar precios y total
    function actualizarPrecios() {
        const preciosContainer = document.querySelectorAll('.precios');
        preciosContainer.forEach(div => div.style.display = 'block');

        precioUnitElement.textContent = `Por unidad: $${selectedUnitPrice.toLocaleString()} ARS`;
        precioBultoElement.textContent = `Por bulto (6 unidades): $${selectedBulkPrice.toLocaleString()} ARS`;

        let total = 0;
        if (selectedQuantity === 6) {
            total = selectedBulkPrice;
        } else {
            total = selectedUnitPrice * selectedQuantity;
        }

        totalElement.textContent = `Total: $${total.toLocaleString()}`;
    }

    // Función común para abrir/cerrar dropdown
    function toggleDropdown(dropdownMenu) {
        dropdownMenu.classList.toggle('active');
    }

    // Selección de tamaño
    sizeBtn.addEventListener('click', () => toggleDropdown(sizeMenu));

    sizeItems.forEach(item => {
        item.addEventListener('click', function () {
            selectedSize = item.dataset.size;
            selectedUnitPrice = parseInt(item.dataset.priceUnit);
            selectedBulkPrice = parseInt(item.dataset.priceBulk);

            sizeBtn.innerHTML = `${selectedSize} <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
            sizeMenu.classList.remove('active');

            actualizarPrecios();
        });
    });

    // Selección de cantidad desde dropdown
    quantityBtn.addEventListener('click', () => toggleDropdown(quantityMenu));

    quantityItems.forEach(item => {
        item.addEventListener('click', function () {
            selectedQuantity = parseInt(item.dataset.value);
            cantidadVisual.textContent = selectedQuantity;

            quantityBtn.innerHTML = `${selectedQuantity} <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
            quantityMenu.classList.remove('active');

            actualizarPrecios();
        });
    });

    // Botón + y -
    incrementarBtn.addEventListener('click', () => {
        selectedQuantity++;
        cantidadVisual.textContent = selectedQuantity;
        quantityBtn.innerHTML = `${selectedQuantity} <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
        actualizarPrecios();
    });

    decrementarBtn.addEventListener('click', () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            cantidadVisual.textContent = selectedQuantity;
            quantityBtn.innerHTML = `${selectedQuantity} <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
            actualizarPrecios();
        }
    });

    // Botón limpiar
    limpiarBtn.addEventListener('click', () => {
        selectedSize = null;
        selectedQuantity = 1;
        selectedUnitPrice = 4700;
        selectedBulkPrice = 25200;
        cantidadVisual.textContent = selectedQuantity;
        quantityBtn.innerHTML = `1 <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
        sizeBtn.innerHTML = `Seleccionar Tamaño <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>`;
        document.querySelectorAll('.precios').forEach(div => div.style.display = 'none');
        totalElement.textContent = 'Total: $0';
    });

    // Cerrar dropdowns al hacer clic fuera
    window.addEventListener('click', function (e) {
        if (!sizeDropdown.contains(e.target)) {
            sizeMenu.classList.remove('active');
        }
        if (!quantityDropdown.contains(e.target)) {
            quantityMenu.classList.remove('active');
        }
    });
});
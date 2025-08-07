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

    // Variables de estado
    let selectedSize = null;
    let selectedCantidad = 1;
    const unitPriceDefault = 4700;
    const bulkPriceDefault = 25200;

    // Manejar dropdown tamaño
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
            sizeDropdownBtn.textContent = `${selectedSize.size}`;
            sizeDropdownBtn.appendChild(createArrow());
            sizeDropdownMenu.classList.remove('active');
            sizeDropdownBtn.setAttribute('aria-expanded', false);
            updatePrices();
        });
    });

    // Manejar dropdown cantidad
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

    // Incrementar / Decrementar botones
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

    // Botón limpiar
    limpiarBtn.addEventListener('click', () => {
        selectedSize
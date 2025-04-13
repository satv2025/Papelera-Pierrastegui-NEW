document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "100x20": { unidad: '10.000' },
        "120x20": { unidad: '12.000' }
    };
    
    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precio = document.getElementById("precio-50");
    const precioMoneda = document.getElementById("precio-50-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                const { u1 } = data;

                const isStock = !(u1.toLowerCase().includes("no está"));

                if (isStock) {
                    precio.textContent = `$${u1}`;
                    precioMoneda.textContent = "ARS";

                    sinStock.style.display = "none";
                    precioBox.style.display = "block";
                } else {
                    precioBox.style.display = "none";
                    sinStock.style.display = "block";
                }
            }
        });
    });
});
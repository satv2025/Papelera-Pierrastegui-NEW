document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "media-docena": { u50: 'none', u100: 'none' },
        "docena": { u50: '13.000', u100: '24.500' },
        "docena-y-media": { u50: '14.000', u100: '27.500' }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStock = document.getElementById("sin-stock");

    const precio50 = document.getElementById("precio-50");
    const precio50Moneda = document.getElementById("precio-50-moneda");

    const precio100 = document.getElementById("precio-100");
    const precio100Moneda = document.getElementById("precio-100-moneda");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                const { u50, u100 } = data;

                const isStock = !(u50.toLowerCase().includes("no está") || u100.toLowerCase().includes("no está"));

                if (isStock) {
                    precio50.textContent = `$${u50}`;
                    precio50Moneda.textContent = "ARS";

                    precio100.textContent = `$${u100}`;
                    precio100Moneda.textContent = "ARS";

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
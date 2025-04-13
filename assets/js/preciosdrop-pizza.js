document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "pizza-chica": { u50: 'este precio no está establecido', u100: 'este precio no está establecido' },
        "pizza-grande": { u50: '18.000', u100: '34.500' },
        "pizza-metro": { u50: '22.000', u100: '42.000' }
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
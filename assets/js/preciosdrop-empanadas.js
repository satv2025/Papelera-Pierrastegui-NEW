document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "media-docena": { u50: 'este precio no está establecido', u100: 'este precio no está establecido' },
        "docena": { u50: '13.000', u100: '24.500' },
        "docena-y-media": { u50: '14.000', u100: '27.500' }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioBox = document.getElementById("uni");
    const sinStockBox = document.getElementById("sin-stock");

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

                const sinStock = u50 === "SIN STOCK" && u100 === "SIN STOCK";

                if (sinStock) {
                    precioBox.style.display = "none";
                    sinStockBox.style.display = "block";
                } else {
                    sinStockBox.style.display = "none";
                    precioBox.style.display = "block";

                    if (u50 !== "SIN STOCK") {
                        precio50.textContent = u50;
                        precio50Moneda.textContent = "ARS";
                    } else {
                        precio50.textContent = "";
                        precio50Moneda.textContent = "";
                    }

                    if (u100 !== "SIN STOCK") {
                        precio100.textContent = u100;
                        precio100Moneda.textContent = "ARS";
                    } else {
                        precio100.textContent = "";
                        precio100Moneda.textContent = "";
                    }
                }
            } else {
                precioBox.style.display = "none";
                sinStockBox.style.display = "none";
            }
        });
    });
});
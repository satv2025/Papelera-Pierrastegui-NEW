document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "media-docena": { u50: "none", u100: "none" },
        "docena": { u50: "13.000", u100: "24.500" },
        "docena-y-media": { u50: "14.000", u100: "27.500" }
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

                const mostrar50 = u50 !== "none" && u50 !== "";
                const mostrar100 = u100 !== "none" && u100 !== "";

                if (mostrar50 || mostrar100) {
                    precio50.textContent = mostrar50 ? `$${u50}` : "";
                    precio50Moneda.textContent = mostrar50 ? "ARS" : "";

                    precio100.textContent = mostrar100 ? `$${u100}` : "";
                    precio100Moneda.textContent = mostrar100 ? "ARS" : "";

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
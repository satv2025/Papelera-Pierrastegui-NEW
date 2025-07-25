document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "220ml": { cincuenta: "2.000", cien: "3.200" },
        "330ml": { cincuenta: "3.200", cien: "4.700" },
        "500ml": { cincuenta: "3.500", cien: "6.500" },
        "1000ml": { cincuenta: "9.000", cien: "16.800" }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const preciosBox = document.getElementById("precios");
    const sinStock = document.getElementById("sin-stock");

    const precio50 = document.getElementById("precio-50");
    const precio100 = document.getElementById("precio-100");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                precio50.textContent = `$${data.cincuenta}`;
                precio100.textContent = `$${data.cien}`;

                sinStock.style.display = "none";
                preciosBox.style.display = "block";
            } else {
                preciosBox.style.display = "none";
                sinStock.style.display = "block";
            }
        });
    });
});
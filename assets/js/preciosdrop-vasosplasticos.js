document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "220ml": { cincuenta: "2700", cien: "3200" },
        "330ml": { cincuenta: "3200", cien: "4700" },
        "500ml": { cincuenta: "3500", cien: "6500" },
        "1000ml": { cincuenta: "100000", cien: "1240000" }
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
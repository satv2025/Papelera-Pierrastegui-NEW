document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "120ml": { veinticinco: "1500", cincuenta: "2750", cien: "4500" },
        "180ml": { veinticinco: "1800", cincuenta: "3250", cien: "5700" },
        "240ml": { veinticinco: "2000", cincuenta: "3600", cien: "6200" }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const preciosBox = document.getElementById("precios");
    const sinStock = document.getElementById("sin-stock");

    const precio25 = document.getElementById("precio-25");
    const precio50 = document.getElementById("precio-50");
    const precio100 = document.getElementById("precio-100");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const size = item.getAttribute("data-size");
            btn.textContent = item.textContent;

            const data = precios[size];

            if (data) {
                precio25.textContent = `$${data.veinticinco}`;
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
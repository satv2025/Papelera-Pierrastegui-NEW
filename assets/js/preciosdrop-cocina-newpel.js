document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "newpel": { unidad: '1.550', bulto: '11.200' }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioBulto = document.getElementById("precio-bulto");
    const precioBox = document.getElementById("uni");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const modelo = item.getAttribute("data-modelo");
            btn.textContent = item.textContent;

            const data = precios[modelo];

            if (data) {
                precioUnidad.textContent = `$${data.unidad} ARS`;
                precioBulto.textContent = `$${data.bulto} ARS`;
                precioBox.style.display = "block";
            } else {
                precioBox.style.display = "none";
            }
        });
    });
});
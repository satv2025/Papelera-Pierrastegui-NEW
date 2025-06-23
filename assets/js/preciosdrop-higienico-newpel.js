document.addEventListener("DOMContentLoaded", function () {
    const precios = {
        "premium": {
            unidad: '1500',
            bulto: '13000'
        },
        "economico": {
            unidad: '450',
            bulto: '12000'
        }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-menu li");
    const btn = document.querySelector(".dropdown-btn");

    const precioUnidad = document.getElementById("precio-unidad");
    const precioBulto = document.getElementById("precio-bulto");
    const precioUnidadText = document.getElementById("precio-unidad-text");
    const precioBultoText = document.getElementById("precio-bulto-text");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            const tipo = item.getAttribute("data-tipo");
            btn.textContent = item.textContent;

            const data = precios[tipo];
            if (data) {
                precioUnidadText.textContent = "Por unidad:";
                precioUnidad.textContent = `$${data.unidad} ARS`;

                precioBultoText.textContent = "Por bulto:";
                precioBulto.textContent = `$${data.bulto} ARS`;
            }
        });
    });
});
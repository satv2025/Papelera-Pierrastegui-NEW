document.addEventListener("DOMContentLoaded", function () {
  const precios = {
    "newpel": { unidad: "1.550", bulto: "11.200" },
    "elegante": { unidad: "1.700", bulto: "12.100" }
  };

  const dropdownItems = document.querySelectorAll(".dropdown-menu li");
  const btn = document.querySelector(".dropdown-btn");

  const precioBox = document.getElementById("uni");
  const sinStock = document.getElementById("sin-stock");

  const precioUnidad = document.getElementById("precio-unidad");
  const precioBulto = document.getElementById("precio-bulto");

  dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const modelo = item.getAttribute("data-modelo");
      btn.textContent = item.textContent;

      const data = precios[modelo];

      if (data) {
        precioUnidad.textContent = `Por Unidad: $${data.unidad}`;
        precioBulto.textContent = `Por Bulto: $${data.bulto}`;
        sinStock.style.display = "none";
        precioBox.style.display = "block";
      } else {
        precioBox.style.display = "none";
        sinStock.textContent = "Sin stock";
        sinStock.style.display = "block";
      }
    });
  });
});
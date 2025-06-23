document.addEventListener("DOMContentLoaded", function () {
  const precios = {
    "newpel": { unidad: "1.550", bulto: "11.200" },
    "elegante": { unidad: "1.700", bulto: "12.100" }
  };

  const imagenes = {
    "newpel": "https://http2.mlstatic.com/D_NQ_NP_747603-MLA80019915704_102024-O.webp",
    "elegante": "https://papelerapierrastegui.com.ar/assets/images/Fotos%20productos%20papelera%20para%20cat%C3%A1logo/PAPEL%20HIGI%C3%89NICO%20-%20ROLLO%20DE%20COCINA/rollo%20de%20cocina%20elegante.jpg"
  };

  const dropdownItems = document.querySelectorAll(".dropdown-menu li");
  const btn = document.querySelector(".dropdown-btn");

  const precioBox = document.getElementById("uni");
  const sinStock = document.getElementById("sin-stock");

  const precioUnidad = document.getElementById("precio-unidad");
  const precioBulto = document.getElementById("precio-bulto");

  const productoImg = document.getElementById("producto-img");

  dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const modelo = item.getAttribute("data-modelo");
      btn.textContent = item.textContent;

      const data = precios[modelo];
      const nuevaImagen = imagenes[modelo];

      if (nuevaImagen) {
        productoImg.src = nuevaImagen;
      }

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
document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const uniSpan = document.getElementById('uni');

    // Abrir/cerrar dropdown al hacer click en el botón
    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    // Acción al elegir una opción del dropdown
    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
            dropdownMenu.classList.remove("show");
            uniSpan.style.display = 'inline'; // Mostrar precios
        });
    });

    // Cerrar dropdown si se hace clic fuera
    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});

   // Detectar "<a href>" y redirijir

   // Mapa de URLs originales a nuevas URLs destino
const urlMap = {
  "https://www.facebook.com": "https://nueva-url-para-facebook.com",
  "https://instagram.com": "https://nueva-url-para-instagram.com",
  "https://twitter.com": "https://nueva-url-para-twitter.com",
  "https://wa.me": "https://nueva-url-para-whatsapp.com"
};

document.querySelectorAll("footer a").forEach(link => {
  for (const originalUrl in urlMap) {
    // Si el href del link empieza con alguna de las URLs originales
    if (link.href.startsWith(originalUrl)) {
      // Cambia el href a la nueva URL correspondiente
      link.href = urlMap[originalUrl];
      break; // Salimos del bucle al encontrar coincidencia
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const socialLinks = {
    Facebook: "https://facebook.com/papelerapierrastegui",
    Instagram: "https://instagram.com/pierrastegui.papelera",
    Twitter: "https://twitter.com/pierrastegui",
    WhatsApp: "http://wa.me/541123054613" // reemplazá por tu número real
  };

  const footer = document.querySelector("footer");

  if (footer) {
    const links = footer.querySelectorAll("a[aria-label]");

    links.forEach(link => {
      const label = link.getAttribute("aria-label");
      if (socialLinks[label]) {
        link.setAttribute("href", socialLinks[label]);
      }
      // Ocultar Facebook y Twitter
      if (label === "Facebook" || label === "Twitter") {
        link.style.display = "none";
      }
    });
  }

  // Corregir rutas de imágenes sociales
  const images = document.querySelectorAll('img[src^="../../../assets/images/svg/social/"]');

  images.forEach(img => {
    const fileName = img.src.split("/").pop(); // Obtener el nombre del archivo
    img.src = `https://papelerapierrastegui.com.ar/assets/images/svg/social/${fileName}`;
  });
});
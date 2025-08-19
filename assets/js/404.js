window.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // Excluir rutas específicas
    if (path === "/admin/config.yml") return;

    const title = document.getElementById("error-title");
    const description = document.getElementById("error-description");
    const reasons = document.getElementById("motivos");

    if (path.startsWith("/producto")) {
        title.textContent = "Este producto no existe o está siendo agregado";
        description.textContent =
            "El producto o subcategoría que estás buscando no se encuentra disponible.";
        reasons.innerHTML = `
      <li>El producto fue eliminado.</li>
      <li>La URL es incorrecta.</li>
      <li>Estamos en proceso de cargar este producto.</li>
      <li>La subcategoría puede haber sido modificada o borrada.</li>
    `;
    }
});
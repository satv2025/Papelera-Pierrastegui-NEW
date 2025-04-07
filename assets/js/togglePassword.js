document.addEventListener("DOMContentLoaded", function () {
    // Función para alternar visibilidad de la contraseña
    document.querySelectorAll(".toggle-password").forEach(toggle => {
        toggle.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);

            // Verificar si el evento está siendo disparado
            console.log(`Hiciste clic en el ícono de visibilidad para: ${targetId}`);

            // Alternar la visibilidad de la contraseña
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.src = "assets/images/ojoa.png"; // Cambia la imagen a ojo abierto (mostrar)
            } else {
                passwordInput.type = "password";
                this.src = "assets/images/ojoc.png"; // Cambia la imagen a ojo cerrado (ocultar)
            }
        });
    });
});
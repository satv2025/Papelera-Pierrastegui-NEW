document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const uniSpan = document.getElementById('uni');

    dropdownBtn.addEventListener("click", function () {
        const isShown = dropdownMenu.classList.toggle("show");
        dropdownBtn.classList.toggle("open", isShown); // Flecha
    });

    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
            dropdownMenu.classList.remove("show");
            dropdownBtn.classList.remove("open"); // Flecha hacia abajo
            uniSpan.style.display = 'inline';
        });
    });

    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
            dropdownBtn.classList.remove("open"); // Flecha hacia abajo
        }
    });

    // Cambiar href en footer
    const urlMap = {
        "https://www.facebook.com": "https://nueva-url-para-facebook.com",
        "https://instagram.com": "https://nueva-url-para-instagram.com",
        "https://twitter.com": "https://nueva-url-para-twitter.com",
        "https://wa.me": "https://nueva-url-para-whatsapp.com"
    };

    document.querySelectorAll("footer a").forEach(link => {
        for (const originalUrl in urlMap) {
            if (link.href.startsWith(originalUrl)) {
                link.href = urlMap[originalUrl];
                break;
            }
        }
    });
});
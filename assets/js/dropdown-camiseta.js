document.addEventListener("DOMContentLoaded", function () {
    // Código dropdown
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const sizeOptions = document.querySelectorAll(".dropdown-menu li");
    const uniSpan = document.getElementById('uni');

    dropdownBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    sizeOptions.forEach(option => {
        option.addEventListener("click", function () {
            dropdownBtn.textContent = `Tamaño: ${this.dataset.size}`;
            dropdownMenu.classList.remove("show");
            uniSpan.style.display = 'inline';
        });
    });

    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // Código para cambiar href en footer
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
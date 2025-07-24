document.addEventListener("DOMContentLoaded", function () {
    const socialLinks = {
        Facebook: "https://www.facebook.com/papelerapierrastegui",
        Instagram: "https://www.instagram.com/papelerapierrastegui",
        Twitter: "https://twitter.com/pierrastegui",
        WhatsApp: "https://wa.me/5491122334455" // reemplazá por tu número real
    };

    const footer = document.querySelector("footer");

    if (footer) {
        const links = footer.querySelectorAll("a[aria-label]");

        links.forEach(link => {
            const label = link.getAttribute("aria-label");
            if (socialLinks[label]) {
                link.setAttribute("href", socialLinks[label]);
            }
        });
    }
});
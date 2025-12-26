// burgerMenu.js
document.addEventListener("DOMContentLoaded", () => {

    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.innerHTML = `
    <div class="mobile-item" id="mobile-cart">🛒</div>
    <a class="mobile-item" href="https://www.instagram.com/pierrastegui.papelera">📸</a>
    <a class="mobile-item" href="https://wa.me/541123054613">💬</a>
    <div class="mobile-item" id="mobile-account">👤</div>
    <div class="mobile-item" id="mobile-menu-btn">☰</div>
  `;
    document.body.appendChild(bar);

    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.innerHTML = `
    <div class="mobile-menu-header">
      <span>Menú</span>
      <button id="closeMobileMenu">✕</button>
    </div>
    <div class="mobile-search">
      <input id="search-input" placeholder="Buscar productos..." />
    </div>
    <div id="mobileMenuContent"></div>
  `;
    document.body.appendChild(menu);

    document.getElementById("mobile-menu-btn").onclick = () =>
        menu.classList.add("active");

    document.getElementById("closeMobileMenu").onclick = () =>
        menu.classList.remove("active");

    // clona menú desktop
    const desktopMenu = document.querySelector(".nav-items");
    if (desktopMenu) {
        document.getElementById("mobileMenuContent").innerHTML =
            desktopMenu.innerHTML;
    }
});
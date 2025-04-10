document.addEventListener("DOMContentLoaded", () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const items = dropdownMenu.querySelectorAll('li');

    const uniDiv = document.getElementById('uni');
    const precio25Span = document.getElementById('precio-10');
    const precio50Span = document.getElementById('precio-50');
    const precio100Span = document.getElementById('precio-100');

    const monedaSpans = document.querySelectorAll('.moneda');
    const arsSpans = document.querySelectorAll('.ars');

    const precios = {
        "617": { p25: '1.500', p50: '2.500', p100: '4.500' },
        "618": { p25: '1.900', p50: '3.500', p100: '6.700' },
        "619": { p25: "Sin Stock", p50: "Sin Stock", p100: "Sin Stock" },
        "628": { p25: '4.800', p50: '9.300', p100: '18.000' }
    };

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const medida = item.getAttribute('data-size');
            const data = precios[medida];

            if (data) {
                const is25Out = data.p25 === "Sin Stock";
                const is50Out = data.p50 === "Sin Stock";
                const is100Out = data.p100 === "Sin Stock";

                precio25Span.textContent = is25Out ? "Sin Stock" : data.p25;
                precio50Span.textContent = is50Out ? "Sin Stock" : data.p50;
                precio100Span.textContent = is100Out ? "Sin Stock" : data.p100;

                monedaSpans[0].style.display = is25Out ? 'none' : 'inline';
                monedaSpans[1].style.display = is50Out ? 'none' : 'inline';
                monedaSpans[2].style.display = is100Out ? 'none' : 'inline';

                arsSpans[0].style.display = is25Out ? 'none' : 'inline';
                arsSpans[1].style.display = is50Out ? 'none' : 'inline';
                arsSpans[2].style.display = is100Out ? 'none' : 'inline';

                dropdownBtn.textContent = `Tamaño: N° ${medida}`;
                uniDiv.style.display = 'block';
            }

            dropdownMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
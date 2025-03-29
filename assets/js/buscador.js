// Función para mostrar los productos en el catálogo
function mostrarProductos(productosFiltrados) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';  // Limpiar productos existentes
    productosFiltrados.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `<p>${producto.nombre}</p>`;  // Cambia esto según tu estructura de producto
        productosContainer.appendChild(productoDiv);
    });
}

// Función para filtrar productos según el término de búsqueda
function filtrarProductos() {
    const searchTerm = document.getElementById('buscador').value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm)
    );
    mostrarProductos(productosFiltrados);
}

// Ejecutar la búsqueda al hacer clic en la lupa
document.getElementById('search-button').addEventListener('click', filtrarProductos);

// Mostrar todos los productos al cargar la página
mostrarProductos(productos);
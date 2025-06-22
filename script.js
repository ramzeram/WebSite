// Cantidad de productos por página
const productosPorPagina = 20;
let paginaActual = 1;
let productos = [];
let productosFiltrados = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Actualiza el contador que se muestra en el botón "Ver carrito"
function actualizarContador() {
  const contador = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const contadorElem = document.getElementById('contador-carrito');
  if (contadorElem) contadorElem.textContent = contador;
}

// Agrega producto al carrito validando existencias
function agregarAlCarrito(nombre, precio, existencias) {
  const prod = carrito.find(p => p.nombre === nombre);
  if (prod) {
    if (prod.cantidad < existencias) {
      prod.cantidad++;
    } else {
      alert('No puedes agregar más unidades de este producto, no hay más existencias.');
      return;
    }
  } else {
    carrito.push({ nombre, precio, cantidad: 1, existencias });
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
}

// Muestra la página de productos según paginación y filtro
function mostrarPagina(pagina) {
  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  const contenedor = document.getElementById('catalogo');
  contenedor.innerHTML = '';

  if (productosPagina.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  productosPagina.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p><strong>Precio:</strong> $${prod.precio}</p>
      <p><strong>Existencias:</strong> ${prod.existencias}</p>
      <a href="${prod.ficha_tecnica}" target="_blank">Ver ficha técnica</a>
      <button class="agregar-carrito">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);

    div.querySelector('.agregar-carrito').addEventListener('click', () => {
      agregarAlCarrito(prod.nombre, parseFloat(prod.precio), parseInt(prod.existencias));
    });
  });
}

// Crea los botones para la paginación
function crearControlesPaginacion() {
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const paginacion = document.getElementById('paginacion');
  paginacion.innerHTML = '';

  if (totalPaginas <= 1) return;

  const crearBoton = (texto, pagina) => {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.onclick = () => {
      paginaActual = pagina;
      mostrarPagina(pagina);
      crearControlesPaginacion();
    };
    if (pagina === paginaActual) btn.classList.add('activo');
    return btn;
  };

  if (paginaActual > 1)
    paginacion.appendChild(crearBoton('Anterior', paginaActual - 1));

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.appendChild(crearBoton(i, i));
  }

  if (paginaActual < totalPaginas)
    paginacion.appendChild(crearBoton('Siguiente', paginaActual + 1));
}

// Carga los productos desde el JSON y arranca la página
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    productosFiltrados = productos;
    mostrarPagina(paginaActual);
    crearControlesPaginacion();
    actualizarContador();
  });

// Filtro de productos por texto de búsqueda
document.getElementById('buscador').addEventListener('input', e => {
  const texto = e.target.value.toLowerCase();
  productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
  paginaActual = 1;
  mostrarPagina(paginaActual);
  crearControlesPaginacion();
});

// Botón para ver carrito redirige a carrito.html
const btnVerCarrito = document.getElementById('btnVerCarrito');
if (btnVerCarrito) {
  btnVerCarrito.addEventListener('click', () => {
    window.location.href = 'carrito.html';
  });
}

const productosPorPagina = 20;
let paginaActual = 1;
let productos = [];
let productosFiltrados = [];

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    productosFiltrados = productos;
    mostrarPagina(paginaActual);
    crearControlesPaginacion();
  });

document.getElementById('buscador').addEventListener('input', e => {
  const texto = e.target.value.toLowerCase();
  productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );
  paginaActual = 1;
  mostrarPagina(paginaActual);
  crearControlesPaginacion();
});

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
    `;
    contenedor.appendChild(div);
  });
}

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

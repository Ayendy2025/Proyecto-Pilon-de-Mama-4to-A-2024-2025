// Obtener elementos
const tabla = document.getElementById("tabla-productos");
const modal = document.getElementById("formulario-modal");
const form = document.getElementById("formulario-producto");
const tituloForm = document.getElementById("form-titulo");
const indiceEditar = document.getElementById("indice-editar");

const inputNombre = document.getElementById("nombre");
const inputCategoria = document.getElementById("categoria");
const inputCantidad = document.getElementById("cantidad");
const inputProveedor = document.getElementById("proveedor");

// Cargar datos al iniciar
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Mostrar productos en la tabla y reinicializar DataTable
function mostrarProductos() {
  // Guarda la página actual si DataTable ya está inicializado
  let paginaActual = 0;
  if ($.fn.DataTable.isDataTable('#mitabla')) {
    paginaActual = $('#mitabla').DataTable().page();
    $('#mitabla').DataTable().clear().destroy();
  }

  tabla.innerHTML = "";
  productos.forEach((prod, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>${prod.cantidad}</td>
      <td>${prod.proveedor}</td>
      <td class="acciones">
        <button onclick="editarProducto(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="eliminarProducto(${index})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Reinicializar DataTable
  let table = $('#mitabla').DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
    },
    columnDefs: [
      { orderable: false, targets: -1 }
    ],
    order: []
  });

  // Volver a la página anterior si aplica
  table.page(paginaActual).draw('page');
}

// Abrir formulario
function abrirFormulario() {
  form.reset();
  tituloForm.textContent = "Nuevo Producto";
  indiceEditar.value = "";
  modal.style.display = "flex";
}

// Cerrar formulario
function cerrarFormulario() {
  modal.style.display = "none";
}

// Guardar producto (crear o editar)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoProducto = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value.trim(),
    cantidad: parseInt(inputCantidad.value),
    proveedor: inputProveedor.value.trim()
  };

  const indice = indiceEditar.value;

  if (indice === "") {
    productos.push(nuevoProducto); // Crear
  } else {
    productos[indice] = nuevoProducto; // Editar
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos();
  cerrarFormulario();
  mostrarNotificacion("✅ Producto guardado con éxito", "#74A60A", "Sonido/Guardado.mp3");
});

// Editar producto
function editarProducto(index) {
  const producto = productos[index];
  inputNombre.value = producto.nombre;
  inputCategoria.value = producto.categoria;
  inputCantidad.value = producto.cantidad;
  inputProveedor.value = producto.proveedor;
  indiceEditar.value = index;

  tituloForm.textContent = "Editar Producto";
  modal.style.display = "flex";
}

// Eliminar producto con confirmación personalizada
let indiceEliminar = null;

function eliminarProducto(index) {
  indiceEliminar = index;
  document.getElementById("confirm-modal").style.display = "flex";
}

function cerrarConfirmacion() {
  document.getElementById("confirm-modal").style.display = "none";
  indiceEliminar = null;
}

function confirmarEliminacion() {
  if (indiceEliminar !== null) {
    productos.splice(indiceEliminar, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
    mostrarNotificacion("🗑 Producto eliminado", "#F24405", "Sonido/Eliminado.mp3");
  }
  cerrarConfirmacion();
}

// Notificación
function mostrarNotificacion(mensaje, color = "#FF6000", sonidoURL = null) {
  const noti = document.getElementById("notificacion");
  noti.textContent = mensaje;
  noti.style.backgroundColor = color;
  noti.classList.add("mostrar");

  if (sonidoURL) {
    const audio = new Audio(sonidoURL);
    audio.play();
  }

  setTimeout(() => {
    noti.classList.remove("mostrar");
  }, 3000);
}

// Animación de salida
function salirDelModulo() {
  const contenedor = document.querySelector(".container");
  contenedor.classList.add("salida");
  setTimeout(() => {
    location.href = "index.html";
  }, 550);
}

// Restablecer tabla (adaptado a DataTables)
function restablecerOrden() {
  productos = JSON.parse(localStorage.getItem("productos")) || [];
  mostrarProductos();

  // Reiniciar el ícono de orden si existe
  const icono = document.getElementById("iconoOrden");
  if (icono) {
    icono.classList.remove("fa-sort-up", "fa-sort-down");
    icono.classList.add("fa-sort");
  }
}

// Inicialización de DataTable y control de orden triple
$(document).ready(function() {
  mostrarProductos();

  // Guarda el orden original de los datos
  let productosOriginal = JSON.parse(localStorage.getItem("productos")) || [];

  // Controla los clics en los encabezados
  let clickCount = {};
  $('#mitabla thead').on('click', 'th', function() {
    var colIdx = $(this).index();
    clickCount[colIdx] = (clickCount[colIdx] || 0) + 1;

    if (clickCount[colIdx] === 3) {
      // Guarda el primer elemento visible y la página actual
      var table = $('#mitabla').DataTable();
      var primerElemento = table.row(':eq(0)', { page: 'current' }).data();
      var paginaActual = table.page();

      // 1. Destruye DataTable
      table.clear().destroy();
      // 2. Repinta la tabla con los datos originales
      productos = [...productosOriginal];
      mostrarProductos();
      // 3. Vuelve a inicializar DataTable (ya lo hace mostrarProductos)

      // 4. Busca en qué página está el primer elemento visible anterior
      table = $('#mitabla').DataTable();
      if (primerElemento) {
        table.rows().every(function(rowIdx, tableLoop, rowLoop) {
          if (JSON.stringify(this.data()) === JSON.stringify(primerElemento)) {
            var nuevaPagina = Math.floor(rowIdx / table.page.len());
            table.page(nuevaPagina).draw('page');
          }
        });
      } else {
        table.page(paginaActual).draw('page');
      }

      clickCount[colIdx] = 0;
    } else {
      // Solo reinicia los contadores de las otras columnas
      for (let key in clickCount) {
        if (parseInt(key) !== colIdx) clickCount[key] = 0;
      }
    }
  });
});


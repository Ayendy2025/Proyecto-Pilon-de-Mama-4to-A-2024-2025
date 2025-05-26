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

// Cargar productos al iniciar
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Generador de ID
function generarID() {
  let ultimoID = parseInt(localStorage.getItem("ultimoID")) || 0;
  ultimoID++;
  localStorage.setItem("ultimoID", ultimoID);
  return ultimoID;
}

// Mostrar productos en la tabla
function mostrarProductos() {
  let paginaActual = 0;
  if ($.fn.DataTable.isDataTable('#mitabla')) {
    paginaActual = $('#mitabla').DataTable().page();
    $('#mitabla').DataTable().clear().destroy();
  }

  tabla.innerHTML = "";
  productos.forEach((prod, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.id || "-"}</td>
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

  const table = $('#mitabla').DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
    },
    columnDefs: [{ orderable: false, targets: -1 }],
    order: [],
    stateSave: false
  });

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

// Guardar producto
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const indice = indiceEditar.value;

  let nuevoProducto = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value.trim(),
    cantidad: parseInt(inputCantidad.value),
    proveedor: inputProveedor.value.trim()
  };

  if (indice === "") {
    nuevoProducto.id = generarID(); // SOLO cuando se crea
    productos.push(nuevoProducto);
  } else {
    nuevoProducto.id = productos[indice].id; // Mantener ID al editar
    productos[indice] = nuevoProducto;
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
    let productosEliminados = JSON.parse(localStorage.getItem("productosEliminados")) || [];
    productosEliminados.push(productos[indiceEliminar]);
    localStorage.setItem("productosEliminados", JSON.stringify(productosEliminados));

    productos.splice(indiceEliminar, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
    mostrarNotificacion("🗑 Producto archivado en eliminados", "#F24405", "Sonido/Eliminado.mp3");
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

// Salida animada
function salirDelModulo() {
  const contenedor = document.querySelector(".container");
  contenedor.classList.add("salida");
  setTimeout(() => {
    location.href = "index.html";
  }, 550);
}

// Inicializar
$(document).ready(function () {
  mostrarProductos();
});

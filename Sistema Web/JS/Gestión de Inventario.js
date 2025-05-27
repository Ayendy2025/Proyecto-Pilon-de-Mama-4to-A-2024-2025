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

// Array para almacenar productos en memoria
let productos = [];

// URL base de los archivos PHP
const URL_BASE = 'PHP/';

// Función para hacer peticiones AJAX
async function hacerPeticion(url, metodo = 'GET', datos = null) {
  try {
    const opciones = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (datos && metodo !== 'GET') {
      opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(url, opciones);
    const resultado = await respuesta.json();

    if (!resultado.exito) {
      throw new Error(resultado.mensaje || 'Error en la petición');
    }

    return resultado;
  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
}

// Cargar productos desde la base de datos
async function cargarProductos() {
  try {
    const resultado = await hacerPeticion(URL_BASE + 'obtener_productos.php');
    productos = resultado.datos || [];
    mostrarProductos();
  } catch (error) {
    mostrarNotificacion("❌ Error al cargar productos: " + error.message, "#F24405");
    console.error('Error cargando productos:', error);
  }
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
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const indice = indiceEditar.value;
  
  // Preparar datos del producto
  let datosProducto = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value.trim(),
    cantidad: parseInt(inputCantidad.value),
    proveedor: inputProveedor.value.trim()
  };

  // Si estamos editando, agregar el ID
  if (indice !== "") {
    datosProducto.id = productos[indice].id;
  }

  try {
    // Enviar datos al servidor
    const resultado = await hacerPeticion(
      URL_BASE + 'guardar_producto.php', 
      'POST', 
      datosProducto
    );

    // Recargar productos desde la base de datos
    await cargarProductos();
    
    cerrarFormulario();
    
    const mensaje = indice === "" ? "✅ Producto agregado con éxito" : "✅ Producto actualizado con éxito";
    mostrarNotificacion(mensaje, "#74A60A", "Sonido/Guardado.mp3");

  } catch (error) {
    mostrarNotificacion("❌ Error al guardar: " + error.message, "#F24405");
    console.error('Error guardando producto:', error);
  }
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

async function confirmarEliminacion() {
  if (indiceEliminar !== null) {
    try {
      const producto = productos[indiceEliminar];
      
      // Enviar petición de eliminación al servidor
      await hacerPeticion(
        URL_BASE + 'eliminar_producto.php', 
        'POST', 
        { id: producto.id }
      );

      // Recargar productos desde la base de datos
      await cargarProductos();
      
      mostrarNotificacion("🗑 Producto archivado en eliminados", "#F24405", "Sonido/Eliminado.mp3");
      
    } catch (error) {
      mostrarNotificacion("❌ Error al eliminar: " + error.message, "#F24405");
      console.error('Error eliminando producto:', error);
    }
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
    audio.play().catch(e => console.log('No se pudo reproducir el sonido:', e));
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

// Función para recargar productos (botón recargar)
async function recargarProductos() {
  try {
    await cargarProductos();
    mostrarNotificacion("🔄 Productos recargados", "#74A60A");
  } catch (error) {
    mostrarNotificacion("❌ Error al recargar productos", "#F24405");
  }
}

// Inicializar - Cargar productos al abrir la página
$(document).ready(function () {
  cargarProductos();
});
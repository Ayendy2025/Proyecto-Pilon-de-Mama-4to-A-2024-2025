// Obtener elementos
const tbodyEliminados = document.getElementById("tbodyEliminados");

// Array para almacenar productos eliminados en memoria
let productosEliminados = [];

// URL base de los archivos PHP
const URL_BASE = 'PHP/';

// Variables para confirmaciones
let indiceEliminarDef = null;

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

// Cargar productos eliminados desde la base de datos
async function cargarProductosEliminados() {
  try {
    const resultado = await hacerPeticion(URL_BASE + 'obtener_productos_eliminados.php');
    productosEliminados = resultado.datos || [];
    mostrarEliminados();
  } catch (error) {
    mostrarNotificacion("❌ Error al cargar productos eliminados: " + error.message, "#F24405");
    console.error('Error cargando productos eliminados:', error);
  }
}

// Mostrar productos eliminados en la tabla
function mostrarEliminados() {
  let paginaActual = 0;
  if ($.fn.DataTable.isDataTable('#tablaEliminados')) {
    paginaActual = $('#tablaEliminados').DataTable().page();
    $('#tablaEliminados').DataTable().clear().destroy();
  }

  tbodyEliminados.innerHTML = "";
  productosEliminados.forEach((prod, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.producto_id_original || prod.id || '-'}</td>
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>${prod.cantidad}</td>
      <td>${prod.proveedor}</td>
      <td class="acciones">
        <button title="Restaurar" onclick="restaurarProducto(${index})"><i class="fas fa-undo"></i></button>
        <button title="Eliminar definitivamente" onclick="eliminarDefinitivo(${index})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbodyEliminados.appendChild(fila);
  });

  const table = $('#tablaEliminados').DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
    },
    columnDefs: [
      { orderable: false, targets: -1 }
    ],
    order: [],
    stateSave: false
  });

  table.page(paginaActual).draw('page');
}

// Restaurar producto eliminado
async function restaurarProducto(index) {
  try {
    const producto = productosEliminados[index];
    
    // Enviar petición de restauración al servidor
    await hacerPeticion(
      URL_BASE + 'restaurar_producto.php', 
      'POST', 
      { id: producto.id }
    );

    // Recargar productos eliminados desde la base de datos
    await cargarProductosEliminados();
    
    mostrarNotificacion("✅ Producto restaurado correctamente", "#74A60A", "Sonido/Guardado.mp3");
    
  } catch (error) {
    mostrarNotificacion("❌ Error al restaurar: " + error.message, "#F24405");
    console.error('Error restaurando producto:', error);
  }
}

// Mostrar modal de confirmación para eliminar definitivamente
function eliminarDefinitivo(index) {
  indiceEliminarDef = index;
  document.getElementById("confirm-modal-eliminar").style.display = "flex";
}

// Cerrar modal de confirmación
function cerrarConfirmacionEliminar() {
  document.getElementById("confirm-modal-eliminar").style.display = "none";
  indiceEliminarDef = null;
}

// Confirmar eliminación definitiva
async function confirmarEliminacionDefinitiva() {
  if (indiceEliminarDef !== null) {
    try {
      const producto = productosEliminados[indiceEliminarDef];
      
      // Enviar petición de eliminación definitiva al servidor
      await hacerPeticion(
        URL_BASE + 'eliminar_definitivo.php', 
        'POST', 
        { id: producto.id }
      );

      // Recargar productos eliminados desde la base de datos
      await cargarProductosEliminados();
      
      mostrarNotificacion("🗑 Producto eliminado permanentemente", "#F24405", "Sonido/Eliminado.mp3");
      
    } catch (error) {
      mostrarNotificacion("❌ Error al eliminar definitivamente: " + error.message, "#F24405");
      console.error('Error eliminando definitivamente:', error);
    }
  }
  cerrarConfirmacionEliminar();
}

// Notificación visual
function mostrarNotificacion(mensaje, color = "#FF6000", sonidoURL = null) {
  let noti = document.getElementById("notificacion");
  if (!noti) {
    noti = document.createElement("div");
    noti.id = "notificacion";
    noti.className = "notificacion";
    document.body.appendChild(noti);
  }
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

// Función para recargar productos eliminados (botón recargar)
async function recargarProductosEliminados() {
  try {
    await cargarProductosEliminados();
    mostrarNotificacion("🔄 Productos eliminados recargados", "#74A60A");
  } catch (error) {
    mostrarNotificacion("❌ Error al recargar productos eliminados", "#F24405");
  }
}

// Inicializar - Cargar productos eliminados al abrir la página
$(document).ready(function () {
  cargarProductosEliminados();
});
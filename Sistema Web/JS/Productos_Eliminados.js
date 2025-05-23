// Obtener elementos
const tbodyEliminados = document.getElementById("tbodyEliminados");

// Cargar productos eliminados desde localStorage
let productosEliminados = JSON.parse(localStorage.getItem("productosEliminados")) || [];

// Variable para saber qué índice eliminar
let indiceEliminarDef = null;

// Mostrar productos eliminados en la tabla
function mostrarEliminados() {
  if ($.fn.DataTable.isDataTable('#tablaEliminados')) {
    $('#tablaEliminados').DataTable().clear().destroy();
  }

  tbodyEliminados.innerHTML = "";
  productosEliminados.forEach((prod, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
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

  $('#tablaEliminados').DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
    },
    columnDefs: [
      { orderable: false, targets: -1 }
    ],
    order: []
  });
}

// Restaurar producto eliminado
function restaurarProducto(index) {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  productos.push(productosEliminados[index]);
  localStorage.setItem("productos", JSON.stringify(productos));
  productosEliminados.splice(index, 1);
  localStorage.setItem("productosEliminados", JSON.stringify(productosEliminados));
  mostrarEliminados();
  mostrarNotificacion("Producto restaurado", "#74A60A");
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
function confirmarEliminacionDefinitiva() {
  if (indiceEliminarDef !== null) {
    productosEliminados.splice(indiceEliminarDef, 1);
    localStorage.setItem("productosEliminados", JSON.stringify(productosEliminados));
    mostrarEliminados();
    mostrarNotificacion("Producto eliminado permanentemente", "#F24405");
  }
  cerrarConfirmacionEliminar();
}

// Notificación visual
function mostrarNotificacion(mensaje, color = "#FF6000") {
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
  setTimeout(() => {
    noti.classList.remove("mostrar");
  }, 2500);
}

// Inicializar tabla al cargar
document.addEventListener("DOMContentLoaded", mostrarEliminados);
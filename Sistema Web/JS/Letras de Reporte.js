// Cargar los productos al iniciar
$(document).ready(function () {
  fetch("PHP/obtener_productos.php")
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        $('#tabla-reportes').DataTable({
          data: data.datos,
          columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'categoria' },
            { data: 'cantidad' },
            { data: 'proveedor' },
            { data: 'fecha_creacion' },
            { data: 'fecha_actualizacion' }
          ],
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'excelHtml5',
              text: '<i class="fas fa-file-excel"></i> Excel',
              className: 'add-btn'
            },
            {
              extend: 'pdfHtml5',
              text: '<i class="fas fa-file-pdf"></i> PDF',
              className: 'eliminados-btn',
              orientation: 'landscape',
              pageSize: 'A4'
            },
            {
              extend: 'print',
              text: '<i class="fas fa-print"></i> Imprimir',
              className: 'recargar-btn'
            }
          ],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
          }
        });
      } else {
        alert("❌ Error: " + data.mensaje);
      }
    })
    .catch(error => {
      console.error("Error al obtener datos:", error);
      alert("❌ No se pudo conectar al servidor.");
    });
});

// Volver al menú
function salirDelModulo() {
  const contenedor = document.querySelector(".container");
  contenedor.classList.add("salida");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 550);
}

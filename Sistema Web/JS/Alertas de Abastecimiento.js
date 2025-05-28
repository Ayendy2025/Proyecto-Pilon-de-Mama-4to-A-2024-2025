// Cargar alertas al iniciar
$(document).ready(function () {
  fetch("PHP/obtener_alertas.php")
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        const tbody = document.getElementById("cuerpo-alertas");

        data.datos.forEach(producto => {
          const fila = document.createElement("tr");

          // Aplica clase según cantidad
            if (producto.cantidad <= 5) {
            fila.classList.add("fila-roja");
          } else if (producto.cantidad < 10) {
            fila.classList.add("fila-amarilla");
          }

          fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.proveedor}</td>
          `;

          tbody.appendChild(fila);
        });

        // Activar DataTable
        $('#tabla-alertas').DataTable({
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
          },
          paging: false,
          info: false
        });

      } else {
        alert("⚠️ No se pudieron cargar las alertas.");
      }
    })
    .catch(error => {
      console.error("Error al obtener alertas:", error);
      alert("❌ Error al conectar con el servidor.");
    });
});

// Volver al menú principal
function salirDelModulo() {
  const contenedor = document.querySelector(".container");
  contenedor.classList.add("salida");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 550);
}

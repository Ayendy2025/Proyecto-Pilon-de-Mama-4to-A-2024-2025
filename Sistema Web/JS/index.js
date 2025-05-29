// Función para abrir el manual
function abrirManual() {
  window.open('https://docs.google.com/document/d/TU_ID_DEL_DOCUMENTO/edit?usp=sharing', '_blank');
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm('¿Está seguro de que desea cerrar sesión?')) {
    alert('Sesión cerrada exitosamente');
    window.location.href = 'login 2.html';
  }
}

// Actualizar estadísticas reales desde PHP
function actualizarEstadisticas() {
  fetch('PHP/dashboard_estadisticas.php')
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        document.getElementById('totalProducts').textContent = data.totalProductos;
        document.getElementById('lowStock').textContent = data.stockBajo;
      } else {
        console.error('⚠️ Error desde PHP:', data.mensaje);
      }
    })
    .catch(err => {
      console.error('❌ Error de red:', err);
    });
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';
  const nombreElemento = document.getElementById('nombreUsuario');
  if (nombreElemento) {
    nombreElemento.textContent = nombreUsuario;
  }

  actualizarEstadisticas();
});

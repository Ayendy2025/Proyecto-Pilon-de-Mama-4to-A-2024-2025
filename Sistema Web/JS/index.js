// Función para abrir el manual
function abrirManual() {
  window.open('https://sites.google.com/view/manual-sistema-pilonde-mama/inicio?authuser=0');
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm('¿Está seguro de que desea cerrar sesión?')) {
    // Limpiar datos del usuario en localStorage
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('nombreUsuario');

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
        animarContador('totalProducts', data.totalProductos);
        animarContador('lowStock', data.stockBajo);
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
  // Obtener nombre del usuario desde localStorage
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';
  const nombreElemento = document.getElementById('nombreUsuario');
  if (nombreElemento) {
    nombreElemento.textContent = nombreUsuario;
  }

  actualizarEstadisticas();
});

// Animación de números (contador)
function animarContador(idElemento, valorFinal, duracion = 1000) {
  const elemento = document.getElementById(idElemento);
  let inicio = 0;
  const incremento = valorFinal / (duracion / 16); // ~60fps
  const intervalo = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      elemento.textContent = valorFinal;
      clearInterval(intervalo);
    } else {
      elemento.textContent = Math.floor(inicio);
    }
  }, 16);
}

 // URL del Manual de Usuario (Google Docs)
    const MANUAL_URL = 'https://docs.google.com/document/d/TU_ID_DEL_DOCUMENTO/edit?usp=sharing';
    
    // Función para abrir el manual de usuario
    function abrirManual() {
      // Opción 1: Abrir en nueva pestaña
      window.open(MANUAL_URL, '_blank');
      
      // Opción 2: Si prefieres abrir en la misma ventana, usa:
      // window.location.href = MANUAL_URL;
    }

    // Función para cerrar sesión (mantenida del JS original)
    function cerrarSesion() {
      if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        // Aquí iría la lógica para cerrar sesión
        alert('Sesión cerrada exitosamente');
        // window.location.href = 'login.html';
      }
    }

    // Simular datos dinámicos
    document.addEventListener('DOMContentLoaded', function() {
      // Obtener nombre de usuario (puedes cambiarlo por datos reales)
      const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';
      document.getElementById('nombreUsuario').textContent = nombreUsuario;
      
      // Simular actualización de estadísticas (conectar con tu base de datos)
      setTimeout(() => {
        // Aquí podrías hacer llamadas AJAX para obtener datos reales
        console.log('Dashboard cargado correctamente');
      }, 1000);
    });

    // Función para actualizar estadísticas (conectar con tu backend)
    function actualizarEstadisticas() {
      // Ejemplo de como podrías actualizar las estadísticas
      // fetch('/api/estadisticas')
      //   .then(response => response.json())
      //   .then(data => {
      //     document.getElementById('totalProducts').textContent = data.totalProducts;
      //     document.getElementById('lowStock').textContent = data.lowStock;
      //   });
    }
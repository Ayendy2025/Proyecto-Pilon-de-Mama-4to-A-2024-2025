// Verificar si el usuario inició sesión
window.onload = () => {
  const usuario = localStorage.getItem("usuarioActivo");

  if (!usuario) {
    window.location.href = "login 2.html";
  } else {
    document.getElementById("nombreUsuario").textContent = usuario;

    // Activar animación de entrada
    const contenido = document.querySelector(".main-content");
    contenido.classList.add("aparecer");
  }
};

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login 2.html";
}

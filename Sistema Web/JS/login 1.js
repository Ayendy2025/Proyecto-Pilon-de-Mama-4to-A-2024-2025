// Mostrar / Ocultar contraseña con ícono
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const passwordIcon = document.getElementById("password-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordIcon.classList.remove("fa-eye-slash");
    passwordIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    passwordIcon.classList.remove("fa-eye");
    passwordIcon.classList.add("fa-eye-slash");
  }
}

// Crear espacio para errores
const usernameError = document.createElement("span");
const emailError = document.createElement("span");

[usernameError, emailError].forEach(el => {
  el.style.color = "red";
  el.style.fontSize = "0.9em";
});

document.getElementById("username").parentElement.appendChild(usernameError);
document.getElementById("email").parentElement.appendChild(emailError);

// Pista de contraseña
const passwordInput = document.getElementById("password");
const passwordHint = document.createElement("div");
passwordHint.classList.add("password-hint"); // Añadimos clase para control CSS
passwordInput.parentElement.appendChild(passwordHint);

passwordInput.addEventListener("input", () => {
  const len = passwordInput.value.length;
  if (len < 8) {
    passwordHint.textContent = `Mínimo 8 caracteres (${8 - len} más)`;
    passwordHint.style.color = "red";  // Texto rojo para error
  } else {
    passwordHint.textContent = "¡Buena contraseña!";
    passwordHint.style.color = "#888";  // Texto gris normal
  }
});

// Función para registrar al usuario
function registrarUsuario(event) {
  event.preventDefault(); // Evita envío real

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Limpiar errores
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordHint.textContent = "";  // Limpiar mensaje pista contraseña
  passwordHint.style.color = "#888"; // color normal

  let valid = true;

  // Validaciones básicas
  if (!username) {
    usernameError.textContent = "El nombre de usuario es obligatorio";
    valid = false;
  }

  if (!email || !email.includes("@")) {
    emailError.textContent = "Ingresa un correo válido";
    valid = false;
  }

  if (password.length < 8) {
    passwordHint.textContent = "La contraseña debe tener al menos 8 caracteres";
    passwordHint.style.color = "red";
    valid = false;
  }

  if (!valid) return;

  // Revisar si ya existe
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const yaExiste = usuarios.some(user => user.username === username);

  if (yaExiste) {
    usernameError.textContent = "Este usuario ya está registrado";
    return;
  }

  // Guardar usuario
  usuarios.push({ username, email, password });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Botón en modo "procesando"
  const button = document.querySelector(".login-button");
  button.textContent = "Procesando...";
  button.disabled = true;

  setTimeout(() => {
    // Redirigir al login
    window.location.href = "login 2.html";
  }, 500);
}

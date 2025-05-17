// Mostrar / Ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordInput.type === "password") {
    // Mostrar contraseña
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  } else {
    // Ocultar contraseña
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  }
}

// Ejecutar cuando la página carga
window.onload = function () {
  // Recuperar nombre guardado
  const savedUsername = localStorage.getItem("savedUsername");
  if (savedUsername) {
    document.getElementById("username").value = savedUsername;
  }
};

// Crear mensajes de error
const usernameError = document.createElement("div");
const passwordError = document.createElement("div");
[usernameError, passwordError].forEach(el => {
  el.style.color = "red";
  el.style.fontSize = ".90em";
  el.style.marginTop = "5px";
});

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

document.getElementById("username-error-container").appendChild(usernameError);
document.getElementById("password-error-container").appendChild(passwordError);

// Función de login con validación real
function login(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const loginBtn = document.getElementById("loginBtn");

  // Reset de errores
  usernameError.textContent = "";
  passwordError.textContent = "";

  let isValid = true;

  // Validaciones básicas
  if (!username) {
    usernameError.textContent = "El usuario es obligatorio";
    isValid = false;
  }

  if (!password) {
    passwordError.textContent = "La contraseña es obligatoria";
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Debe tener al menos 8 caracteres";
    isValid = false;
  }

  if (!isValid) return;

  // Obtener usuarios registrados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar credenciales
  const encontrado = usuarios.find(user => user.username === username && user.password === password);

  if (!encontrado) {
    passwordError.textContent = "Usuario o contraseña incorrectos";
    return;
  }

  // Guardar sesión
  localStorage.setItem("usuarioActivo", username);
  localStorage.setItem("savedUsername", username); // para rellenar automático después

  // Mostrar "Procesando..."
  loginBtn.disabled = true;
  loginBtn.innerText = "Procesando...";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
}

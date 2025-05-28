// Mostrar / Ocultar contraseña
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

// Validaciones visuales
const usernameError = document.createElement("div");
const emailError = document.createElement("div");

// Configurar elementos de error
[usernameError, emailError].forEach(el => {
  el.className = "error-message";
  el.style.display = "none";
  el.innerHTML = '<i class="fas fa-exclamation-circle"></i><span></span>';
});

// Agregar elementos al DOM
document.getElementById("username").closest('.form-group').appendChild(usernameError);
document.getElementById("email").closest('.form-group').appendChild(emailError);

const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");

// Funciones para mostrar/ocultar errores
function showError(errorElement, message) {
  errorElement.querySelector('span').textContent = message;
  errorElement.style.display = 'flex';
}

function hideError(errorElement) {
  errorElement.style.display = 'none';
}

// Validación en tiempo real de contraseña
passwordInput.addEventListener("input", () => {
  const len = passwordInput.value.length;
  
  if (len === 0) {
    passwordHint.textContent = "";
    passwordHint.className = "password-hint";
  } else if (len < 8) {
    passwordHint.textContent = `Mínimo 8 caracteres (faltan ${8 - len})`;
    passwordHint.className = "password-hint error";
  } else {
    passwordHint.textContent = "✓ Contraseña válida";
    passwordHint.className = "password-hint success";
  }
});

// Validación en tiempo real para campos
document.getElementById('username').addEventListener('blur', function() {
  const username = this.value.trim();
  if (!username) {
    showError(usernameError, 'El nombre de usuario es obligatorio');
  } else {
    hideError(usernameError);
  }
});

document.getElementById('email').addEventListener('blur', function() {
  const email = this.value.trim();
  if (email && !email.includes('@')) {
    showError(emailError, 'Ingresa un correo electrónico válido');
  } else {
    hideError(emailError);
  }
});

// Registro con PHP
function registrarUsuario(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const button = document.querySelector(".login-button");
  const buttonText = button.querySelector(".button-text");
  const buttonSpinner = button.querySelector(".button-spinner");

  // Limpiar errores previos
  hideError(usernameError);
  hideError(emailError);
  passwordHint.textContent = "";
  passwordHint.className = "password-hint";

  let valid = true;

  // Validaciones
  if (!username) {
    showError(usernameError, "El nombre de usuario es obligatorio");
    valid = false;
  }

  if (!email || !email.includes("@")) {
    showError(emailError, "Ingresa un correo electrónico válido");
    valid = false;
  }

  if (password.length < 8) {
    passwordHint.textContent = "La contraseña debe tener al menos 8 caracteres";
    passwordHint.className = "password-hint error";
    valid = false;
  }

  if (!valid) return;

  // Cambiar estado del botón
  buttonText.textContent = "Procesando...";
  buttonSpinner.style.display = "inline-block";
  button.disabled = true;

  fetch("PHP/registrar_usuario.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        buttonText.textContent = "¡Cuenta creada!";
        buttonSpinner.style.display = "none";
        
        setTimeout(() => {
          alert("✅ " + data.mensaje);
          window.location.href = "login 2.html";
        }, 500);
      } else {
        alert("❌ " + data.mensaje);
        resetButton();
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("❌ Error de conexión con el servidor.");
      resetButton();
    });

  function resetButton() {
    buttonText.textContent = "Crear cuenta";
    buttonSpinner.style.display = "none";
    button.disabled = false;
  }
}

// Efectos adicionales para mejorar la experiencia
document.querySelectorAll('input').forEach(input => {
  // Efecto de enfoque suave
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
});

// Animación de entrada para la tarjeta
document.addEventListener('DOMContentLoaded', function() {
  const card = document.querySelector('.login-card');
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    card.style.transition = 'all 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 100);
});
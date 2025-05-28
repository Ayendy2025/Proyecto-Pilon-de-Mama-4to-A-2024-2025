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
const usernameError = document.createElement("span");
const emailError = document.createElement("span");
[usernameError, emailError].forEach(el => {
  el.style.color = "red";
  el.style.fontSize = "0.9em";
});

document.getElementById("username").parentElement.appendChild(usernameError);
document.getElementById("email").parentElement.appendChild(emailError);

const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");

passwordInput.addEventListener("input", () => {
  const len = passwordInput.value.length;
  if (len < 8) {
    passwordHint.textContent = `Mínimo 8 caracteres (${8 - len} más)`;
    passwordHint.style.color = "red";
  } else {
    passwordHint.textContent = "¡Buena contraseña!";
    passwordHint.style.color = "#888";
  }
});

// Registro con PHP
function registrarUsuario(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const button = document.querySelector(".login-button");

  usernameError.textContent = "";
  emailError.textContent = "";
  passwordHint.textContent = "";
  passwordHint.style.color = "#888";

  let valid = true;

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

  button.textContent = "Procesando...";
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
        alert("✅ " + data.mensaje);
        window.location.href = "login 2.html";
      } else {
        alert("❌ " + data.mensaje);
        button.textContent = "Crear cuenta";
        button.disabled = false;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("❌ Error de conexión con el servidor.");
      button.textContent = "Crear cuenta";
      button.disabled = false;
    });
}

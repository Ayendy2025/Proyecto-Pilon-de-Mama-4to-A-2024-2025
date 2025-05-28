// Mostrar / Ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  }
}

// Elementos
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const usernameError = document.createElement("div");
const passwordError = document.createElement("div");

[usernameError, passwordError].forEach(el => {
  el.style.color = "red";
  el.style.fontSize = ".90em";
  el.style.marginTop = "5px";
});

document.getElementById("username-error-container").appendChild(usernameError);
document.getElementById("password-error-container").appendChild(passwordError);

// Función de login
function login(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  usernameError.textContent = "";
  passwordError.textContent = "";
  let isValid = true;

  if (!username) {
    usernameError.textContent = "El usuario o correo es obligatorio";
    isValid = false;
  }

  if (!password) {
    passwordError.textContent = "La contraseña es obligatoria";
    isValid = false;
  }

  if (!isValid) return;

  loginBtn.disabled = true;
  loginBtn.innerText = "Procesando...";

  // Enviar al servidor
  fetch("PHP/iniciar_sesion.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario: username, clave: password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exito) {
        localStorage.setItem("usuarioActivo", data.usuario);
        window.location.href = "index.html";
      } else {
        passwordError.textContent = data.mensaje;
        loginBtn.disabled = false;
        loginBtn.innerText = "Iniciar sesión";
      }
    })
    .catch(err => {
      console.error("Error de conexión", err);
      passwordError.textContent = "Error de conexión con el servidor.";
      loginBtn.disabled = false;
      loginBtn.innerText = "Iniciar sesión";
    });
}

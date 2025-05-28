function registrarUsuario(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const button = document.querySelector(".login-button"); // ← AQUÍ LA CLAVE

  // Limpiar errores
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

  fetch("registrar_usuario.php", {
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

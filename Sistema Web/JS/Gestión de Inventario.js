// Obtener elementos
const tabla = document.getElementById("tabla-productos");
const modal = document.getElementById("formulario-modal");
const form = document.getElementById("formulario-producto");
const tituloForm = document.getElementById("form-titulo");
const indiceEditar = document.getElementById("indice-editar");

const inputNombre = document.getElementById("nombre");
const inputCategoria = document.getElementById("categoria");
const inputCantidad = document.getElementById("cantidad");
const inputProveedor = document.getElementById("proveedor");

// Cargar datos al iniciar
let productos = JSON.parse(localStorage.getItem("productos")) || [];
mostrarProductos();

// Mostrar productos en la tabla
function mostrarProductos() {
  tabla.innerHTML = "";
  productos.forEach((prod, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>${prod.cantidad}</td>
      <td>${prod.proveedor}</td>
      <td>
        <button onclick="editarProducto(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="eliminarProducto(${index})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Abrir formulario
function abrirFormulario() {
  form.reset();
  tituloForm.textContent = "Nuevo Producto";
  indiceEditar.value = "";
  modal.style.display = "flex";
}

// Cerrar formulario
function cerrarFormulario() {
  modal.style.display = "none";
}

// Guardar producto (crear o editar)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoProducto = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value.trim(),
    cantidad: parseInt(inputCantidad.value),
    proveedor: inputProveedor.value.trim()
  };

  const indice = indiceEditar.value;

  if (indice === "") {
    productos.push(nuevoProducto); // Crear
  } else {
    productos[indice] = nuevoProducto; // Editar
  }


  // Notificacion de agregado con audio
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos();
  cerrarFormulario();
  mostrarNotificacion("✅ Producto guardado con éxito", "#74A60A", "Sonido/Guardado.mp3");
  });

// Editar producto
function editarProducto(index) {
  const producto = productos[index];
  inputNombre.value = producto.nombre;
  inputCategoria.value = producto.categoria;
  inputCantidad.value = producto.cantidad;
  inputProveedor.value = producto.proveedor;
  indiceEditar.value = index;

  tituloForm.textContent = "Editar Producto";
  modal.style.display = "flex";
}



// Notificacion de eliminado con audio
// Eliminar producto
function eliminarProducto(index) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
    mostrarNotificacion("🗑 Producto eliminado", "#F24405", "Sonido/Eliminado.mp3");
    
  }
}


// Filtro de búsqueda en tiempo real
document.getElementById("busqueda").addEventListener("input", function () {
  const texto = this.value.toLowerCase();

  const filas = document.querySelectorAll("#tabla-productos tr");

  filas.forEach((fila) => {
    const contenido = fila.textContent.toLowerCase();
    fila.style.display = contenido.includes(texto) ? "" : "none";
  });
});



let ordenAscendente = true;

function ordenarPorCantidad() {
  const tabla = document.querySelector("table tbody");
  const filas = Array.from(tabla.querySelectorAll("tr"));

  filas.sort((a, b) => {
    const valorA = parseInt(a.children[2].textContent);
    const valorB = parseInt(b.children[2].textContent);

    return ordenAscendente ? valorA - valorB : valorB - valorA;
  });

  filas.forEach(fila => tabla.appendChild(fila)); // Reordenar tabla

  // Cambiar ícono visualmente
  const icono = document.getElementById("iconoOrden");
  if (ordenAscendente) {
    icono.classList.remove("fa-sort", "fa-sort-up");
    icono.classList.add("fa-sort-down");
  } else {
    icono.classList.remove("fa-sort", "fa-sort-down");
    icono.classList.add("fa-sort-up");
  }

  ordenAscendente = !ordenAscendente;
}







function restablecerOrden() {
  // Restaurar la lista original desde localStorage
  productos = JSON.parse(localStorage.getItem("productos")) || [];

  // Restaurar vista sin filtros ni orden
  mostrarProductos();

  // Reiniciar el ícono de orden
  const icono = document.getElementById("iconoOrden");
  icono.classList.remove("fa-sort-up", "fa-sort-down");
  icono.classList.add("fa-sort");

  // Reiniciar estado del orden
  ordenAscendente = true;

  // Limpiar el campo de búsqueda
  document.getElementById("busqueda").value = "";
}



 // Notificacion

function mostrarNotificacion(mensaje, color = "#FF6000", sonidoURL = null) {
  const noti = document.getElementById("notificacion");
  noti.textContent = mensaje;
  noti.style.backgroundColor = color;
  noti.classList.add("mostrar");

  if (sonidoURL) {
    const audio = new Audio(sonidoURL);
    audio.play();
  }

  setTimeout(() => {
    noti.classList.remove("mostrar");
  }, 3000);
}






let indiceEliminar = null; // Guardamos el índice temporalmente

function eliminarProducto(index) {
  indiceEliminar = index;
  document.getElementById("confirm-modal").style.display = "flex";
}

function cerrarConfirmacion() {
  document.getElementById("confirm-modal").style.display = "none";
  indiceEliminar = null;
}

function confirmarEliminacion() {
  if (indiceEliminar !== null) {
    productos.splice(indiceEliminar, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
    mostrarNotificacion("🗑 Producto eliminado", "#F24405", "Sonido/Eliminado.mp3");
  }
  cerrarConfirmacion();
}



// Animacion de salida

function salirDelModulo() {
  const contenedor = document.querySelector(".container");

  contenedor.classList.add("salida");

  // Espera a que termine la animación antes de redirigir
  setTimeout(() => {
    location.href = "index.html";
  }, 550); // debe coincidir con el tiempo de la animación (0.6s)
}



// ✅ Exportar todo a PDF
function exportarTodoPDF() {
  const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

  if (productosGuardados.length === 0) {
    mostrarNotificacion("⚠ No hay productos para exportar", "#F24405", "Sonido/error.mp3");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Inventario Completo", 14, 20);

  const data = [["Nombre", "Categoría", "Cantidad", "Proveedor"]];

  productosGuardados.forEach(prod => {
    data.push([
      prod.nombre,
      prod.categoria,
      prod.cantidad.toString(),
      prod.proveedor
    ]);
  });

  doc.autoTable({
    startY: 30,
    head: [data[0]],
    body: data.slice(1)
  });

  doc.save("inventario_completo.pdf");
  mostrarNotificacion("✅ Exportación completa exitosa", "#74A60A", "Sonido/bien.mp3");
}


// ✅ Exportar búsqueda filtrada a PDF
function exportarFiltradoPDF() {
  const filtro = document.getElementById("busqueda").value.trim().toLowerCase();

  if (filtro === "") {
    mostrarNotificacion("⚠ Aplica un filtro antes de exportar", "#F24405", "Sonido/error.mp3");
    return;
  }

  const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

  const productosFiltrados = productosGuardados.filter(prod => {
    return (
      prod.nombre.toLowerCase().includes(filtro) ||
      prod.categoria.toLowerCase().includes(filtro) ||
      prod.proveedor.toLowerCase().includes(filtro) ||
      prod.cantidad.toString().includes(filtro)
    );
  });

  if (productosFiltrados.length === 0) {
    mostrarNotificacion("⚠ No hay resultados para exportar", "#F24405", "Sonido/error.mp3");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Inventario Filtrado", 14, 20);

  const data = [["Nombre", "Categoría", "Cantidad", "Proveedor"]];

  productosFiltrados.forEach(prod => {
    data.push([
      prod.nombre,
      prod.categoria,
      prod.cantidad.toString(),
      prod.proveedor
    ]);
  });

  doc.autoTable({
    startY: 30,
    head: [data[0]],
    body: data.slice(1)
  });

  doc.save("inventario_filtrado.pdf");
  mostrarNotificacion("✅ Exportación de búsqueda exitosa", "#74A60A", "Sonido/bien.mp3");
}


const doc = new jsPDF(); // NO pongas new jspdf.jsPDF() ni otras variantes




function exportarExcel() {
  const tabla = document.getElementById("tabla-productos");
  const filas = tabla.querySelectorAll("tr");

  let data = [["Nombre", "Categoría", "Cantidad", "Proveedor"]];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length === 4 || celdas.length === 5) {
      const filaData = [
        celdas[0].textContent,
        celdas[1].textContent,
        celdas[2].textContent,
        celdas[3].textContent
      ];
      data.push(filaData);
    }
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");

  XLSX.writeFile(wb, "inventario.xlsx");

  mostrarNotificacion("📁 Inventario exportado con éxito", "#1D6F42", "Sonido/Guardado.mp3");
}

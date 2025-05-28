<?php
// Configuración de la base de datos
$servidor = "localhost";
$usuario = "root";      // Cambia por tu usuario de MySQL
$password = "";    // Cambia por tu contraseña de MySQL
$base_datos = "sistema_pilon_mama";   // Cambia por el nombre de tu base de datos

// Crear conexión
try {
    $conexion = new PDO("mysql:host=$servidor;dbname=$base_datos;charset=utf8", $usuario, $password);
    
    // Configurar PDO para mostrar errores
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar charset UTF-8
    $conexion->exec("SET NAMES utf8");
    
} catch(PDOException $e) {
    // En caso de error de conexión
    die("Error de conexión: " . $e->getMessage());
}

// Función para cerrar conexión (opcional)
function cerrarConexion() {
    global $conexion;
    $conexion = null;
}

// Función para sanitizar datos de entrada
function limpiarDatos($dato) {
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato);
    return $dato;
}

// Función para responder en JSON
function responderJSON($datos, $exito = true, $mensaje = "") {
    header('Content-Type: application/json; charset=utf-8');
    
    $respuesta = array(
        'exito' => $exito,
        'mensaje' => $mensaje,
        'datos' => $datos
    );
    
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}
?>


<?php
$host = 'localhost';
$db = 'sistema_pilon_mama';
$user = 'root';
$pass = '';

try {
    $conexion = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>

<?php
$conexion = new PDO("mysql:host=localhost;dbname=sistema_pilon_mama", "root", "");
$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>

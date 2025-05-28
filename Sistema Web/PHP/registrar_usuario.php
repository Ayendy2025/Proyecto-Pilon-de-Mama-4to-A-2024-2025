<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido'
    ]);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

$nombre = trim($datos['username'] ?? '');
$correo = trim($datos['email'] ?? '');
$clave = trim($datos['password'] ?? '');

if (empty($nombre) || empty($correo) || empty($clave)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

try {
    $consulta = $conexion->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $consulta->execute([$correo]);

    if ($consulta->rowCount() > 0) {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Este correo ya está registrado'
        ]);
        exit;
    }

    $claveEncriptada = password_hash($clave, PASSWORD_BCRYPT);
    $insertar = $conexion->prepare("INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)");
    $insertar->execute([$nombre, $correo, $claveEncriptada]);

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Usuario registrado con éxito'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error de servidor: ' . $e->getMessage()
    ]);

}

?>
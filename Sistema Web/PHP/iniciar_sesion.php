<?php
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

$usuario = trim($datos['usuario'] ?? '');
$clave = trim($datos['clave'] ?? '');

if (empty($usuario) || empty($clave)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Faltan campos requeridos'
    ]);
    exit;
}

try {
    // Buscar por nombre o correo
    $stmt = $conexion->prepare("SELECT nombre, correo, contraseña FROM usuarios WHERE nombre = ? OR correo = ?");
    $stmt->execute([$usuario, $usuario]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Usuario no encontrado'
        ]);
        exit;
    }

    $usuarioEncontrado = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($clave, $usuarioEncontrado['contraseña'])) {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Contraseña incorrecta'
        ]);
        exit;
    }

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Inicio de sesión exitoso',
        'usuario' => $usuarioEncontrado['nombre']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>

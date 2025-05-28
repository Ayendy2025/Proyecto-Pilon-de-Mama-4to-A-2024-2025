<?php
// Incluir conexión PDO (asegúrate de que 'conexion.php' define la variable $conexion como instancia PDO)
require_once 'conexion.php';

// Encabezados para permitir llamadas AJAX
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Verificamos que sea GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido',
        'datos' => []
    ]);
    exit;
}

try {
    $sql = "SELECT id, nombre, categoria, cantidad, proveedor, fecha_creacion, fecha_actualizacion 
            FROM productos ORDER BY id ASC";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Productos obtenidos correctamente',
        'datos' => $productos
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al obtener productos: ' . $e->getMessage(),
        'datos' => []
    ]);
}
?>

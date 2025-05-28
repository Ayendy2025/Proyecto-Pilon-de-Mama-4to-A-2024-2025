<?php
// Incluir archivo de conexión (asegúrate que esté bien configurado)
require_once 'conexion.php';

// Encabezados para JSON y CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido',
        'datos' => []
    ]);
    exit;
}

try {
    // Consulta para productos con cantidad menor a 10
    $sql = "SELECT id, nombre, categoria, cantidad, proveedor 
            FROM productos 
            WHERE cantidad < 10 
            ORDER BY cantidad ASC";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $alertas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Productos en alerta obtenidos correctamente',
        'datos' => $alertas
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error en la consulta: ' . $e->getMessage(),
        'datos' => []
    ]);
}
?>

<?php
// Incluir archivo de conexión
require_once 'conexion.php';

// Configurar headers para permitir peticiones AJAX
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    // Consulta para obtener todos los productos eliminados
    $sql = "SELECT id, producto_id_original, nombre, categoria, cantidad, proveedor, 
                   fecha_eliminacion, fecha_creacion_original, fecha_actualizacion_original
            FROM productos_eliminados 
            ORDER BY fecha_eliminacion DESC";
    
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    
    // Obtener todos los resultados
    $productosEliminados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Responder con los productos eliminados
    responderJSON($productosEliminados, true, "Productos eliminados obtenidos correctamente");
    
} catch(PDOException $e) {
    // Error en la consulta
    responderJSON([], false, "Error al obtener productos eliminados: " . $e->getMessage());
} catch(Exception $e) {
    // Error general
    responderJSON([], false, "Error inesperado: " . $e->getMessage());
}
?>
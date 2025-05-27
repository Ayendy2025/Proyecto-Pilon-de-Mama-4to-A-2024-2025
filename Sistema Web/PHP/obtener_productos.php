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
    // Consulta para obtener todos los productos
    $sql = "SELECT id, nombre, categoria, cantidad, proveedor, fecha_creacion, fecha_actualizacion 
            FROM productos 
            ORDER BY id ASC";
    
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    
    // Obtener todos los resultados
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Responder con los productos
    responderJSON($productos, true, "Productos obtenidos correctamente");
    
} catch(PDOException $e) {
    // Error en la consulta
    responderJSON([], false, "Error al obtener productos: " . $e->getMessage());
} catch(Exception $e) {
    // Error general
    responderJSON([], false, "Error inesperado: " . $e->getMessage());
}
?>
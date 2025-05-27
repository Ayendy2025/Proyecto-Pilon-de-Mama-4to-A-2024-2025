<?php
// Incluir archivo de conexión
require_once 'conexion.php';

// Configurar headers para permitir peticiones AJAX
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Verificar que sea una petición POST o DELETE
if ($_SERVER['REQUEST_METHOD'] != 'POST' && $_SERVER['REQUEST_METHOD'] != 'DELETE') {
    responderJSON([], false, "Método no permitido. Use POST o DELETE.");
}

try {
    // Obtener datos JSON del cuerpo de la petición
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Si no hay datos JSON, intentar con $_POST
    if (!$input) {
        $input = $_POST;
    }
    
    // Validar que se recibió el ID
    if (!isset($input['id']) || empty($input['id'])) {
        responderJSON([], false, "ID del producto eliminado requerido");
    }
    
    $id = (int)$input['id'];
    
    // Validar que el ID sea válido
    if ($id <= 0) {
        responderJSON([], false, "ID del producto eliminado inválido");
    }
    
    // Primero verificar si el producto eliminado existe
    $sqlVerificar = "SELECT id, nombre, categoria, cantidad, proveedor
                     FROM productos_eliminados 
                     WHERE id = :id";
    
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':id', $id);
    $stmtVerificar->execute();
    
    $producto = $stmtVerificar->fetch(PDO::FETCH_ASSOC);
    
    if (!$producto) {
        responderJSON([], false, "Producto eliminado no encontrado");
    }
    
    // Eliminar definitivamente de la tabla de productos eliminados
    $sqlEliminarDefinitivo = "DELETE FROM productos_eliminados WHERE id = :id";
    $stmtEliminarDefinitivo = $conexion->prepare($sqlEliminarDefinitivo);
    $stmtEliminarDefinitivo->bindParam(':id', $id);
    $stmtEliminarDefinitivo->execute();
    
    // Verificar que se eliminó correctamente
    if ($stmtEliminarDefinitivo->rowCount() > 0) {
        responderJSON(
            ['producto_eliminado_definitivamente' => $producto], 
            true, 
            "Producto eliminado permanentemente"
        );
    } else {
        responderJSON([], false, "No se pudo eliminar el producto definitivamente");
    }
    
} catch(PDOException $e) {
    // Error en la base de datos
    responderJSON([], false, "Error en la base de datos: " . $e->getMessage());
} catch(Exception $e) {
    // Error general
    responderJSON([], false, "Error inesperado: " . $e->getMessage());
}
?>
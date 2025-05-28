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

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    responderJSON([], false, "Método no permitido. Use POST.");
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
        responderJSON([], false, "ID del producto requerido");
    }
    
    $id = (int)$input['id'];
    
    // Validar que el ID sea válido
    if ($id <= 0) {
        responderJSON([], false, "ID del producto inválido");
    }
    
    // Primero verificar si el producto existe y obtener sus datos
    $sqlVerificar = "SELECT id, nombre, categoria, cantidad, proveedor, fecha_creacion, fecha_actualizacion
                     FROM productos 
                     WHERE id = :id";
    
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':id', $id);
    $stmtVerificar->execute();
    
    $producto = $stmtVerificar->fetch(PDO::FETCH_ASSOC);
    
    if (!$producto) {
        responderJSON([], false, "Producto no encontrado");
    }
    
    // Iniciar transacción para mover el producto a eliminados
    $conexion->beginTransaction();
    
    try {
        // Insertar en la tabla de productos eliminados
        $sqlEliminar = "INSERT INTO productos_eliminados 
                        (producto_id_original, nombre, categoria, cantidad, proveedor, 
                         fecha_creacion_original, fecha_actualizacion_original, fecha_eliminacion)
                        VALUES (:producto_id, :nombre, :categoria, :cantidad, :proveedor, 
                                :fecha_creacion, :fecha_actualizacion, CURRENT_TIMESTAMP)";
        
        $stmtEliminar = $conexion->prepare($sqlEliminar);
        $stmtEliminar->bindParam(':producto_id', $producto['id']);
        $stmtEliminar->bindParam(':nombre', $producto['nombre']);
        $stmtEliminar->bindParam(':categoria', $producto['categoria']);
        $stmtEliminar->bindParam(':cantidad', $producto['cantidad']);
        $stmtEliminar->bindParam(':proveedor', $producto['proveedor']);
        $stmtEliminar->bindParam(':fecha_creacion', $producto['fecha_creacion']);
        $stmtEliminar->bindParam(':fecha_actualizacion', $producto['fecha_actualizacion']);
        
        $stmtEliminar->execute();
        
        // Eliminar de la tabla principal
        $sqlBorrar = "DELETE FROM productos WHERE id = :id";
        $stmtBorrar = $conexion->prepare($sqlBorrar);
        $stmtBorrar->bindParam(':id', $id);
        $stmtBorrar->execute();
        
        // Verificar que se eliminó correctamente
        if ($stmtBorrar->rowCount() > 0) {
            // Confirmar transacción
            $conexion->commit();
            
            responderJSON([
                'producto_eliminado' => [
                    'id' => $producto['id'],
                    'nombre' => $producto['nombre']
                ]
            ], true, "Producto eliminado correctamente");
        } else {
            // Revertir transacción
            $conexion->rollBack();
            responderJSON([], false, "No se pudo eliminar el producto");
        }
        
    } catch(Exception $e) {
        // Revertir transacción en caso de error
        $conexion->rollBack();
        throw $e;
    }
    
} catch(PDOException $e) {
    // Error en la base de datos
    responderJSON([], false, "Error en la base de datos: " . $e->getMessage());
} catch(Exception $e) {
    // Error general
    responderJSON([], false, "Error inesperado: " . $e->getMessage());
}
?>
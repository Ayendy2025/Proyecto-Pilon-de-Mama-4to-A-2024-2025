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
        responderJSON([], false, "ID del producto eliminado requerido");
    }
    
    $id = (int)$input['id'];
    
    // Validar que el ID sea válido
    if ($id <= 0) {
        responderJSON([], false, "ID del producto eliminado inválido");
    }
    
    // Primero verificar si el producto eliminado existe y obtener sus datos
    $sqlVerificar = "SELECT id, producto_id_original, nombre, categoria, cantidad, proveedor,
                            fecha_creacion_original, fecha_actualizacion_original
                     FROM productos_eliminados 
                     WHERE id = :id";
    
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':id', $id);
    $stmtVerificar->execute();
    
    $productoEliminado = $stmtVerificar->fetch(PDO::FETCH_ASSOC);
    
    if (!$productoEliminado) {
        responderJSON([], false, "Producto eliminado no encontrado");
    }
    
    // Iniciar transacción para restaurar el producto
    $conexion->beginTransaction();
    
    try {
        // Insertar el producto de vuelta en la tabla principal
        $sqlRestaurar = "INSERT INTO productos (nombre, categoria, cantidad, proveedor, fecha_creacion, fecha_actualizacion)
                         VALUES (:nombre, :categoria, :cantidad, :proveedor, :fecha_creacion, CURRENT_TIMESTAMP)";
        
        $stmtRestaurar = $conexion->prepare($sqlRestaurar);
        $stmtRestaurar->bindParam(':nombre', $productoEliminado['nombre']);
        $stmtRestaurar->bindParam(':categoria', $productoEliminado['categoria']);
        $stmtRestaurar->bindParam(':cantidad', $productoEliminado['cantidad']);
        $stmtRestaurar->bindParam(':proveedor', $productoEliminado['proveedor']);
        
        // Si tenía fecha de creación original, la usamos, sino usamos la actual
        $fechaCreacion = $productoEliminado['fecha_creacion_original'] ?: date('Y-m-d H:i:s');
        $stmtRestaurar->bindParam(':fecha_creacion', $fechaCreacion);
        
        $stmtRestaurar->execute();
        
        // Obtener el ID del producto restaurado
        $nuevoId = $conexion->lastInsertId();
        
        // Eliminar de la tabla de productos eliminados
        $sqlEliminarEliminado = "DELETE FROM productos_eliminados WHERE id = :id";
        $stmtEliminarEliminado = $conexion->prepare($sqlEliminarEliminado);
        $stmtEliminarEliminado->bindParam(':id', $id);
        $stmtEliminarEliminado->execute();
        
        // Verificar que se eliminó de la tabla de eliminados
        if ($stmtEliminarEliminado->rowCount() > 0) {
            // Confirmar transacción
            $conexion->commit();
            
            $productoRestaurado = [
                'id' => $nuevoId,
                'nombre' => $productoEliminado['nombre'],
                'categoria' => $productoEliminado['categoria'],
                'cantidad' => $productoEliminado['cantidad'],
                'proveedor' => $productoEliminado['proveedor']
            ];
            
            responderJSON(['producto_restaurado' => $productoRestaurado], true, "Producto restaurado correctamente");
        } else {
            // Revertir transacción
            $conexion->rollBack();
            responderJSON([], false, "No se pudo completar la restauración");
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
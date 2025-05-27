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
        responderJSON([], false, "ID del producto requerido");
    }
    
    $id = (int)$input['id'];
    
    // Validar que el ID sea válido
    if ($id <= 0) {
        responderJSON([], false, "ID del producto inválido");
    }
    
    // Primero verificar si el producto existe y obtener sus datos
    $sqlVerificar = "SELECT id, nombre, categoria, cantidad, proveedor 
                     FROM productos 
                     WHERE id = :id";
    
    $stmtVerificar = $conexion->prepare($sqlVerificar);
    $stmtVerificar->bindParam(':id', $id);
    $stmtVerificar->execute();
    
    $producto = $stmtVerificar->fetch(PDO::FETCH_ASSOC);
    
    if (!$producto) {
        responderJSON([], false, "Producto no encontrado");
    }
    
    // Iniciar transacción para manejar la eliminación y el archivo
    $conexion->beginTransaction();
    
    try {
        // Crear tabla de productos eliminados si no existe
        $sqlCrearTabla = "CREATE TABLE IF NOT EXISTS productos_eliminados (
            id INT AUTO_INCREMENT PRIMARY KEY,
            producto_id_original INT NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            categoria VARCHAR(100) NOT NULL,
            cantidad INT NOT NULL,
            proveedor VARCHAR(100) NOT NULL,
            fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_creacion_original TIMESTAMP NULL,
            fecha_actualizacion_original TIMESTAMP NULL
        )";
        
        $conexion->exec($sqlCrearTabla);
        
        // Insertar en productos_eliminados
        $sqlArchivar = "INSERT INTO productos_eliminados 
                        (producto_id_original, nombre, categoria, cantidad, proveedor, fecha_creacion_original, fecha_actualizacion_original)
                        SELECT id, nombre, categoria, cantidad, proveedor, fecha_creacion, fecha_actualizacion
                        FROM productos 
                        WHERE id = :id";
        
        $stmtArchivar = $conexion->prepare($sqlArchivar);
        $stmtArchivar->bindParam(':id', $id);
        $stmtArchivar->execute();
        
        // Eliminar de la tabla principal
        $sqlEliminar = "DELETE FROM productos WHERE id = :id";
        $stmtEliminar = $conexion->prepare($sqlEliminar);
        $stmtEliminar->bindParam(':id', $id);
        $stmtEliminar->execute();
        
        // Verificar que se eliminó correctamente
        if ($stmtEliminar->rowCount() > 0) {
            // Confirmar transacción
            $conexion->commit();
            responderJSON(['producto_eliminado' => $producto], true, "Producto eliminado y archivado correctamente");
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
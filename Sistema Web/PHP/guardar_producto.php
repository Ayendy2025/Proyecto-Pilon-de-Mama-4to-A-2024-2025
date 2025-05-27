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
    
    // Validar que se recibieron los datos necesarios
    if (!isset($input['nombre']) || !isset($input['categoria']) || 
        !isset($input['cantidad']) || !isset($input['proveedor'])) {
        responderJSON([], false, "Faltan datos requeridos (nombre, categoria, cantidad, proveedor)");
    }
    
    // Limpiar y validar los datos
    $nombre = limpiarDatos($input['nombre']);
    $categoria = limpiarDatos($input['categoria']);
    $cantidad = (int)$input['cantidad'];
    $proveedor = limpiarDatos($input['proveedor']);
    $id = isset($input['id']) ? (int)$input['id'] : null;
    
    // Validaciones adicionales
    if (empty($nombre) || empty($categoria) || empty($proveedor)) {
        responderJSON([], false, "Los campos nombre, categoría y proveedor no pueden estar vacíos");
    }
    
    if ($cantidad < 0) {
        responderJSON([], false, "La cantidad no puede ser negativa");
    }
    
    // Determinar si es una actualización o inserción
    if ($id && $id > 0) {
        // ACTUALIZAR producto existente
        $sql = "UPDATE productos SET 
                nombre = :nombre, 
                categoria = :categoria, 
                cantidad = :cantidad, 
                proveedor = :proveedor,
                fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = :id";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':cantidad', $cantidad);
        $stmt->bindParam(':proveedor', $proveedor);
        $stmt->bindParam(':id', $id);
        
        $stmt->execute();
        
        // Verificar si se actualizó algún registro
        if ($stmt->rowCount() > 0) {
            responderJSON(['id' => $id], true, "Producto actualizado correctamente");
        } else {
            responderJSON([], false, "No se encontró el producto a actualizar");
        }
        
    } else {
        // INSERTAR nuevo producto
        $sql = "INSERT INTO productos (nombre, categoria, cantidad, proveedor) 
                VALUES (:nombre, :categoria, :cantidad, :proveedor)";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':cantidad', $cantidad);
        $stmt->bindParam(':proveedor', $proveedor);
        
        $stmt->execute();
        
        // Obtener el ID del producto recién insertado
        $nuevoId = $conexion->lastInsertId();
        
        responderJSON(['id' => $nuevoId], true, "Producto guardado correctamente");
    }
    
} catch(PDOException $e) {
    // Error en la base de datos
    responderJSON([], false, "Error en la base de datos: " . $e->getMessage());
} catch(Exception $e) {
    // Error general
    responderJSON([], false, "Error inesperado: " . $e->getMessage());
}
?>
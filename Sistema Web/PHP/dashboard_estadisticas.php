<?php
require_once 'conexion.php';

header('Content-Type: application/json');

try {
    // Total de productos
    $totalQuery = $conexion->query("SELECT COUNT(*) as total FROM productos");
    $total = $totalQuery->fetch(PDO::FETCH_ASSOC)['total'];

    // Productos con stock bajo (5 o menos)
    $bajoQuery = $conexion->query("SELECT COUNT(*) as bajos FROM productos WHERE cantidad <= 10");
    $bajos = $bajoQuery->fetch(PDO::FETCH_ASSOC)['bajos'];

    echo json_encode([
        'exito' => true,
        'totalProductos' => $total,
        'stockBajo' => $bajos
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al obtener estadísticas: ' . $e->getMessage()
    ]);
}

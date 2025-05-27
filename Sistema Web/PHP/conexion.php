<?php
$host = "localhost";
$usuario = "root";
$clave = ""; // en WAMP por defecto no hay contraseña
$baseDeDatos = "sistema_el_pilon_de_mama";

$conexion = new mysqli($host, $usuario, $clave, $baseDeDatos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>

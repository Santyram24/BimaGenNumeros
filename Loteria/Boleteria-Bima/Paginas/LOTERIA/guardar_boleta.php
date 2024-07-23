<?php
$servername = "localhost";
$username = "root"; // Cambia si tienes un usuario diferente
$password = ""; // Cambia si tienes una contraseña establecida
$dbname = "loteria";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

function generarNumeroUnico($conn) {
    do {
        $numero = str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);
        $check_sql = "SELECT COUNT(*) as count FROM boletas WHERE numero = '$numero'";
        $result = $conn->query($check_sql);
        $row = $result->fetch_assoc();
    } while ($row['count'] > 0);
    
    return $numero;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $email = $conn->real_escape_string($_POST['email']);
    $numerosRifa = explode(', ', $_POST['numerosRifa']);
    $valorBoleta = $conn->real_escape_string($_POST['valorBoleta']);
    $cedula = $conn->real_escape_string($_POST['cedula']);
    $telefono = $conn->real_escape_string($_POST['telefono']);

    foreach ($numerosRifa as $index => $numero) {
        $numero = $conn->real_escape_string($numero);
        $check_sql = "SELECT COUNT(*) as count FROM boletas WHERE numero = '$numero'";
        $result = $conn->query($check_sql);
        $row = $result->fetch_assoc();

        if ($row['count'] > 0) {
            $nuevoNumero = generarNumeroUnico($conn);
            $numerosRifa[$index] = $nuevoNumero;
        }
    }

    foreach ($numerosRifa as $numero) {
        $numero = $conn->real_escape_string($numero);
        $sql = "INSERT INTO boletas (numero, email, valor, telefono, cedula, nombre) VALUES ('$numero', '$email', '$valorBoleta', '$telefono', '$cedula', '$nombre')";
        
        if ($conn->query($sql) !== TRUE) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    // Devolver los números finales al JavaScript
    echo json_encode([
        'status' => 'success',
        'numerosRifa' => $numerosRifa,
    ]);
}

$conn->close();
?>
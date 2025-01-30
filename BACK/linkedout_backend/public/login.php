<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/../src/database.php";

// Lire les données envoyées
$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data, true);

// Vérifier si les champs sont bien remplis
if (!isset($data["identifier"]) || !isset($data["password"])) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

$identifier = $conn->real_escape_string($data["identifier"]); // Email ou pseudo
$password = $data["password"];

// 🔹 Vérifier si l'utilisateur existe avec email ou pseudo
$sql = "SELECT id, password FROM users WHERE email = '$identifier' OR pseudo = '$identifier'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Vérifier le mot de passe avec `password_verify`
    if (password_verify($password, $row["password"])) {
        echo json_encode(["success" => "Connexion réussie", "user_id" => $row["id"]]);
    } else {
        echo json_encode(["error" => "Mot de passe incorrect"]);
    }
} else {
    echo json_encode(["error" => "Utilisateur non trouvé"]);
}

$conn->close();
?>

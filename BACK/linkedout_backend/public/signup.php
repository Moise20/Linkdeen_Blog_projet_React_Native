<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/../src/database.php";

// 🔹 Vérifier les données reçues
$raw_data = file_get_contents("php://input");
error_log("Données reçues : " . $raw_data); // 🔥 Vérifie ce que PHP reçoit

$data = json_decode($raw_data, true);

// Vérifier si toutes les données sont envoyées
if (!isset($data["firstName"]) || !isset($data["lastName"]) || !isset($data["email"]) || !isset($data["pseudo"]) || !isset($data["password"])) {
    error_log("Données manquantes !");
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

// Récupérer et sécuriser les données
$firstName = $conn->real_escape_string($data["firstName"]);
$lastName = $conn->real_escape_string($data["lastName"]);
$email = $conn->real_escape_string($data["email"]);
$pseudo = $conn->real_escape_string($data["pseudo"]);
$hashedPassword = password_hash($data["password"], PASSWORD_BCRYPT);

// 🔹 Vérifier si toutes les données sont bien traitées
error_log("Données après traitement : firstName=$firstName, lastName=$lastName, email=$email, pseudo=$pseudo");

$sql = "INSERT INTO users (firstName, lastName, email, pseudo, password) VALUES ('$firstName', '$lastName', '$email', '$pseudo', '$hashedPassword')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => "Utilisateur inscrit"]);
} else {
    echo json_encode(["error" => "Erreur d'inscription : " . $conn->error]);
}

$conn->close();
?>

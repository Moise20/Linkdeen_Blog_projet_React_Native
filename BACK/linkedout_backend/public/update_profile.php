<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/../src/database.php";

$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data, true);

// Vérifier si toutes les données sont envoyées
if (!isset($data["userId"], $data["firstName"], $data["lastName"], $data["pseudo"])) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

$userId = intval($data["userId"]);
$firstName = $conn->real_escape_string($data["firstName"]);
$lastName = $conn->real_escape_string($data["lastName"]);
$pseudo = $conn->real_escape_string($data["pseudo"]);

// Mise à jour des informations utilisateur
$sql = "UPDATE users SET firstName='$firstName', lastName='$lastName', pseudo='$pseudo' WHERE id=$userId";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => "Profil mis à jour"]);
} else {
    echo json_encode(["error" => "Erreur de mise à jour : " . $conn->error]);
}

$conn->close();
?>

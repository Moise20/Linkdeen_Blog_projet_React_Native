<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . "/../src/database.php";

// 🔹 Vérifier si `user_id` est bien passé en paramètre
if (!isset($_GET["user_id"])) {
    echo json_encode(["error" => "ID utilisateur manquant"]);
    exit;
}

$user_id = intval($_GET["user_id"]); // 🔹 Sécurisation

$sql = "SELECT firstName, lastName, email, pseudo, profileImage FROM users WHERE id = $user_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "Utilisateur non trouvé"]);
}

$conn->close();
?>

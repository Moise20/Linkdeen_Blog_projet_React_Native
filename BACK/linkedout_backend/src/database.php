<?php
$host = "127.0.0.1"; // Utiliser 127.0.0.1 au lieu de 'localhost' pour éviter les erreurs de socket
$user = "root";
$password = ""; // Si MySQL a un mot de passe, ajoute-le ici
$dbname = "linkedout_db";

// Connexion avec gestion des erreurs
try {
    $conn = new mysqli($host, $user, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Erreur de connexion à MySQL : " . $conn->connect_error);
    }
} catch (Exception $e) {
    die(json_encode(["error" => $e->getMessage()]));
}
?>

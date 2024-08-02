<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle POST request to store blocked domains
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $domain = trim($data['domain']);  // Trim any whitespace

    if (!empty($domain)) {  // Check if the domain is not empty
        // Database connection and insertion code
        $conn = new mysqli('localhost', 'root', '', 'safesurf');

        if ($conn->connect_error) {
            die('Connection failed: ' . $conn->connect_error);
        }

        $stmt = $conn->prepare('INSERT INTO blocked_domains (domain) VALUES (?)');
        $stmt->bind_param('s', $domain);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Empty domain']);
    }
}
?>

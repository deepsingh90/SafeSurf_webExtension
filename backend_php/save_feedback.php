<?php
// Database configuration
$servername = "localhost";
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "safesurf"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get feedback data from POST request
$data = json_decode(file_get_contents("php://input"), true);

$name = $conn->real_escape_string($data['name']);
$feedback = $conn->real_escape_string($data['feedback']);

// SQL query to insert feedback into the database
$sql = "INSERT INTO feedback (name, feedback) VALUES ('$name', '$feedback')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("status" => "success", "message" => "Feedback saved successfully."));
} else {
    echo json_encode(array("status" => "error", "message" => "Error: " . $sql . "<br>" . $conn->error));
}

// Close connection
$conn->close();
?>

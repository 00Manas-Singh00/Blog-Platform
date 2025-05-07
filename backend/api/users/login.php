<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/User.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Prepare user object
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(!empty($data->username) && !empty($data->password)) {
    // Set user property values
    $user->username = $data->username;
    $user->password = $data->password;

    // Check if user exists and password is correct
    if($user->login()) {
        // Generate simple token (in a real app, use JWT)
        $token = bin2hex(random_bytes(16));
        
        // Set response code - 200 OK
        http_response_code(200);

        // Tell the user login was successful
        echo json_encode(
            array(
                "message" => "Login successful.",
                "user_id" => $user->id,
                "username" => $user->username,
                "token" => $token
            )
        );
    } else {
        // Set response code - 401 Unauthorized
        http_response_code(401);

        // Tell the user login failed
        echo json_encode(array("message" => "Login failed. Invalid username or password."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user data is incomplete
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
} 
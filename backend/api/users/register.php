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
if(
    !empty($data->username) &&
    !empty($data->password) &&
    !empty($data->email)
) {
    // Set user property values
    $user->username = $data->username;
    $user->password = $data->password;
    $user->email = $data->email;

    // Check if username already exists
    if($user->usernameExists()) {
        // Set response code - 400 bad request
        http_response_code(400);

        // Tell the user
        echo json_encode(array("message" => "Username already exists."));
        exit;
    }

    // Check if email already exists
    if($user->emailExists()) {
        // Set response code - 400 bad request
        http_response_code(400);

        // Tell the user
        echo json_encode(array("message" => "Email already exists."));
        exit;
    }

    // Create the user
    if($user->create()) {
        // Set response code - 201 created
        http_response_code(201);

        // Tell the user
        echo json_encode(array("message" => "User was created."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to create user."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
} 
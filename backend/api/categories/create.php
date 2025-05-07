<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/Category.php';
include_once '../../middleware/ClerkAuth.php';

// Initialize auth middleware
$auth = new ClerkAuth();

// Require authentication
$auth->requireAuth();

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Prepare category object
$category = new Category($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(!empty($data->name)) {
    // Set category property values
    $category->name = $data->name;
    $category->description = isset($data->description) ? $data->description : "";

    // Create the category
    if($category->create()) {
        // Set response code - 201 created
        http_response_code(201);

        // Tell the user
        echo json_encode(array("message" => "Category was created."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to create category."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to create category. Data is incomplete."));
} 
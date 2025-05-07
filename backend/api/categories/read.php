<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/Category.php';

// Instantiate database and category object
$database = new Database();
$db = $database->getConnection();

// Initialize category object
$category = new Category($db);

// Query categories
$stmt = $category->read();
$num = $stmt->rowCount();

// Check if any categories
if($num > 0) {
    // Categories array
    $categories_arr = array();
    $categories_arr["records"] = array();

    // Retrieve table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Extract row
        extract($row);

        $category_item = array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "created_at" => $created_at
        );

        array_push($categories_arr["records"], $category_item);
    }

    // Set response code - 200 OK
    http_response_code(200);

    // Show categories data in json format
    echo json_encode($categories_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);

    // Tell the user no categories found
    echo json_encode(
        array("message" => "No categories found.")
    );
} 
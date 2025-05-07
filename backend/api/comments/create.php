<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/Comment.php';
include_once '../../middleware/ClerkAuth.php';

// Instantiate database and comment object
$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Check for required fields
if (
    empty($data->post_id) ||
    empty($data->content) ||
    empty($data->author_name)
) {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user
    echo json_encode(array("message" => "Unable to create comment. Required fields are missing."));
    exit;
}

// Check for authentication (optional, can post as anonymous or logged in)
$auth = new ClerkAuth();
$user = $auth->getCurrentUser();

// Set comment property values
$comment->post_id = $data->post_id;
$comment->content = $data->content;
$comment->author_name = $data->author_name;
$comment->parent_id = $data->parent_id ?? null;

// Set user details if authenticated
if ($user) {
    $comment->user_id = $user['id'];
    $comment->clerk_id = $user['id'];
    // Auto-approve comments from authenticated users (optional)
    $comment->is_approved = 1;
} else {
    // Anonymous comments need moderation
    $comment->is_approved = 0;
}

try {
    // Create the comment
    if ($comment->create()) {
        // Set response code - 201 created
        http_response_code(201);
        
        // Tell the user
        echo json_encode(array(
            "message" => "Comment was created.",
            "id" => $comment->id,
            "is_approved" => $comment->is_approved
        ));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to create comment."));
    }
} catch (Exception $e) {
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/Post.php';
include_once '../../middleware/ClerkAuth.php';

// Initialize auth middleware
$auth = new ClerkAuth();

// Require authentication
$auth->requireAuth();

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Prepare post object
$post = new Post($db);

// Get post id
$data = json_decode(file_get_contents("php://input"));

// Make sure post id is not empty
if(!empty($data->id)) {
    // Set post id to be deleted
    $post->id = $data->id;

    // Delete the post
    if($post->delete()) {
        // Set response code - 200 ok
        http_response_code(200);

        // Tell the user
        echo json_encode(array("message" => "Post was deleted."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to delete post."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to delete post. No post ID provided."));
} 
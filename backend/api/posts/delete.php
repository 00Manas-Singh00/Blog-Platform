<?php
// Initialize environment
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/Post.php';
include_once '../../middleware/ClerkAuth.php';

try {
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

    // Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON: " . json_last_error_msg()));
        exit;
    }

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
            // Set response code - 404 not found or 503 service unavailable
            http_response_code(404);

            // Tell the user
            echo json_encode(array("message" => "Unable to delete post. Post may not exist."));
        }
    } else {
        // Set response code - 400 bad request
        http_response_code(400);

        // Tell the user
        echo json_encode(array("message" => "Unable to delete post. No post ID provided."));
    }
} catch (Exception $e) {
    // Set response code - 500 server error
    http_response_code(500);
    
    // Return error message
    echo json_encode(array(
        "message" => "Server error while trying to delete post.",
        "error" => $e->getMessage()
    ));
} 
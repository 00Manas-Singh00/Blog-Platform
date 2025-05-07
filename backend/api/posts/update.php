<?php
// Initialize environment
require_once '../../init.php';

// Set content type
header("Content-Type: application/json; charset=UTF-8");

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/Post.php';
include_once '../../middleware/ClerkAuth.php';

// Initialize auth middleware
$auth = new ClerkAuth();

// Require authentication
$auth->requireAuth();

// Get current user
$user = $auth->getCurrentUser();

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Prepare post object
$post = new Post($db);

// Get id of post to be updated
$data = json_decode(file_get_contents("php://input"));

// Make sure id is not empty
if(!empty($data->id)) {
    // Set ID property of post to be updated
    $post->id = $data->id;
    
    // Set post property values
    $post->title = isset($data->title) ? $data->title : null;
    $post->content = isset($data->content) ? $data->content : null;
    $post->excerpt = isset($data->excerpt) ? $data->excerpt : null;
    
    // Keep the original author or use current user if needed
    if(isset($data->author) && !empty($data->author)) {
        $post->author = $data->author;
    } else {
        // Get current post to keep the original author if not specified
        $current_post = new Post($db);
        $current_post->id = $post->id;
        $current_post->readOne();
        $post->author = $current_post->author;
    }
    
    $post->category = isset($data->category) ? $data->category : null;
    
    // Handle tags
    if(isset($data->tags) && is_array($data->tags)) {
        $post->tags = json_encode($data->tags);
    } elseif(isset($data->tags) && is_string($data->tags)) {
        $post->tags = $data->tags;
    } else {
        $post->tags = null;
    }

    // Update the post
    if($post->update()) {
        // Set response code - 200 ok
        http_response_code(200);

        // Tell the user
        echo json_encode(array("message" => "Post was updated."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to update post."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to update post. No ID provided."));
} 
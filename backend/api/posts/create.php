<?php
// Initialize environment
require_once '../../init.php';

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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(!empty($data->title) && !empty($data->content)) {
    // Set post property values
    $post->title = $data->title;
    $post->content = $data->content;
    $post->excerpt = isset($data->excerpt) ? $data->excerpt : substr(strip_tags($data->content), 0, 100) . '...';
    
    // Use author from Clerk user data if available
    $post->author = isset($user['first_name']) && isset($user['last_name']) 
        ? $user['first_name'] . ' ' . $user['last_name'] 
        : (isset($user['username']) ? $user['username'] : (isset($user['email_addresses'][0]['email_address']) ? $user['email_addresses'][0]['email_address'] : 'Anonymous'));
    
    $post->category = isset($data->category) ? $data->category : null;
    
    // Handle tags
    if(isset($data->tags) && is_array($data->tags)) {
        $post->tags = json_encode($data->tags);
    } elseif(isset($data->tags) && is_string($data->tags)) {
        $post->tags = $data->tags;
    } else {
        $post->tags = null;
    }

    // Create the post
    if($post->create()) {
        // Set response code - 201 created
        http_response_code(201);

        // Tell the user
        echo json_encode(array("message" => "Post was created."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to create post."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to create post. Data is incomplete."));
} 
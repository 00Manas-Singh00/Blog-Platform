<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/Post.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Prepare post object
$post = new Post($db);

// Set ID property of post to be read
$post->id = isset($_GET['id']) ? $_GET['id'] : die();

// Read the details of post
$post->readOne();

if($post->title != null) {
    // Process tags (convert from JSON if stored as JSON)
    $tags_arr = [];
    if(isset($post->tags) && !empty($post->tags)) {
        // Check if tags is stored as JSON
        if(is_string($post->tags)) {
            $decoded_tags = json_decode($post->tags, true);
            if(json_last_error() === JSON_ERROR_NONE && is_array($decoded_tags)) {
                $tags_arr = $decoded_tags;
            } else {
                // If not valid JSON, assume comma-separated string
                $tags_arr = explode(',', $post->tags);
            }
        } elseif(is_array($post->tags)) {
            $tags_arr = $post->tags;
        }
    }

    // Create array
    $post_arr = array(
        "id" =>  $post->id,
        "title" => $post->title,
        "content" => $post->content,
        "excerpt" => $post->excerpt,
        "author" => $post->author,
        "created_at" => $post->created_at,
        "category" => $post->category,
        "tags" => $tags_arr
    );

    // Set response code - 200 OK
    http_response_code(200);

    // Make it json format
    echo json_encode($post_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);

    // Tell the user post does not exist
    echo json_encode(array("message" => "Post does not exist."));
} 
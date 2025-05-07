<?php
// Initialize environment
require_once '../../init.php';

// Set content type
header("Content-Type: application/json; charset=UTF-8");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/Post.php';

try {
    // Instantiate database and post object
    $database = new Database();
    $db = $database->getConnection();

    // Initialize post object
    $post = new Post($db);

    // Query posts
    $stmt = $post->read();
    $num = $stmt->rowCount();

    // Check if any posts
    if($num > 0) {
        // Posts array
        $posts_arr = array();
        $posts_arr["records"] = array();

        // Retrieve table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Extract row
            extract($row);

            // Process tags (convert from JSON if stored as JSON)
            $tags_arr = [];
            if(isset($tags) && !empty($tags)) {
                // Check if tags is stored as JSON
                if(is_string($tags)) {
                    $decoded_tags = json_decode($tags, true);
                    if(json_last_error() === JSON_ERROR_NONE && is_array($decoded_tags)) {
                        $tags_arr = $decoded_tags;
                    } else {
                        // If not valid JSON, assume comma-separated string
                        $tags_arr = explode(',', $tags);
                    }
                } elseif(is_array($tags)) {
                    $tags_arr = $tags;
                }
            }

            $post_item = array(
                "id" => $id,
                "title" => $title,
                "content" => $content,
                "excerpt" => $excerpt,
                "author" => $author,
                "created_at" => $created_at,
                "category" => $category,
                "tags" => $tags_arr
            );

            array_push($posts_arr["records"], $post_item);
        }

        // Set response code - 200 OK
        http_response_code(200);

        // Show posts data in json format
        echo json_encode($posts_arr);
    } else {
        // Set response code - 200 OK with empty records
        http_response_code(200);

        // Return empty records array instead of 404
        echo json_encode(array("records" => array()));
    }
} catch (Exception $e) {
    // Set response code - 500 server error
    http_response_code(500);
    
    // Return error message
    echo json_encode(array(
        "message" => "Unable to retrieve posts.",
        "error" => $e->getMessage()
    ));
} 
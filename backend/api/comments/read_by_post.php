<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database and object files
include_once '../../config/Database.php';
include_once '../../models/Comment.php';
include_once '../../middleware/ClerkAuth.php';

// Instantiate database and comment object
$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

// Get post ID
$post_id = isset($_GET['post_id']) ? $_GET['post_id'] : die();

// Get parameters
$include_unapproved = isset($_GET['include_unapproved']) && $_GET['include_unapproved'] == 'true';

// Check if user is moderator (can see unapproved comments)
$can_see_unapproved = false;
$auth = new ClerkAuth();

if ($auth->isAuthenticated()) {
    $user = $auth->getCurrentUser();
    // Simplified role check - in a real app, check for moderator/admin role
    $can_see_unapproved = true; // For now, all authenticated users can see unapproved comments
}

// Only show approved comments to regular users
$only_approved = !($include_unapproved && $can_see_unapproved);

try {
    // Get comments for this post
    $stmt = $comment->getByPost($post_id, false, $only_approved); // Get top-level comments only
    $num = $stmt->rowCount();

    // Check if more than 0 record found
    if ($num > 0) {
        // Comments array
        $comments_arr = array();
        $comments_arr["records"] = array();

        // Build a nested structure with replies
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $comment_item = array(
                "id" => $id,
                "post_id" => $post_id,
                "user_id" => $user_id,
                "clerk_id" => $clerk_id,
                "author_name" => $author_name,
                "content" => $content,
                "parent_id" => $parent_id,
                "is_approved" => $is_approved,
                "created_at" => $created_at,
                "replies" => array()
            );

            // Get replies for this comment
            $reply_stmt = $comment->getReplies($id, $only_approved);
            
            while ($reply = $reply_stmt->fetch(PDO::FETCH_ASSOC)) {
                $comment_item["replies"][] = array(
                    "id" => $reply['id'],
                    "post_id" => $reply['post_id'],
                    "user_id" => $reply['user_id'],
                    "clerk_id" => $reply['clerk_id'],
                    "author_name" => $reply['author_name'],
                    "content" => $reply['content'],
                    "parent_id" => $reply['parent_id'],
                    "is_approved" => $reply['is_approved'],
                    "created_at" => $reply['created_at']
                );
            }

            // Add to comments array
            array_push($comments_arr["records"], $comment_item);
        }

        // Set response code - 200 OK
        http_response_code(200);

        // Return comments as JSON
        echo json_encode($comments_arr);
    } else {
        // No comments found
        http_response_code(200);

        // Return empty array
        echo json_encode(array("records" => array()));
    }
} catch (Exception $e) {
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
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

// Ensure user is authenticated
$auth = new ClerkAuth();
$user = $auth->requireAuth(); // This will exit with 401 if not authenticated

// Instantiate database and comment object
$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Check for required fields
if (
    empty($data->comment_id) ||
    empty($data->action)
) {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user
    echo json_encode(array("message" => "Unable to process request. Required fields are missing."));
    exit;
}

// Set comment ID
$comment->id = $data->comment_id;

try {
    // First check if comment exists
    if (!$comment->readOne()) {
        http_response_code(404);
        echo json_encode(array("message" => "Comment not found."));
        exit;
    }
    
    // Process the action
    switch ($data->action) {
        case 'approve':
            if ($comment->approve()) {
                http_response_code(200);
                echo json_encode(array("message" => "Comment approved."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to approve comment."));
            }
            break;
            
        case 'delete':
            if ($comment->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Comment deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete comment."));
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(array("message" => "Invalid action. Use 'approve' or 'delete'."));
            break;
    }
} catch (Exception $e) {
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
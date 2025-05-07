<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Initialize environment
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/UserProfile.php';
include_once '../../models/UserPreferences.php';
include_once '../../middleware/ClerkAuth.php';

// Check for preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check authentication
$auth = new ClerkAuth();
$user = $auth->getCurrentUser();

if (!$user) {
    // Set response code - 401 unauthorized
    http_response_code(401);
    
    // Tell the user
    echo json_encode(array("message" => "Unauthorized. Authentication required."));
    exit;
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate confirmation - require "DELETE" confirmation
if (empty($data) || empty($data->confirmation) || $data->confirmation !== "DELETE") {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user
    echo json_encode(array("message" => "Invalid confirmation. Please type 'DELETE' to confirm account deletion."));
    exit;
}

// Database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Begin transaction
    $db->beginTransaction();
    
    // 1. Delete user preferences
    $userPreferences = new UserPreferences($db);
    $userPreferences->clerk_id = $user['id'];
    $userPreferences->delete();
    
    // 2. Delete user profile
    $userProfile = new UserProfile($db);
    $userProfile->clerk_id = $user['id'];
    
    // Fetch the profile first to verify it exists
    if ($userProfile->getByClerkId()) {
        // Delete profile
        if ($userProfile->delete()) {
            // Commit transaction
            $db->commit();
            
            // Set response code - 200 success
            http_response_code(200);
            
            // Return success message
            echo json_encode(array(
                "message" => "Account deleted successfully.",
                "success" => true
            ));
        } else {
            // Rollback transaction
            $db->rollBack();
            
            // Set response code - 503 service unavailable
            http_response_code(503);
            
            // Tell the user
            echo json_encode(array("message" => "Unable to delete user profile."));
        }
    } else {
        // Rollback transaction
        $db->rollBack();
        
        // Set response code - 404 not found
        http_response_code(404);
        
        // Tell the user
        echo json_encode(array("message" => "User profile not found."));
    }
} catch (Exception $e) {
    // Rollback transaction if an error occurred
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
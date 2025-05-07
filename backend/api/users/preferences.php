<?php
// Initialize environment - handles CORS and other common setup
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/UserPreferences.php';
include_once '../../middleware/ClerkAuth.php';

// Check authentication
$auth = new ClerkAuth();
$auth->requireAuth(); // This will exit with 401 if not authenticated

// Get the authenticated user
$user = $auth->getCurrentUser();

if (!$user || !isset($user['id'])) {
    // Set response code - 401 unauthorized
    http_response_code(401);
    
    // Tell the user
    echo json_encode([
        "message" => "Unauthorized. Valid authentication required.",
        "error" => "invalid_user",
        "status" => 401
    ]);
    exit;
}

// Instantiate database and user preferences object
try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Database connection error",
        "error" => "db_connection_failed",
        "status" => 500
    ]);
    exit;
}

$userPreferences = new UserPreferences($db);

// Set clerk_id from authenticated user
$userPreferences->clerk_id = $user['id'];

try {
    // Try to get the user preferences
    if ($userPreferences->getByClerkId()) {
        // Get preferences data
        $preferences_data = [
            "id" => $userPreferences->id,
            "clerk_id" => $userPreferences->clerk_id,
            "theme" => $userPreferences->theme,
            "language" => $userPreferences->language,
            "auto_save" => (bool)$userPreferences->auto_save,
            "two_factor_enabled" => (bool)$userPreferences->two_factor_enabled,
            "created_at" => $userPreferences->created_at,
            "updated_at" => $userPreferences->updated_at
        ];
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Return preferences data as JSON
        echo json_encode($preferences_data);
    } else {
        // Create default preferences
        $userPreferences->clerk_id = $user['id'];
        $userPreferences->theme = "system";
        $userPreferences->language = "en";
        $userPreferences->auto_save = 1;
        $userPreferences->two_factor_enabled = 0;
        
        // Create the user preferences
        if ($userPreferences->create()) {
            // Get preferences data
            $preferences_data = [
                "id" => $userPreferences->id,
                "clerk_id" => $userPreferences->clerk_id,
                "theme" => $userPreferences->theme,
                "language" => $userPreferences->language,
                "auto_save" => (bool)$userPreferences->auto_save,
                "two_factor_enabled" => (bool)$userPreferences->two_factor_enabled,
                "created_at" => $userPreferences->created_at,
                "updated_at" => $userPreferences->updated_at
            ];
            
            // Set response code - 201 created
            http_response_code(201);
            
            // Return preferences data as JSON
            echo json_encode($preferences_data);
        } else {
            // Set response code - 500 service unavailable
            http_response_code(500);
            
            // Tell the user
            echo json_encode([
                "message" => "Unable to create user preferences",
                "error" => "preferences_creation_failed",
                "status" => 500
            ]);
        }
    }
} catch (Exception $e) {
    // Log the error for server-side debugging
    error_log("Preferences Error: " . $e->getMessage());
    
    // Set response code - 500 server error
    http_response_code(500);
    
    // Tell the user (without exposing sensitive error details)
    echo json_encode([
        "message" => "A server error occurred while processing your request",
        "error" => "server_error",
        "status" => 500
    ]);
} 
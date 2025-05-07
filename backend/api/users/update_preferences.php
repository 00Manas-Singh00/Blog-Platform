<?php
// Initialize environment - handles CORS and other common setup
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/UserPreferences.php';
include_once '../../middleware/ClerkAuth.php';

// Check authentication immediately
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

// Get posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate data
if (empty($data)) {
    // Set response code - 400 bad request
    http_response_code(400);
    
    // Tell the user
    echo json_encode([
        "message" => "No data provided",
        "error" => "missing_data",
        "status" => 400
    ]);
    exit;
}

// Validate data format
$validFields = ['theme', 'language', 'auto_save', 'two_factor_enabled'];
$validThemes = ['light', 'dark', 'system'];
$validLanguages = ['en', 'es', 'fr', 'de']; // Add more as needed

// Check if any invalid fields are provided
$invalidFields = array_diff(array_keys($data), $validFields);
if (!empty($invalidFields)) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid fields: " . implode(', ', $invalidFields),
        "error" => "invalid_fields",
        "status" => 400
    ]);
    exit;
}

// Validate theme
if (isset($data['theme']) && !in_array($data['theme'], $validThemes)) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid theme value. Allowed: " . implode(', ', $validThemes),
        "error" => "invalid_theme",
        "status" => 400
    ]);
    exit;
}

// Validate language
if (isset($data['language']) && !in_array($data['language'], $validLanguages)) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid language value. Allowed: " . implode(', ', $validLanguages),
        "error" => "invalid_language",
        "status" => 400
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
    // Try to get existing preferences first
    $prefExists = $userPreferences->getByClerkId();
    
    if (!$prefExists) {
        // If preferences don't exist, set defaults
        $userPreferences->theme = "system";
        $userPreferences->language = "en";
        $userPreferences->auto_save = 1;
        $userPreferences->two_factor_enabled = 0;
    }
    
    // Set properties from request data if provided
    if (isset($data['theme'])) {
        $userPreferences->theme = $data['theme'];
    }
    
    if (isset($data['language'])) {
        $userPreferences->language = $data['language'];
    }
    
    if (isset($data['auto_save'])) {
        $userPreferences->auto_save = $data['auto_save'] ? 1 : 0;
    }
    
    if (isset($data['two_factor_enabled'])) {
        $userPreferences->two_factor_enabled = $data['two_factor_enabled'] ? 1 : 0;
    }
    
    // Update or create the preferences
    $method = $prefExists ? 'update' : 'create';
    if ($userPreferences->$method()) {
        // Get updated preferences data
        $preferences_data = [
            "id" => $userPreferences->id,
            "clerk_id" => $userPreferences->clerk_id,
            "theme" => $userPreferences->theme,
            "language" => $userPreferences->language,
            "auto_save" => (bool)$userPreferences->auto_save,
            "two_factor_enabled" => (bool)$userPreferences->two_factor_enabled,
            "updated_at" => date('Y-m-d H:i:s')
        ];
        
        // Set response code
        http_response_code($prefExists ? 200 : 201);
        
        // Return updated preferences
        echo json_encode($preferences_data);
    } else {
        // Set response code - 500 server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode([
            "message" => "Unable to update preferences",
            "error" => "update_failed",
            "status" => 500
        ]);
    }
} catch (Exception $e) {
    // Log error for debugging
    error_log("Update Preferences Error: " . $e->getMessage());
    
    // Set response code - 500 server error
    http_response_code(500);
    
    // Tell the user (without exposing internal error details)
    echo json_encode([
        "message" => "A server error occurred while processing your request",
        "error" => "server_error",
        "status" => 500
    ]);
} 
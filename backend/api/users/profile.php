<?php
// Initialize environment
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/UserProfile.php';
include_once '../../middleware/ClerkAuth.php';

try {
    // Initialize auth middleware
    $auth = new ClerkAuth();

    // Require authentication
    $auth->requireAuth();

    // Get the current authenticated user
    $user = $auth->getCurrentUser();
    
    if (!$user || !isset($user['id'])) {
        http_response_code(401);
        echo json_encode(array("message" => "Unauthorized. User not found."));
        exit;
    }

    // Get database connection
    $database = new Database();
    $db = $database->getConnection();

    // Initialize user profile object
    $profile = new UserProfile($db);
    
    // GET request - Retrieve user profile
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Set Clerk ID from authenticated user
        $profile->clerk_id = $user['id'];
        
        // Try to get the profile
        if ($profile->getByClerkId()) {
            // Return profile data
            http_response_code(200);
            echo json_encode(array(
                "id" => $profile->id,
                "user_id" => $profile->user_id,
                "clerk_id" => $profile->clerk_id,
                "display_name" => $profile->display_name,
                "bio" => $profile->bio,
                "avatar_url" => $profile->avatar_url,
                "website" => $profile->website,
                "social_links" => json_decode($profile->social_links, true),
                "created_at" => $profile->created_at,
                "updated_at" => $profile->updated_at
            ));
        } else {
            // No profile found, return default profile with Clerk data
            $default_profile = array(
                "clerk_id" => $user['id'],
                "display_name" => isset($user['first_name']) && isset($user['last_name']) 
                    ? $user['first_name'] . ' ' . $user['last_name'] 
                    : (isset($user['username']) ? $user['username'] : ''),
                "avatar_url" => isset($user['image_url']) ? $user['image_url'] : '',
                "bio" => '',
                "website" => '',
                "social_links" => array(),
                "created_at" => null,
                "updated_at" => null
            );
            
            http_response_code(200);
            echo json_encode($default_profile);
        }
    }
    // POST request - Create or update user profile
    else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Check if JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON: " . json_last_error_msg()));
            exit;
        }
        
        // Set profile properties from request data
        $profile->clerk_id = $user['id'];
        $profile->user_id = isset($data->user_id) ? $data->user_id : $user['id'];
        $profile->display_name = isset($data->display_name) ? $data->display_name : '';
        $profile->bio = isset($data->bio) ? $data->bio : '';
        $profile->avatar_url = isset($data->avatar_url) ? $data->avatar_url : '';
        $profile->website = isset($data->website) ? $data->website : '';
        
        // Handle social links (convert to JSON)
        if (isset($data->social_links) && is_array($data->social_links)) {
            $profile->social_links = json_encode($data->social_links);
        } else {
            $profile->social_links = json_encode(array());
        }
        
        // Create or update the profile
        if ($profile->create()) {
            http_response_code(200);
            echo json_encode(array("message" => "Profile updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update profile."));
        }
    } else {
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
    }
} catch (Exception $e) {
    // Set response code - 500 server error
    http_response_code(500);
    
    // Return error message
    echo json_encode(array(
        "message" => "Server error while processing profile request.",
        "error" => $e->getMessage()
    ));
} 
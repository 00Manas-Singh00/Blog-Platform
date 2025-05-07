<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Initialize environment
require_once '../../init.php';

// Include database, object files and auth middleware
include_once '../../config/Database.php';
include_once '../../models/UserProfile.php';
include_once '../../middleware/ClerkAuth.php';

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

// Instantiate database and user profile object
$database = new Database();
$db = $database->getConnection();
$userProfile = new UserProfile($db);

// Set clerk_id from authenticated user
$userProfile->clerk_id = $user['id'];

try {
    // Try to get the user profile
    if ($userProfile->findByClerkId()) {
        // Get user data
        $user_data = array(
            "id" => $userProfile->id,
            "clerk_id" => $userProfile->clerk_id,
            "display_name" => $userProfile->display_name,
            "bio" => $userProfile->bio,
            "website" => $userProfile->website,
            "avatar_url" => $userProfile->avatar_url,
            "email" => $userProfile->email,
            "roles" => json_decode($userProfile->roles),
            "social_links" => json_decode($userProfile->social_links),
            "created_at" => $userProfile->created_at,
            "updated_at" => $userProfile->updated_at
        );
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Return user data as JSON
        echo json_encode($user_data);
    } else {
        // Create a new user profile with data from Clerk
        $userProfile->clerk_id = $user['id'];
        
        // Extract name from Clerk user data
        $display_name = "";
        if (isset($user['first_name']) && isset($user['last_name'])) {
            $display_name = $user['first_name'] . ' ' . $user['last_name'];
        } elseif (isset($user['username'])) {
            $display_name = $user['username'];
        } elseif (isset($user['email_addresses']) && !empty($user['email_addresses'])) {
            $display_name = $user['email_addresses'][0]['email'];
        }
        
        // Extract email from Clerk user data
        $email = "";
        if (isset($user['email_addresses']) && !empty($user['email_addresses'])) {
            $email = $user['email_addresses'][0]['email'];
        }
        
        // Extract avatar from Clerk user data
        $avatar_url = "";
        if (isset($user['image_url'])) {
            $avatar_url = $user['image_url'];
        }
        
        // Set user profile data
        $userProfile->display_name = $display_name;
        $userProfile->email = $email;
        $userProfile->avatar_url = $avatar_url;
        $userProfile->bio = "";
        $userProfile->website = "";
        $userProfile->roles = json_encode(["user"]); // Default role
        $userProfile->social_links = json_encode([]);
        
        // Create the user profile
        if ($userProfile->create()) {
            // Get user data
            $user_data = array(
                "id" => $userProfile->id,
                "clerk_id" => $userProfile->clerk_id,
                "display_name" => $userProfile->display_name,
                "bio" => $userProfile->bio,
                "website" => $userProfile->website,
                "avatar_url" => $userProfile->avatar_url,
                "email" => $userProfile->email,
                "roles" => json_decode($userProfile->roles),
                "social_links" => json_decode($userProfile->social_links),
                "created_at" => $userProfile->created_at,
                "updated_at" => $userProfile->updated_at
            );
            
            // Set response code - 201 created
            http_response_code(201);
            
            // Return user data as JSON
            echo json_encode($user_data);
        } else {
            // Set response code - 503 service unavailable
            http_response_code(503);
            
            // Tell the user
            echo json_encode(array("message" => "Unable to create user profile."));
        }
    }
} catch (Exception $e) {
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
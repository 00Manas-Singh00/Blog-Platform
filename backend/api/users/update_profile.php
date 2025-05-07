<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and object files
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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure clerk_id is set
$userProfile->clerk_id = $user['id'];

try {
    // First check if profile exists
    if (!$userProfile->findByClerkId()) {
        // Set response code - 404 not found
        http_response_code(404);
        
        // Tell the user
        echo json_encode(array("message" => "User profile not found."));
        exit;
    }
    
    // Set user profile data
    if (isset($data->display_name)) {
        $userProfile->display_name = $data->display_name;
    }
    
    if (isset($data->bio)) {
        $userProfile->bio = $data->bio;
    }
    
    if (isset($data->website)) {
        $userProfile->website = $data->website;
    }
    
    // Social links must be an array
    if (isset($data->social_links) && is_array($data->social_links)) {
        $userProfile->social_links = json_encode($data->social_links);
    }
    
    // Update the user profile
    if ($userProfile->update()) {
        // Get updated user data
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
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to update user profile."));
    }
} catch (Exception $e) {
    // Set response code - 503 service unavailable
    http_response_code(503);
    
    // Tell the user
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
} 
<?php
// Load environment variables
require_once __DIR__ . '/../config/env.php';

class ClerkAuth {
    private $clerk_api_key;
    private $jwt_verification_key;
    
    public function __construct() {
        // Set your Clerk API key from environment or configuration
        $this->clerk_api_key = getenv('CLERK_API_KEY') ?: 'your_clerk_api_key';
        $this->jwt_verification_key = getenv('CLERK_JWT_KEY') ?: 'your_clerk_jwt_verification_key';
    }
    
    /**
     * Get all HTTP headers
     * Polyfill for environments where getallheaders() isn't available
     */
    private function getAllHeaders() {
        if (function_exists('getallheaders')) {
            return getallheaders();
        }
        
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            } elseif ($name == 'CONTENT_TYPE') {
                $headers['Content-Type'] = $value;
            } elseif ($name == 'CONTENT_LENGTH') {
                $headers['Content-Length'] = $value;
            }
        }
        return $headers;
    }
    
    /**
     * Verify the Clerk JWT token
     * 
     * @return array|bool User data if valid, false otherwise
     */
    public function verifyToken() {
        // Get authorization header
        $headers = $this->getAllHeaders();
        $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Also check for lowercase header (some servers normalize this)
        if (empty($auth_header) && isset($headers['authorization'])) {
            $auth_header = $headers['authorization'];
        }
        
        // Check if token exists
        if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            return false;
        }
        
        $token = $matches[1];
        
        // For development, you can use a simple verification
        // In production, properly verify the JWT signature using the Clerk JWT verification key
        try {
            // Make a request to Clerk API to verify the session
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.clerk.dev/v1/sessions/verify');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $this->clerk_api_key,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'token' => $token
            ]));
            
            $response = curl_exec($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($status_code === 200) {
                $data = json_decode($response, true);
                return $data;
            }
            
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * Get the current user from the Clerk token
     * 
     * @return array|bool User data if valid, false otherwise
     */
    public function getCurrentUser() {
        $session = $this->verifyToken();
        
        if (!$session || !isset($session['user_id'])) {
            return false;
        }
        
        try {
            // Get user data from Clerk API
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.clerk.dev/v1/users/' . $session['user_id']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $this->clerk_api_key,
                'Content-Type: application/json'
            ]);
            
            $response = curl_exec($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($status_code === 200) {
                $user = json_decode($response, true);
                return $user;
            }
            
            // If we can't get user details, at least return the session data
            // which contains user_id
            return $session;
        } catch (Exception $e) {
            error_log('Clerk Error: ' . $e->getMessage());
            // Return the session data if we can't get user details
            return $session;
        }
    }
    
    /**
     * Check if user is authenticated
     * 
     * @return bool True if authenticated, false otherwise
     */
    public function isAuthenticated() {
        return $this->verifyToken() !== false;
    }
    
    /**
     * Require authentication for a route
     * Sends 401 response if not authenticated
     * 
     * @return bool True if authenticated, exits otherwise
     */
    public function requireAuth() {
        if (!$this->isAuthenticated()) {
            // Set response code - 401 Unauthorized
            http_response_code(401);
            
            // Tell the user
            echo json_encode(array("message" => "Unauthorized. Authentication required."));
            exit;
        }
        
        return true;
    }
} 
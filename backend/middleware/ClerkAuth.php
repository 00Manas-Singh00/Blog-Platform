<?php
// Load environment variables
require_once __DIR__ . '/../config/env.php';

class ClerkAuth {
    private $clerk_api_key;
    private $jwt_verification_key;
    private $frontend_api;
    private $cache = [];
    
    public function __construct() {
        // Set your Clerk API key from environment or configuration
        $this->clerk_api_key = getenv('CLERK_API_KEY') ?: '';
        $this->jwt_verification_key = getenv('CLERK_JWT_KEY') ?: '';
        $this->frontend_api = getenv('CLERK_FRONTEND_API') ?: 'clerk.your-site.com';
        
        if (empty($this->clerk_api_key)) {
            error_log('Warning: CLERK_API_KEY is not set in environment variables');
        }
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
     * Get token from Authorization header
     * 
     * @return string|null The token or null if not found
     */
    private function getTokenFromHeader() {
        // Get authorization header
        $headers = $this->getAllHeaders();
        $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Also check for lowercase header (some servers normalize this)
        if (empty($auth_header) && isset($headers['authorization'])) {
            $auth_header = $headers['authorization'];
        }
        
        // Check if token exists
        if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            return null;
        }
        
        return $matches[1];
    }
    
    /**
     * Verify the Clerk JWT token
     * 
     * @return array|bool User data if valid, false otherwise
     */
    public function verifyToken() {
        $token = $this->getTokenFromHeader();
        
        if (!$token) {
            return false;
        }
        
        // Use cache to avoid multiple API calls for the same token
        if (isset($this->cache[$token])) {
            return $this->cache[$token];
        }
        
        // Check environment - in development, we might want to allow all tokens
        if (getenv('ENVIRONMENT') === 'development' && getenv('BYPASS_AUTH') === 'true') {
            // Simple JWT decoding without verification
            $token_parts = explode('.', $token);
            if (count($token_parts) === 3) {
                $payload = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', $token_parts[1]))), true);
                
                if ($payload && isset($payload['sub'])) {
                    // Cache the result
                    $this->cache[$token] = [
                        'user_id' => $payload['sub'],
                        'expires_at' => isset($payload['exp']) ? $payload['exp'] : time() + 3600
                    ];
                    
                    return $this->cache[$token];
                }
            }
        }
        
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
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            
            $response = curl_exec($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curl_error = curl_error($ch);
            curl_close($ch);
            
            if ($curl_error) {
                error_log('Clerk API Error: ' . $curl_error);
                return false;
            }
            
            if ($status_code === 200) {
                $data = json_decode($response, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    error_log('JSON Parse Error: ' . json_last_error_msg());
                    return false;
                }
                
                // Cache the result
                $this->cache[$token] = $data;
                return $data;
            }
            
            error_log('Clerk API Error: Status code ' . $status_code . ', Response: ' . $response);
            return false;
        } catch (Exception $e) {
            error_log('Clerk API Exception: ' . $e->getMessage());
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
        
        // Check if we have cached the user data
        $cache_key = 'user_' . $session['user_id'];
        if (isset($this->cache[$cache_key])) {
            return $this->cache[$cache_key];
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
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            
            $response = curl_exec($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curl_error = curl_error($ch);
            curl_close($ch);
            
            if ($curl_error) {
                error_log('Clerk API Error: ' . $curl_error);
                // Return the session data if we can't get user details
                return $session;
            }
            
            if ($status_code === 200) {
                $user = json_decode($response, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    error_log('JSON Parse Error: ' . json_last_error_msg());
                    return $session;
                }
                
                // Cache the user data
                $this->cache[$cache_key] = $user;
                return $user;
            }
            
            error_log('Clerk API Error: Status code ' . $status_code . ', Response: ' . $response);
            // Return the session data if we can't get user details
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
            echo json_encode(array(
                "message" => "Unauthorized. Authentication required.",
                "error" => "auth_required",
                "status" => 401
            ));
            exit;
        }
        
        return true;
    }
} 
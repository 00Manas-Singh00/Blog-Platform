<?php
/**
 * Initialize backend environment
 */

// Enable error reporting during development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Load environment variables
require_once __DIR__ . '/config/env.php';

// Set default timezone
date_default_timezone_set('UTC');

// Configure CORS
function configureHeaders() {
    // Get allowed origins from environment
    $allowedOrigins = getenv('CORS_ALLOWED_ORIGINS') ? explode(',', getenv('CORS_ALLOWED_ORIGINS')) : ['*'];
    
    // Get the origin header
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Allow requests from the allowed origins, or any origin if '*' is in the list
    if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    
    // Add other CORS headers
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // 24 hours

    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('HTTP/1.1 204 No Content');
        exit(0);
    }
}

// Apply CORS configuration
configureHeaders();

// Handle JSON requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && 
    strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    // Convert JSON input to $_POST for easier access
    $_POST = json_decode(file_get_contents('php://input'), true) ?: [];
}

// Set content type to JSON for API responses
header('Content-Type: application/json; charset=UTF-8');

// Ensure all PHP files start with this script to maintain consistent environment 
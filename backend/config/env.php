<?php
/**
 * Environment Configuration
 */

// Database Configuration
putenv("DB_HOST=localhost");
putenv("DB_NAME=blog_platform");
putenv("DB_USER=root");
putenv("DB_PASS=");

// Clerk Authentication
putenv("CLERK_API_KEY=test_clerk_api_key");
putenv("CLERK_JWT_KEY=test_clerk_jwt_key");

// API Configuration
putenv("API_URL=http://localhost:8000/api");

// Environment (development, production)
putenv("ENVIRONMENT=development");

/**
 * Simple .env file loader for PHP
 */
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse environment setting
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if they exist
        if (strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1) {
            $value = substr($value, 1, -1);
        } elseif (strpos($value, "'") === 0 && strrpos($value, "'") === strlen($value) - 1) {
            $value = substr($value, 1, -1);
        }
        
        // Set environment variable
        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
    
    return true;
}

// Load environment variables from .env file
$envPath = dirname(__DIR__) . '/.env';
loadEnv($envPath);
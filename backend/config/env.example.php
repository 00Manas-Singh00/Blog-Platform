<?php
/**
 * Environment Configuration - Example File
 * 
 * Copy this file to 'env.php' and update the values with your actual configuration
 */

// Database Configuration
putenv("DB_HOST=localhost");
putenv("DB_NAME=blog_platform");
putenv("DB_USER=root");
putenv("DB_PASS=");

// Clerk Authentication
putenv("CLERK_API_KEY=your_clerk_api_key");
putenv("CLERK_JWT_KEY=your_clerk_jwt_verification_key");

// API Configuration
putenv("API_URL=http://localhost:8000/api");

// Environment (development, production)
putenv("ENVIRONMENT=development"); 
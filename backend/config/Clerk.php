<?php
// Clerk API configuration
return [
    'api_key' => getenv('CLERK_API_KEY') ?: 'your_clerk_api_key',
    'jwt_key' => getenv('CLERK_JWT_KEY') ?: 'your_clerk_jwt_verification_key',
    'frontend_api' => getenv('CLERK_FRONTEND_API') ?: 'your_clerk_frontend_api',
    'publishable_key' => getenv('CLERK_PUBLISHABLE_KEY') ?: 'your_clerk_publishable_key'
]; 
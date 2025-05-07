<?php
/**
 * PHP Development Server Starter
 * 
 * This script starts a PHP development server for the blog platform
 */

$host = '127.0.0.1';
$port = 8000;
$root = __DIR__ . '/../';

echo "Starting PHP development server at http://{$host}:{$port}/\n";
echo "Document root: {$root}\n";
echo "Press Ctrl+C to stop the server\n\n";

// Construct the command to start the server
$command = sprintf(
    'php -S %s:%d -t %s',
    escapeshellarg($host),
    $port,
    escapeshellarg($root)
);

// Execute the command
system($command); 
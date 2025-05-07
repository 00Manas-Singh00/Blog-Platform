<?php
/**
 * Database setup script for Blog Platform
 * 
 * This script initializes the database and creates all necessary tables
 */

// Load environment
require_once __DIR__ . '/../config/env.php';

// Get database credentials from environment
$host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'blog_platform';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';

try {
    // Connect to MySQL server without selecting a database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    echo "Database '$db_name' created or already exists.\n";
    
    // Select the database
    $pdo->exec("USE `$db_name`");
    
    // Create posts table
    $postsTable = "
    CREATE TABLE IF NOT EXISTS `posts` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `title` varchar(255) NOT NULL,
      `content` text NOT NULL,
      `excerpt` text DEFAULT NULL,
      `author` varchar(100) DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      `category` varchar(100) DEFAULT NULL,
      `tags` text DEFAULT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ";
    $pdo->exec($postsTable);
    echo "Table 'posts' created or already exists.\n";
    
    // Create user_profiles table
    $userProfilesTable = "
    CREATE TABLE IF NOT EXISTS `user_profiles` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` varchar(255) NOT NULL,
      `clerk_id` varchar(255) NOT NULL,
      `display_name` varchar(100) DEFAULT NULL,
      `bio` text DEFAULT NULL,
      `avatar_url` varchar(255) DEFAULT NULL,
      `website` varchar(255) DEFAULT NULL,
      `social_links` text DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (`id`),
      UNIQUE KEY `clerk_id` (`clerk_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ";
    $pdo->exec($userProfilesTable);
    echo "Table 'user_profiles' created or already exists.\n";
    
    // Create user_preferences table
    $userPreferencesTable = "
    CREATE TABLE IF NOT EXISTS `user_preferences` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `clerk_id` varchar(255) NOT NULL,
      `theme` varchar(50) DEFAULT 'system',
      `language` varchar(10) DEFAULT 'en',
      `auto_save` tinyint(1) DEFAULT 1,
      `two_factor_enabled` tinyint(1) DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (`id`),
      UNIQUE KEY `clerk_id` (`clerk_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ";
    $pdo->exec($userPreferencesTable);
    echo "Table 'user_preferences' created or already exists.\n";
    
    // Create categories table
    $categoriesTable = "
    CREATE TABLE IF NOT EXISTS `categories` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `name` varchar(100) NOT NULL,
      `slug` varchar(100) NOT NULL,
      `description` text DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`),
      UNIQUE KEY `slug` (`slug`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ";
    $pdo->exec($categoriesTable);
    echo "Table 'categories' created or already exists.\n";
    
    // Insert sample data for posts
    $sample_posts = "
    INSERT INTO `posts` (`title`, `content`, `excerpt`, `author`, `category`, `tags`) VALUES
    ('Getting Started with React', 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called \"components\".', 'Learn the basics of React and how to create your first component.', 'Jane Doe', 'Frontend', '[\"React\", \"JavaScript\", \"Web Development\"]'),
    ('PHP REST API Best Practices', 'Building a REST API with PHP requires attention to several details including authentication, routing, and error handling.', 'Learn how to build secure and scalable REST APIs with PHP.', 'John Smith', 'Backend', '[\"PHP\", \"API\", \"REST\"]'),
    ('Styling with CSS-in-JS', 'CSS-in-JS libraries allow you to write CSS directly in your JavaScript code. This approach offers several benefits like scoped styling.', 'Modern approaches to styling your React applications.', 'Alex Johnson', 'Design', '[\"CSS\", \"React\", \"Styling\"]')
    ";
    
    // Check if posts table is empty before inserting sample data
    $count = $pdo->query("SELECT COUNT(*) FROM `posts`")->fetchColumn();
    if ($count == 0) {
        $pdo->exec($sample_posts);
        echo "Sample posts added.\n";
    } else {
        echo "Posts table already has data, skipping sample data insertion.\n";
    }
    
    echo "Database setup completed successfully.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
} 
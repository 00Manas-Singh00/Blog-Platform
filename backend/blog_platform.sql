-- Create database
CREATE DATABASE IF NOT EXISTS blog_platform;
USE blog_platform;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (username),
    UNIQUE KEY (email)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (name)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2y$10$YourHashedPasswordHere', 'admin@example.com');

-- Insert some default categories
INSERT INTO categories (name, description) VALUES 
('Frontend', 'Articles about frontend development'),
('Backend', 'Articles about backend development'),
('Design', 'Articles about UI/UX design');

-- Insert some sample posts
INSERT INTO posts (title, content, excerpt, author, category, tags) VALUES 
('Getting Started with React', 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called \"components\". React has a few different kinds of components, but we\'ll start with React.Component subclasses.', 'Learn the basics of React and how to create your first component.', 'Jane Doe', 'Frontend', '["React", "JavaScript", "Web Development"]'),
('PHP REST API Best Practices', 'Building a REST API with PHP requires attention to several details. This post covers authentication, routing, response formatting, error handling, and more to help you build robust and secure APIs.', 'Learn how to build secure and scalable REST APIs with PHP.', 'John Smith', 'Backend', '["PHP", "API", "REST"]'),
('Styling with CSS-in-JS', 'CSS-in-JS libraries allow you to write CSS directly in your JavaScript code. This approach offers several benefits like scoped styling, dynamic styling based on props, and more. This post explores the popular libraries and how to use them effectively.', 'Modern approaches to styling your React applications.', 'Alex Johnson', 'Design', '["CSS", "React", "Styling"]'); 
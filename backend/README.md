# Blog Platform Backend

A PHP-based RESTful API for the Blog Platform.

## Setup Instructions

1. **Database Setup**:
   - Create a MySQL database
   - Import the `blog_platform.sql` file to set up the schema and sample data
   - Update the database credentials in `config/Database.php`

2. **Server Requirements**:
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Apache/Nginx with mod_rewrite enabled

3. **Running the API**:
   - Place the backend folder in your web server's document root
   - Access the API at `http://localhost/backend/`

## API Endpoints

### Posts
- **GET** `/api/posts/read.php` - Get all posts
- **GET** `/api/posts/read_one.php?id=:id` - Get a single post by ID
- **POST** `/api/posts/create.php` - Create a new post
- **PUT** `/api/posts/update.php` - Update an existing post
- **DELETE** `/api/posts/delete.php` - Delete a post

### Categories
- **GET** `/api/categories/read.php` - Get all categories
- **POST** `/api/categories/create.php` - Create a new category

### Users
- **POST** `/api/users/login.php` - User login
- **POST** `/api/users/register.php` - User registration

## Authentication

The API uses a simple token-based authentication system. When a user logs in successfully, a token is generated and returned in the response. This token should be included in subsequent requests that require authentication by adding it to the Authorization header:

```
Authorization: Bearer {token}
```

## Request Examples

### Login
```json
POST /api/users/login.php
{
  "username": "admin",
  "password": "admin123"
}
```

### Create Post
```json
POST /api/posts/create.php
{
  "title": "New Post Title",
  "content": "Post content goes here...",
  "author": "John Doe",
  "category": "Technology",
  "tags": ["PHP", "API", "Tutorial"]
}
``` 
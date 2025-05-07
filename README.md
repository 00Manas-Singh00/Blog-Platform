# Blog Platform

A full-stack blog platform with React frontend and PHP backend, integrated with Clerk for authentication.

## Project Structure

- **frontend**: React-based frontend with responsive UI
- **backend**: PHP RESTful API for data management

## Features

- User authentication via Clerk
- Create, read, update, and delete blog posts
- Category management
- Responsive UI with smooth animations
- Protected admin routes

## Getting Started

### Prerequisites

- Node.js (v14+)
- PHP (v7.4+)
- MySQL (v5.7+)
- Web server (Apache/Nginx)

### Setting up the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Clerk authentication (see [CLERK_SETUP.md](CLERK_SETUP.md))

4. Start the development server:
   ```
   npm run dev
   ```

### Setting up the Backend

1. Set up a virtual host pointing to the `backend` directory

2. Import the database schema:
   ```
   mysql -u username -p < backend/blog_platform.sql
   ```

3. Update database credentials in `backend/config/Database.php`

4. Set up Clerk authentication keys (see [CLERK_SETUP.md](CLERK_SETUP.md))

## Authentication

This project uses [Clerk](https://clerk.com/) for authentication. See [CLERK_SETUP.md](CLERK_SETUP.md) for setup instructions.

## API Documentation

API endpoints are documented in `backend/README.md`.

## License

MIT 
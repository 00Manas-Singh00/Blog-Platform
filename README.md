# BlogZilla - Modern Blog Platform

<p align="center">
  <img src="frontend/public/logo.png" alt="BlogZilla Logo" width="200">
</p>

<p align="center">
  A modern, feature-rich blog platform built with a React frontend and PHP/MySQL backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/PHP-7.4+-purple?logo=php" alt="PHP 7.4+">
  <img src="https://img.shields.io/badge/MySQL-5.7+-orange?logo=mysql" alt="MySQL 5.7+">
  <img src="https://img.shields.io/badge/Clerk-Auth-green?logo=clerk" alt="Clerk Auth">
  <img src="https://img.shields.io/badge/Vite-6-yellow?logo=vite" alt="Vite 6">
</p>

## ✨ Features

- **Beautiful, Responsive UI**
  - Modern design with clean typography
  - Dark/light mode support
  - Mobile-first approach with responsive layouts
  - Glassmorphism effects and animations

- **Authentication & User Management**
  - Secure authentication with [Clerk](https://clerk.com/)
  - User profile management
  - Role-based access control
  - Development bypass mode for testing

- **Rich Content Management**
  - Create, edit, and delete blog posts
  - Rich text editor with formatting options
  - Image uploads and management
  - Draft saving and publishing workflow

- **Content Organization**
  - Categories and tagging system
  - Search functionality
  - Related posts suggestions
  - Featured posts section

- **Social Features**
  - Comments and replies
  - Social sharing options
  - Author profiles
  - User engagement metrics

- **Developer-Friendly**
  - Comprehensive error handling
  - Mock data mode for frontend development
  - Clean API structure
  - Extensive documentation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Navigation and routing
- **Framer Motion** - Animations
- **CSS Variables** - Theming
- **Clerk** - Authentication
- **Axios** - API requests
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **PHP 7.4+** - Server-side logic
- **MySQL/MariaDB** - Database
- **PDO** - Database access layer
- **JWT** - Token authentication
- **REST API** - Backend architecture

## 📋 Prerequisites

- PHP 7.4+ with PDO extension
- MySQL 5.7+ or MariaDB 10.2+
- Node.js 16+ and npm
- [Clerk](https://clerk.com/) account (for authentication)

## 🚀 Installation

### Backend Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/blog-platform.git
   cd blog-platform
   ```

2. Configure environment variables:
   ```bash
   cd backend
   cp config/env.example.php config/env.php
   ```
   Edit `env.php` with your database credentials and Clerk API keys.

3. Set up the database:
   ```bash
   php scripts/setup_database.php
   ```
   Alternatively, import the `blog_platform.sql` file into your MySQL database.

4. Start the development server:
   ```bash
   php scripts/start_server.php
   ```
   The backend server will run at http://localhost:8000

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Clerk publishable key and API URL.

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run at http://localhost:5173 (or another port if 5173 is in use)

## 💻 Development

### Frontend Development with Mock Data

The frontend is configured to work with mock data when the backend is not available or during development:

1. Mock data is enabled by default in `frontend/src/services/api.js`
2. The system includes sample posts, categories, and users
3. All API operations (GET, POST, PUT, DELETE) are simulated
4. To use real backend data, set `USE_MOCK_DATA = false` in the API service

### Authentication Development Mode

For easier development without requiring Clerk authentication:

1. The system includes a development bypass for authentication
2. Enable dev mode in the configuration to skip Clerk verification
3. The dev mode provides a mock login interface for testing
4. **Important:** Always disable dev mode in production

## 🔒 Authentication

This project uses Clerk for authentication. Refer to [CLERK_SETUP.md](CLERK_SETUP.md) for detailed setup instructions, including:

- Creating a Clerk account
- Setting up API keys
- Configuring JWT verification
- Securing backend endpoints
- Troubleshooting authentication issues

## 📝 API Documentation

### Endpoints

The API follows RESTful conventions with these main endpoints:

#### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/{id}` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get posts by category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/{id}` - Update a category
- `DELETE /api/categories/{id}` - Delete a category

#### Comments
- `GET /api/comments/post/{postId}` - Get comments for a post
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/{id}` - Update a comment
- `DELETE /api/comments/{id}` - Delete a comment

#### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

For more detailed API documentation, see `backend/README.md`.

## 🎨 UI Customization

The application uses CSS variables for theming, allowing easy customization:

- Light/dark mode switching
- Accent color changes
- Typography modifications
- Spacing and layout adjustments

All theme variables are defined in `frontend/src/index.css`.

## 📱 Responsive Design

The platform is fully responsive, with optimized layouts for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

Responsive behaviors include:
- Flexible grid layouts
- Mobile navigation menu
- Adapted typography
- Optimized image sizing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com)

---

<p align="center">
  Made with ❤️ by [Your Name/Team]
</p> 
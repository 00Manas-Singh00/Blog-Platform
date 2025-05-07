# Blog Platform

A modern blog platform built with PHP backend and React frontend, featuring Clerk authentication.

## Project Structure

- `backend/`: PHP backend with REST API endpoints
- `frontend/`: React frontend application

## Setup Instructions

### Prerequisites

- PHP 7.4+ with PDO extension
- MySQL or MariaDB
- Node.js 14+ and npm

### Backend Setup

1. Configure environment variables:

```bash
cd backend
cp config/env.example.php config/env.php
```

Edit `env.php` with your database credentials and Clerk API keys.

2. Set up the database:

```bash
php scripts/setup_database.php
```

3. Start the development server:

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

## Features

- User authentication with Clerk
- User profile management
- Blog post creation, editing, and deletion
- Categories and tagging system
- Responsive design
- Error handling and loading states
- Development mode with mock data

## Development

### Frontend Development with Mock Data

The frontend is configured to work with mock data when the backend is not available or during development:

1. Mock data is enabled by default in `frontend/src/services/api.js`
2. The system includes sample posts, categories, and users
3. All API operations (GET, POST, PUT, DELETE) are simulated
4. To use real backend data, set `USE_MOCK_DATA = false` in the API service

### Error Handling

The application implements proper error handling:

1. API errors are caught and displayed to users
2. Loading states are shown during data fetching
3. Authentication errors are handled gracefully
4. Form validation errors are displayed to users

## Authentication

This project uses Clerk for authentication. Refer to [CLERK_SETUP.md](CLERK_SETUP.md) for detailed setup instructions.

## API Documentation

API endpoints are documented in `backend/README.md`.

## License

MIT 
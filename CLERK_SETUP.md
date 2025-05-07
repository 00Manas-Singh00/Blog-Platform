# Clerk Authentication Setup

This project uses [Clerk](https://clerk.com/) for authentication and user management. Follow these steps to set up Clerk for both the frontend and backend.

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com/) and sign up for an account
2. Create a new application in Clerk's dashboard
3. Set up your sign-in and sign-up methods as needed

## 2. Get your API Keys

From your Clerk dashboard:
1. Go to "API Keys" section
2. Copy your "Publishable Key" for frontend usage
3. Copy your "Secret Key" for backend usage

## 3. Frontend Configuration

1. Create a `.env` file in the `frontend` directory with the following:

```
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

2. Restart your frontend development server to apply the changes

## 4. Backend Configuration

1. Create a `.env` file in the `backend` directory with the following:

```
CLERK_API_KEY=your_clerk_api_key 
CLERK_JWT_KEY=your_clerk_jwt_verification_key
```

## 5. Customize Clerk UI (Optional)

You can customize the Clerk UI components by:

1. Modifying the CSS variables in `frontend/src/pages/Login.css`
2. Using Clerk's customization options in your Clerk dashboard

## 6. Securing Backend Endpoints

The backend API endpoints are secured using Clerk authentication. Each secure endpoint:

1. Uses the `ClerkAuth` middleware
2. Verifies the JWT token from the request
3. Only allows authorized requests to proceed

## 7. Troubleshooting

If you encounter authentication issues:

1. Make sure your Clerk keys are correctly configured
2. Check that tokens are being properly passed in the Authorization header
3. Verify that your Clerk application settings align with your application requirements

## 8. Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK Documentation](https://clerk.com/docs/reference/clerk-react) 
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
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:8000/api
```

2. Restart your frontend development server to apply the changes

## 4. Backend Configuration

1. Create a `.env` file in the `backend` directory with the following:

```
CLERK_API_KEY=your_clerk_api_key 
CLERK_JWT_KEY=your_clerk_jwt_verification_key

# Database Configuration
DB_HOST=localhost
DB_NAME=blog_platform
DB_USER=root
DB_PASS=
```

## 5. Configure JWT Verification

For proper security in production:

1. Go to your Clerk Dashboard
2. Navigate to JWT Templates
3. Copy the "JWKS endpoint URL" and update your environment with it
4. Update the backend to use proper JWT verification with the JWKS endpoint

## 6. Customize Clerk UI (Optional)

You can customize the Clerk UI components by:

1. Modifying the CSS variables in `frontend/src/pages/Login.css`
2. Using Clerk's customization options in your Clerk dashboard

## 7. Securing Backend Endpoints

The backend API endpoints are secured using Clerk authentication. Each secure endpoint:

1. Uses the `ClerkAuth` middleware
2. Verifies the JWT token from the request
3. Only allows authorized requests to proceed

## 8. Troubleshooting

### Common Issues and Solutions

#### Authentication Errors in Frontend
- **Issue**: Authentication errors or failing to render protected components properly
- **Solution**: 
  1. Check that you've imported and wrapped your components correctly:
     ```jsx
     import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
     
     // Properly wrap with SignedIn/SignedOut
     <SignedIn>
       <ProtectedComponent />
     </SignedIn>
     <SignedOut>
       <RedirectToSignIn />
     </SignedOut>
     ```
  2. Use the `ClerkLoading` and `ClerkLoaded` components to handle loading states:
     ```jsx
     <ClerkLoading>
       <div className="loading-screen">Loading...</div>
     </ClerkLoading>
     <ClerkLoaded>
       <YourComponent />
     </ClerkLoaded>
     ```
  3. Check for error states with a try-catch in authentication functions:
     ```jsx
     try {
       // Auth operation
       await signIn(); 
     } catch (err) {
       console.error("Authentication error:", err);
       // Handle error appropriately
     }
     ```

#### Mock Data for Development
- **Issue**: Needing to test frontend without backend auth
- **Solution**: Set up mock data in your API service with `USE_MOCK_DATA = true` during development

1. **Token not being passed to backend:**
   - Check that you're using the correct method to get the token with `useAuth()` hook
   - Ensure API calls include the Authorization header with the token

2. **CORS errors:**
   - Make sure your backend has proper CORS headers (these are set in init.php)
   - Check that your frontend is sending the correct preflight OPTIONS requests

3. **Authentication failing unexpectedly:**
   - Verify your Clerk API keys are correct
   - Check if your token is expired
   - Look for browser console errors related to Clerk

4. **Environment variables not loading:**
   - For frontend: Check that variables start with `VITE_` prefix
   - For backend: Ensure the .env file is in the correct location and readable

### Debug Tips

1. Add console logs in the frontend when retrieving tokens:
   ```javascript
   const token = await getToken();
   console.log('Auth token:', token.substring(0, 10) + '...');
   ```

2. Enable PHP error logging in your backend:
   ```php
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```

## 9. Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK Documentation](https://clerk.com/docs/reference/clerk-react)
- [JWT Verification Guide](https://clerk.com/docs/backend-integration/jwt-verification)
- [Authentication Errors Troubleshooting](https://clerk.com/docs/troubleshooting/authentication-errors) 
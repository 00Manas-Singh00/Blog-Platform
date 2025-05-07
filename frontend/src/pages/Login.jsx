import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

// Development mode setting (same as in AuthContext.jsx)
const DEV_MODE_BYPASS_AUTH = true;

const Login = () => {
  const navigate = useNavigate();
  
  // Function to bypass login in development mode
  const handleDevLogin = () => {
    console.log('Development mode login - bypassing authentication');
    navigate('/profile');
  };
  
  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Log in to your account</h1>
      <p>Sign in to create and manage your blog posts</p>
      
      {DEV_MODE_BYPASS_AUTH ? (
        <div className="dev-login-container">
          <div className="dev-login-notice">
            <p>Development Mode Active</p>
            <p>You can bypass authentication and use the mock profile</p>
          </div>
          <button 
            className="dev-login-button"
            onClick={handleDevLogin}
          >
            Login as Test User
          </button>
          <div className="dev-login-links">
            <Link to="/profile">Go to Profile</Link>
            <Link to="/my-posts">My Posts</Link>
            <Link to="/admin">Admin Panel</Link>
          </div>
        </div>
      ) : (
        <div className="clerk-auth-container">
          <SignIn 
            routing="path" 
            path="/login"
            signUpUrl="/register"
            redirectUrl="/"
          />
        </div>
      )}
    </motion.div>
  );
};

export default Login; 
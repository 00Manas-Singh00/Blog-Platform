import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing the login styles

// Development mode setting (same as in AuthContext.jsx)
const DEV_MODE_BYPASS_AUTH = true;

const Register = () => {
  const navigate = useNavigate();
  
  // Function to bypass registration in development mode
  const handleDevRegister = () => {
    console.log('Development mode registration - bypassing authentication');
    navigate('/profile');
  };
  
  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Create a new account</h1>
      <p>Sign up to start creating and sharing your blog posts</p>
      
      {DEV_MODE_BYPASS_AUTH ? (
        <div className="dev-login-container">
          <div className="dev-login-notice">
            <p>Development Mode Active</p>
            <p>You can bypass registration and use the mock profile</p>
          </div>
          <button 
            className="dev-login-button"
            onClick={handleDevRegister}
          >
            Register Test Account
          </button>
          <div className="dev-login-links">
            <Link to="/login">Back to Login</Link>
            <Link to="/">Go to Home</Link>
          </div>
        </div>
      ) : (
        <div className="clerk-auth-container">
          <SignUp 
            routing="path" 
            path="/register"
            signInUrl="/login"
            redirectUrl="/"
          />
        </div>
      )}
    </motion.div>
  );
};

export default Register;

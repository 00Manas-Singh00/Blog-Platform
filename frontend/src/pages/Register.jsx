import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import './Login.css'; // Reusing the same CSS

const Register = () => {
  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Create a new account</h1>
      <p>Sign up to start creating your own blog posts</p>
      <div className="clerk-auth-container">
        <SignUp 
          routing="path" 
          path="/register"
          signInUrl="/login"
          redirectUrl="/"
        />
      </div>
    </motion.div>
  );
};

export default Register;

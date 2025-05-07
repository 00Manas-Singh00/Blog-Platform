import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiUser, FiLogIn, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi';
import { useUser, useClerk } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle signing out
  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink to="/">
            BlogPlatform
          </NavLink>
        </motion.div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-toggle">
          {mobileMenuOpen ? (
            <FiX onClick={() => setMobileMenuOpen(false)} />
          ) : (
            <FiMenu onClick={() => setMobileMenuOpen(true)} />
          )}
        </div>

        {/* Desktop & Mobile Navigation */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className="nav-link">
            <FiHome className="nav-icon" />
            <span>All Posts</span>
          </NavLink>
          <NavLink to="/categories" className="nav-link">
            <FiFolder className="nav-icon" />
            <span>Categories</span>
          </NavLink>
          
          {isSignedIn ? (
            <>
              <NavLink to="/admin" className="nav-link">
                <FiUser className="nav-icon" />
                <span>Admin</span>
              </NavLink>
              <NavLink to="/profile" className="nav-link">
                <FiSettings className="nav-icon" />
                <span>Profile</span>
              </NavLink>
              <div onClick={handleSignOut} className="nav-link">
                <FiLogOut className="nav-icon" />
                <span>Logout</span>
              </div>
              <div className="user-profile">
                {user?.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt={user?.fullName || user?.username || 'User'} 
                    className="profile-image"
                  />
                )}
                <span>{user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              <FiLogIn className="nav-icon" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 
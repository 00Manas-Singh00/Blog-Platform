import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiFolder, 
  FiUser, 
  FiLogIn, 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiSettings, 
  FiMessageSquare,
  FiEdit,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi';
import { useClerk } from '@clerk/clerk-react';
import { useAppAuth } from '../services/AuthContext';
import SearchBar from './SearchBar';
import './Navbar.css';

// Development mode setting (same as in AuthContext.jsx)
const DEV_MODE_BYPASS_AUTH = true;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { signOut } = useClerk();
  const { isSignedIn, userProfile, isAdmin, isAuthor } = useAppAuth();
  const menuRef = useRef(null);

  // Check if authenticated (either via Clerk or dev mode)
  const isAuthenticated = isSignedIn || DEV_MODE_BYPASS_AUTH;

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

  // Check for mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      const mobileBreakpoint = 640; // Changed from 768px to 640px
      setIsMobile(window.innerWidth <= mobileBreakpoint);
      console.log('Is mobile:', window.innerWidth <= mobileBreakpoint);
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Log window width for debugging
  useEffect(() => {
    const handleResize = () => {
      console.log('Window width:', window.innerWidth);
      console.log('Mobile menu should be visible:', window.innerWidth <= 640);
    };

    // Initial log
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.classList.contains('mobile-menu-toggle') &&
          !event.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle signing out
  const handleSignOut = () => {
    if (DEV_MODE_BYPASS_AUTH) {
      console.log('Development mode: Simulating sign out');
      window.location.href = '/login';
      return;
    }
    
    if (signOut) {
      signOut();
    }
  };

  // Menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
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
            <FiLayers className="logo-icon" />
            BlogZilla
          </NavLink>
        </motion.div>

        {/* Search Bar */}
        <SearchBar />

        {/* Mobile menu toggle - only show on mobile */}
        {isMobile && (
          <div 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              position: 'relative',
              zIndex: 1000
            }}
          >
            <div className="burger-menu">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        )}

        {/* Desktop Navigation - hide on mobile */}
        <div className={`navbar-links desktop-links ${isMobile ? 'hidden' : ''}`}>
          <NavLink to="/" className="nav-link" end>
            <FiHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/categories" className="nav-link">
            <FiFolder className="nav-icon" />
            <span>Categories</span>
          </NavLink>
          
          {isAuthenticated && (
            <>
              {(isAuthor || DEV_MODE_BYPASS_AUTH) && (
                <NavLink to="/my-posts" className="nav-link">
                  <FiBookOpen className="nav-icon" />
                  <span>My Posts</span>
                </NavLink>
              )}
              
              {(isAuthor || DEV_MODE_BYPASS_AUTH) && (
                <NavLink to="/edit" className="nav-link create-post-link">
                  <FiEdit className="nav-icon" />
                  <span>Create Post</span>
                </NavLink>
              )}
            </>
          )}
          
          {!isAuthenticated && (
            <NavLink to="/login" className="nav-link login-link">
              <FiLogIn className="nav-icon" />
              <span>Login</span>
            </NavLink>
          )}
          
          {isAuthenticated && (
            <div className="user-profile">
              {userProfile?.avatar_url && (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile?.display_name || 'User'} 
                  className="profile-image"
                />
              )}
              <span>{userProfile?.display_name || 'User'}</span>
              {DEV_MODE_BYPASS_AUTH && (
                <span className="dev-mode-badge">Dev</span>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && isMobile && (
            <motion.div 
              className="mobile-menu" 
              ref={menuRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-title">Menu</div>
                <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                  <FiX />
                </button>
              </div>
              
              {isAuthenticated && (
                <div className="mobile-user-profile">
                  {userProfile?.avatar_url && (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile?.display_name || 'User'} 
                      className="profile-image"
                    />
                  )}
                  <div className="user-info">
                    <div className="user-name">{userProfile?.display_name || 'User'}</div>
                    <div className="user-email">{userProfile?.email || 'user@example.com'}</div>
                  </div>
                  {DEV_MODE_BYPASS_AUTH && (
                    <span className="dev-mode-badge mobile">Dev</span>
                  )}
                </div>
              )}
              
              <div className="mobile-menu-content">
                <motion.div variants={menuItemVariants}>
                  <NavLink to="/" className="mobile-nav-link" end onClick={() => setMobileMenuOpen(false)}>
                    <FiHome className="nav-icon" />
                    <span>Home</span>
                  </NavLink>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <NavLink to="/categories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <FiFolder className="nav-icon" />
                    <span>Categories</span>
                  </NavLink>
                </motion.div>
                
                {isAuthenticated ? (
                  <>
                    <div className="mobile-menu-section">
                      <div className="section-title">Content</div>
                      
                      {(isAuthor || DEV_MODE_BYPASS_AUTH) && (
                        <motion.div variants={menuItemVariants}>
                          <NavLink to="/my-posts" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiBookOpen className="nav-icon" />
                            <span>My Posts</span>
                          </NavLink>
                        </motion.div>
                      )}
                      
                      {(isAuthor || DEV_MODE_BYPASS_AUTH) && (
                        <motion.div variants={menuItemVariants}>
                          <NavLink to="/edit" className="mobile-nav-link highlight" onClick={() => setMobileMenuOpen(false)}>
                            <FiEdit className="nav-icon" />
                            <span>Create Post</span>
                          </NavLink>
                        </motion.div>
                      )}
                      
                      {(isAdmin || DEV_MODE_BYPASS_AUTH) && (
                        <motion.div variants={menuItemVariants}>
                          <NavLink to="/comments/moderate" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiMessageSquare className="nav-icon" />
                            <span>Comments</span>
                          </NavLink>
                        </motion.div>
                      )}
                    </div>
                    
                    {(isAdmin || DEV_MODE_BYPASS_AUTH) && (
                      <div className="mobile-menu-section">
                        <div className="section-title">Admin</div>
                        <motion.div variants={menuItemVariants}>
                          <NavLink to="/admin" className="mobile-nav-link admin" onClick={() => setMobileMenuOpen(false)}>
                            <FiSettings className="nav-icon" />
                            <span>Admin Panel</span>
                          </NavLink>
                        </motion.div>
                      </div>
                    )}
                    
                    <div className="mobile-menu-section">
                      <div className="section-title">Account</div>
                      <motion.div variants={menuItemVariants}>
                        <NavLink to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                          <FiUser className="nav-icon" />
                          <span>Profile</span>
                        </NavLink>
                      </motion.div>
                      
                      <motion.div variants={menuItemVariants}>
                        <div onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="mobile-nav-link logout">
                          <FiLogOut className="nav-icon" />
                          <span>Logout</span>
                        </div>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <motion.div variants={menuItemVariants}>
                    <NavLink to="/login" className="mobile-nav-link highlight" onClick={() => setMobileMenuOpen(false)}>
                      <FiLogIn className="nav-icon" />
                      <span>Login</span>
                    </NavLink>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar; 
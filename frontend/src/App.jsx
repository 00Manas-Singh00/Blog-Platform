import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUser, SignedIn, SignedOut, RedirectToSignIn, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { useAppAuth } from './services/AuthContext';
import { ThemeProvider } from './services/ThemeContext';
import { LanguageProvider } from './services/LanguageContext';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Categories from './pages/Categories';
import MyPosts from './pages/MyPosts';
import PostEditor from './pages/PostEditor';
import SearchResults from './pages/SearchResults';

// Dev mode setting (same as in AuthContext.jsx)
const DEV_MODE_BYPASS_AUTH = true;

// Layout component with animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<Categories />} />
        
        <Route
          path="/admin"
          element={
            <>
              {DEV_MODE_BYPASS_AUTH ? (
                <AdminPanel />
              ) : (
                <>
                  <SignedIn>
                    <AdminPanel />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              )}
            </>
          }
        />
        
        <Route
          path="/edit/:postId?"
          element={
            <>
              {DEV_MODE_BYPASS_AUTH ? (
                <PostEditor />
              ) : (
                <>
                  <SignedIn>
                    <PostEditor />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              )}
            </>
          }
        />
        
        <Route
          path="/my-posts"
          element={
            <>
              {DEV_MODE_BYPASS_AUTH ? (
                <MyPosts />
              ) : (
                <>
                  <SignedIn>
                    <MyPosts />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              )}
            </>
          }
        />
        
        <Route
          path="/profile"
          element={
            <>
              {DEV_MODE_BYPASS_AUTH ? (
                <UserProfile />
              ) : (
                <>
                  <SignedIn>
                    <UserProfile />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              )}
            </>
          }
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <ClerkLoading>
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Loading authentication...</p>
            </div>
          </ClerkLoading>
          
          <ClerkLoaded>
            <Navbar />
            <main className="main-container">
              <AnimatedRoutes />
            </main>
          </ClerkLoaded>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App

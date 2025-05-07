import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from './api';

// Enable this for development testing without Clerk authentication
const DEV_MODE_BYPASS_AUTH = true;

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [authToken, setAuthToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the token when the user is signed in
  useEffect(() => {
    const setupAuthToken = async () => {
      if (isSignedIn || DEV_MODE_BYPASS_AUTH) {
        try {
          // In dev mode, create a fake token
          if (DEV_MODE_BYPASS_AUTH) {
            console.log('⚠️ DEV MODE: Bypassing authentication');
            const fakeToken = 'dev_mode_fake_token';
            setAuthToken(fakeToken);
            api.setAuthToken(fakeToken);
          } else {
            const token = await getToken();
            setAuthToken(token);
            api.setAuthToken(token);
          }
        } catch (err) {
          console.error('Error getting auth token:', err);
          setError('Failed to authenticate with server');
        }
      } else {
        setAuthToken(null);
        api.clearAuthToken();
      }
    };

    if (isLoaded || DEV_MODE_BYPASS_AUTH) {
      setupAuthToken();
    }
  }, [isSignedIn, isLoaded, getToken]);

  // Fetch user profile when authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authToken && !DEV_MODE_BYPASS_AUTH) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getUserProfile();
        
        if (response.data) {
          setUserProfile(response.data);
        } else {
          // Create a default profile based on Clerk user data or mock data
          const defaultProfile = {
            clerk_id: DEV_MODE_BYPASS_AUTH ? 'dev_user_id' : user?.id,
            display_name: DEV_MODE_BYPASS_AUTH ? 'Test User' : (user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress),
            email: DEV_MODE_BYPASS_AUTH ? 'test@example.com' : user?.primaryEmailAddress?.emailAddress,
            avatar_url: DEV_MODE_BYPASS_AUTH ? 'https://randomuser.me/api/portraits/men/1.jpg' : user?.imageUrl,
            bio: '',
            website: '',
            social_links: [],
            roles: ['author'] // Add default author role
          };
          setUserProfile(defaultProfile);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authToken, user]);

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!userProfile || !userProfile.roles) return false;
    return userProfile.roles.includes(role);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!authToken) return null;

    try {
      const response = await api.updateUserProfile(profileData);
      if (response.data) {
        setUserProfile({
          ...userProfile,
          ...response.data
        });
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    isSignedIn,
    authToken,
    userProfile,
    loading,
    error,
    hasRole,
    updateProfile,
    isAdmin: hasRole('admin'),
    isAuthor: hasRole('author') || hasRole('admin')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/backend/api';

class UserSettingsService {
  // Helper method to handle API responses
  async handleResponse(response) {
    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      
      // Create error with relevant information
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      
      throw error;
    }
    
    return await response.json();
  }
  
  // Get the current user's preferences
  async getPreferences(token) {
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    try {
      const response = await fetch(`${API_URL}/users/preferences.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }
  
  // Update user preferences
  async updatePreferences(token, preferences) {
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    try {
      const response = await fetch(`${API_URL}/users/update_preferences.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences),
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
  
  // Delete user account
  async deleteAccount(token, confirmation) {
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    if (!confirmation) {
      throw new Error('Confirmation is required to delete your account');
    }
    
    try {
      const response = await fetch(`${API_URL}/users/delete_account.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ confirmation }),
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

// Custom hook to use user settings service with authentication
export const useUserSettings = () => {
  const { getToken, signOut, isSignedIn } = useAuth();
  const settingsService = new UserSettingsService();
  
  // Helper method to handle authentication errors
  const handleAuthError = async (error) => {
    // If we get a 401 Unauthorized, the token might be expired
    if (error.status === 401) {
      // Attempt to sign out the user
      try {
        await signOut();
        window.location.href = '/login'; // Redirect to login page
      } catch (logoutError) {
        console.error('Error signing out:', logoutError);
        window.location.href = '/login'; // Still redirect to login page
      }
    }
    
    throw error;
  };
  
  return {
    getPreferences: async () => {
      try {
        if (!isSignedIn) {
          throw new Error('User is not signed in');
        }
        
        const token = await getToken();
        return await settingsService.getPreferences(token);
      } catch (error) {
        return handleAuthError(error);
      }
    },
    
    updatePreferences: async (preferences) => {
      try {
        if (!isSignedIn) {
          throw new Error('User is not signed in');
        }
        
        const token = await getToken();
        return await settingsService.updatePreferences(token, preferences);
      } catch (error) {
        return handleAuthError(error);
      }
    },
    
    deleteAccount: async (confirmation) => {
      try {
        if (!isSignedIn) {
          throw new Error('User is not signed in');
        }
        
        const token = await getToken();
        const result = await settingsService.deleteAccount(token, confirmation);
        
        // If account deletion was successful, sign out the user
        if (result.success) {
          try {
            await signOut();
          } catch (logoutError) {
            console.error('Error signing out after account deletion:', logoutError);
          }
        }
        
        return result;
      } catch (error) {
        return handleAuthError(error);
      }
    }
  };
};

export default UserSettingsService; 
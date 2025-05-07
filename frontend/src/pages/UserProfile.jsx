import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiLock, FiSettings, FiEdit3, FiExternalLink, FiCheck } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
import { useUserSettings } from '../services/UserSettingsService';
import AccountSettings from '../components/AccountSettings';
import NotificationSettings from '../components/NotificationSettings';
import PrivacySettings from '../components/PrivacySettings';
import ProfileSkeleton from '../components/ProfileSkeleton';
import './UserProfile.css';

// Function to get proper icon for social platforms
const getSocialIcon = (platform) => {
  // Here we would use the appropriate icon for each platform
  // For simplicity, we're using FiExternalLink for all
  return <FiExternalLink />;
};

const UserProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const userSettings = useUserSettings();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    website: '',
    social_links: []
  });
  
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [privacySettings, setPrivacySettings] = useState(null);
  const [accountSettings, setAccountSettings] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user profile and settings
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && isSignedIn) {
        try {
          setLoading(true);
          
          // For this demo, we're using mock data for the profile
          // In a real app, this would come from your API
          const profileData = {
            display_name: user.fullName || user.username,
            bio: "Frontend developer passionate about creating intuitive and beautiful user interfaces.",
            website: "https://myportfolio.dev",
            social_links: [
              { platform: "GitHub", url: "https://github.com/username" },
              { platform: "Twitter", url: "https://twitter.com/username" }
            ]
          };
          
          setUserProfile(profileData);
          
          // Try to load user preferences from backend
          try {
            const preferences = await userSettings.getPreferences();
            
            setAccountSettings({
              language: preferences.language || 'en',
              theme: preferences.theme || 'light',
              auto_save: preferences.auto_save || false,
              two_factor_auth: preferences.two_factor_enabled || false
            });
          } catch (preferencesError) {
            console.error('Error loading preferences:', preferencesError);
            // Use defaults if preferences can't be loaded
            setAccountSettings({
              language: 'en',
              theme: 'light',
              auto_save: true,
              two_factor_auth: false
            });
          }
          
          // Sample notification settings (would come from API)
          setNotificationSettings({
            email_notifications: {
              new_comments: true,
              comment_replies: true,
              post_likes: true,
              newsletter: false
            },
            site_notifications: {
              new_comments: true,
              comment_replies: true,
              post_likes: true,
              system_announcements: true
            }
          });
          
          // Sample privacy settings (would come from API)
          setPrivacySettings({
            profile_visibility: 'public',
            show_email: false,
            show_social_links: true,
            allow_comments: true,
            comment_approval: false
          });
          
        } catch (err) {
          setError('Failed to load user profile');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [isLoaded, isSignedIn, user, userSettings]);
  
  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        bio: userProfile.bio || '',
        website: userProfile.website || '',
        social_links: userProfile.social_links || []
      });
    }
  }, [userProfile]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle social link changes
  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.social_links];
    
    if (!updatedLinks[index]) {
      updatedLinks[index] = { platform: '', url: '' };
    }
    
    updatedLinks[index][field] = value;
    
    setFormData({
      ...formData,
      social_links: updatedLinks
    });
  };
  
  // Add new social link
  const addSocialLink = () => {
    setFormData({
      ...formData,
      social_links: [...formData.social_links, { platform: '', url: '' }]
    });
  };
  
  // Remove social link
  const removeSocialLink = (index) => {
    const updatedLinks = [...formData.social_links];
    updatedLinks.splice(index, 1);
    
    setFormData({
      ...formData,
      social_links: updatedLinks
    });
  };
  
  // Save profile changes
  const saveProfileChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Update profile (in a real app, this would be an API call)
      const updatedProfile = { ...userProfile, ...formData };
      setUserProfile(updatedProfile);
      setIsEditing(false);
      
      // Show success message or notification
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel profile editing
  const cancelEditing = () => {
    // Reset form data to original values
    setFormData({
      display_name: userProfile.display_name || '',
      bio: userProfile.bio || '',
      website: userProfile.website || '',
      social_links: userProfile.social_links || []
    });
    
    setIsEditing(false);
  };
  
  // Generic function to update profile data
  const updateProfile = async (data) => {
    // This would be an API call in a real app
    console.log('Updating profile with:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  };
  
  // Mock function for account deletion
  const deleteUserAccount = async () => {
    console.log('Deleting account...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  };
  
  // Handle notification settings save
  const handleNotificationSettingsSave = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update notification settings
      setNotificationSettings(settings);
      
      // In a real app, you would save these immediately
      // For this demo, we'll save them with the rest of the profile
      await updateProfile({ notification_settings: settings });
      
      // Show success message or notification
    } catch (err) {
      setError('Failed to update notification settings: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle privacy settings save
  const handlePrivacySettingsSave = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update privacy settings
      setPrivacySettings(settings);
      
      // In a real app, you would save these immediately
      // For this demo, we'll save them with the rest of the profile
      await updateProfile({ privacy_settings: settings });
      
      // Show success message or notification
    } catch (err) {
      setError('Failed to update privacy settings: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account settings save
  const handleAccountSettingsSave = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update account settings locally
      setAccountSettings(settings);
      
      // Update preferences through the API
      await userSettings.updatePreferences({
        theme: settings.theme,
        language: settings.language,
        auto_save: settings.auto_save,
        two_factor_enabled: settings.two_factor_auth
      });
      
      // Show success message or notification
    } catch (err) {
      setError('Failed to update account settings: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async (result) => {
    try {
      if (result && result.success) {
        // Redirect to homepage or logout page
        window.location.href = '/';
      }
    } catch (err) {
      setError('Failed to delete account: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };
  
  if (!isLoaded) {
    return <ProfileSkeleton />;
  }
  
  if (!isSignedIn) {
    return (
      <div className="error-container">
        <h2>Authentication Required</h2>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="user-profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>My Profile</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser /> Profile
        </button>
        <button 
          className={`profile-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell /> Notifications
        </button>
        <button 
          className={`profile-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <FiLock /> Privacy
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings /> Account Settings
        </button>
      </div>
      
      {loading && activeTab === 'profile' ? (
        <ProfileSkeleton />
      ) : (
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="user-info">
              <div className="profile-header">
                <div className="profile-avatar-section">
                  <img 
                    src={user?.imageUrl || "https://via.placeholder.com/100"} 
                    alt="User Avatar" 
                    className="profile-avatar"
                  />
                  {isEditing && (
                    <button className="change-avatar-btn">
                      Change Avatar
                    </button>
                  )}
                </div>
                
                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button className="cancel-edit-btn" onClick={cancelEditing}>
                        Cancel
                      </button>
                      <button className="save-profile-btn" onClick={saveProfileChanges}>
                        <FiCheck /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                      <FiEdit3 /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Name</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Your name"
                  />
                ) : (
                  <p>{userProfile?.display_name || user?.fullName || user?.username}</p>
                )}
              </div>
              
              <div className="profile-section">
                <h3>Bio</h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="profile-textarea"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p>{userProfile?.bio || "No bio provided yet."}</p>
                )}
              </div>
              
              <div className="profile-section">
                <h3>Website</h3>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p>
                    {userProfile?.website ? (
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        {userProfile.website} <FiExternalLink />
                      </a>
                    ) : (
                      "No website provided yet."
                    )}
                  </p>
                )}
              </div>
              
              <div className="profile-section">
                <h3>Social Links</h3>
                {isEditing ? (
                  <div className="social-links-editor">
                    {formData.social_links.map((link, index) => (
                      <div key={index} className="social-link-form">
                        <div className="social-inputs">
                          <input
                            type="text"
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                            placeholder="Platform (e.g. Twitter)"
                            className="social-platform-input"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                            placeholder="URL"
                            className="social-url-input"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="remove-social-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="add-social-btn"
                    >
                      Add Social Link
                    </button>
                  </div>
                ) : (
                  <div className="social-links">
                    {userProfile?.social_links && userProfile.social_links.length > 0 ? (
                      userProfile.social_links.map((link, index) => (
                        <a 
                          key={index} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          {getSocialIcon(link.platform)}
                          <span>{link.platform}</span>
                        </a>
                      ))
                    ) : (
                      <p className="no-data">No social links provided yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <NotificationSettings 
          initialSettings={notificationSettings}
          onSave={handleNotificationSettingsSave}
        />
      )}
      
      {activeTab === 'privacy' && (
        <PrivacySettings 
          initialSettings={privacySettings}
          onSave={handlePrivacySettingsSave}
        />
      )}
      
      {activeTab === 'settings' && (
        <AccountSettings 
          initialSettings={accountSettings}
          onSave={handleAccountSettingsSave}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </motion.div>
  );
};

export default UserProfile; 
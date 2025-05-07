import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FiEdit, FiSave, FiX, FiExternalLink, FiGithub, FiTwitter, FiLinkedin, FiFacebook, FiInstagram } from 'react-icons/fi';
import { getUserProfile, updateUserProfile } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    website: '',
    social_links: []
  });
  
  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        
        // Initialize form data
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          website: data.website || '',
          social_links: data.social_links || []
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Create fallback profile data if fetch fails
        const fallbackProfile = {
          display_name: user?.fullName || user?.username || '',
          bio: '',
          website: '',
          social_links: [],
          clerk_id: user?.id
        };
        setProfile(fallbackProfile);
        setFormData(fallbackProfile);
        setError('Failed to load profile from server. Using local data instead.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
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
    const updatedLinks = formData.social_links.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      social_links: updatedLinks
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      // Clean social links (remove empty ones)
      const cleanedLinks = formData.social_links.filter(
        link => link.platform && link.url
      );
      
      const updatedProfile = {
        ...formData,
        social_links: cleanedLinks
      };
      
      await updateUserProfile(updatedProfile);
      
      // Update the profile state
      setProfile({
        ...profile,
        ...updatedProfile
      });
      
      // Exit edit mode
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Cancel edit mode
  const handleCancel = () => {
    // Reset form data to current profile
    setFormData({
      display_name: profile.display_name || '',
      bio: profile.bio || '',
      website: profile.website || '',
      social_links: profile.social_links || []
    });
    setEditMode(false);
  };
  
  // Get social media icon
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <FiTwitter />;
      case 'github': return <FiGithub />;
      case 'linkedin': return <FiLinkedin />;
      case 'facebook': return <FiFacebook />;
      case 'instagram': return <FiInstagram />;
      default: return <FiExternalLink />;
    }
  };
  
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="profile-error">{error}</div>;
  }
  
  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="profile-header">
        <h1>My Profile</h1>
        {!editMode ? (
          <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
            <FiEdit /> Edit Profile
          </button>
        ) : (
          <div className="edit-controls">
            <button 
              className="cancel-btn" 
              onClick={handleCancel}
              disabled={saveLoading}
            >
              <FiX /> Cancel
            </button>
            <button 
              className="save-btn" 
              onClick={handleSubmit}
              disabled={saveLoading}
            >
              <FiSave /> {saveLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
      
      <div className="profile-content">
        <div className="profile-avatar">
          <img 
            src={user?.imageUrl || 'https://i.pravatar.cc/150?img=68'} 
            alt={user?.fullName || "User"} 
          />
        </div>
        
        {/* View Mode */}
        {!editMode && (
          <div className="profile-details">
            <h2>{profile?.display_name || user?.fullName || user?.username}</h2>
            <p className="profile-email">{user?.primaryEmailAddress?.emailAddress}</p>
            
            {profile?.bio && (
              <div className="profile-bio">
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}
            
            {profile?.website && (
              <div className="profile-website">
                <h3>Website</h3>
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website} <FiExternalLink />
                </a>
              </div>
            )}
            
            {profile?.social_links?.length > 0 && (
              <div className="profile-social">
                <h3>Connect</h3>
                <div className="social-links">
                  {profile.social_links.map((link, index) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Edit Mode */}
        {editMode && (
          <div className="profile-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="display_name">Display Name</label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="How should we call you?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Social Links</label>
                {formData.social_links.map((link, index) => (
                  <div key={index} className="social-link-form">
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    >
                      <option value="">Select Platform</option>
                      <option value="twitter">Twitter</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="https://"
                    />
                    <button 
                      type="button" 
                      className="remove-link-btn"
                      onClick={() => removeSocialLink(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-link-btn"
                  onClick={addSocialLink}
                >
                  Add Social Link
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile; 
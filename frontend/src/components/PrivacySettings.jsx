import React, { useState } from 'react';
import { FiLock, FiCheck, FiInfo } from 'react-icons/fi';
import './PrivacySettings.css';

const PrivacySettings = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings || {
    profile_visibility: 'public', // public, registered_users, private
    show_email: false,
    show_social_links: true,
    allow_comments: true,
    comment_approval: false
  });
  
  // Handle radio change
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle save
  const handleSave = () => {
    onSave(settings);
  };
  
  return (
    <div className="privacy-settings">
      <div className="privacy-header">
        <FiLock className="privacy-icon" />
        <h3>Privacy Settings</h3>
      </div>
      
      <div className="privacy-info">
        <FiInfo className="info-icon" />
        <p>
          Control who can see your profile information and how your content is shared
          on the platform.
        </p>
      </div>
      
      <div className="privacy-section">
        <h4>Profile Visibility</h4>
        <div className="privacy-options">
          <div className="privacy-option">
            <label className="radio-label">
              <input 
                type="radio" 
                name="profile_visibility" 
                value="public" 
                checked={settings.profile_visibility === 'public'} 
                onChange={handleRadioChange}
              />
              <div className="radio-text">
                <span className="option-title">Public</span>
                <span className="option-description">
                  Anyone can view your profile, including non-registered visitors.
                </span>
              </div>
            </label>
          </div>
          
          <div className="privacy-option">
            <label className="radio-label">
              <input 
                type="radio" 
                name="profile_visibility" 
                value="registered_users" 
                checked={settings.profile_visibility === 'registered_users'} 
                onChange={handleRadioChange}
              />
              <div className="radio-text">
                <span className="option-title">Registered Users Only</span>
                <span className="option-description">
                  Only users who are logged in can view your profile.
                </span>
              </div>
            </label>
          </div>
          
          <div className="privacy-option">
            <label className="radio-label">
              <input 
                type="radio" 
                name="profile_visibility" 
                value="private" 
                checked={settings.profile_visibility === 'private'} 
                onChange={handleRadioChange}
              />
              <div className="radio-text">
                <span className="option-title">Private</span>
                <span className="option-description">
                  Only you and site administrators can view your full profile.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="privacy-section">
        <h4>Profile Information</h4>
        <div className="privacy-options">
          <div className="privacy-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                name="show_email" 
                checked={settings.show_email} 
                onChange={handleCheckboxChange}
              />
              <span className="toggle-switch"></span>
              <span>Show my email address on my public profile</span>
            </label>
          </div>
          
          <div className="privacy-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                name="show_social_links" 
                checked={settings.show_social_links} 
                onChange={handleCheckboxChange}
              />
              <span className="toggle-switch"></span>
              <span>Show my social media links on my public profile</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="privacy-section">
        <h4>Comments & Interactions</h4>
        <div className="privacy-options">
          <div className="privacy-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                name="allow_comments" 
                checked={settings.allow_comments} 
                onChange={handleCheckboxChange}
              />
              <span className="toggle-switch"></span>
              <span>Allow comments on my posts</span>
            </label>
          </div>
          
          <div className="privacy-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                name="comment_approval" 
                checked={settings.comment_approval} 
                onChange={handleCheckboxChange}
              />
              <span className="toggle-switch"></span>
              <span>Require my approval before comments appear on my posts</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="privacy-actions">
        <button className="save-privacy-btn" onClick={handleSave}>
          <FiCheck /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings; 
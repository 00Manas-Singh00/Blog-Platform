import React, { useState } from 'react';
import { FiBell, FiCheck, FiInfo } from 'react-icons/fi';
import './NotificationSettings.css';

const NotificationSettings = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings || {
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
  
  // Handle toggle change
  const handleToggleChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  // Handle save
  const handleSave = () => {
    onSave(settings);
  };
  
  return (
    <div className="notification-settings">
      <div className="notification-header">
        <FiBell className="notification-icon" />
        <h3>Notification Preferences</h3>
      </div>
      
      <div className="notification-info">
        <FiInfo className="info-icon" />
        <p>
          Customize how and when you receive notifications. Your email address for 
          notifications is <strong>{initialSettings?.email || 'your primary email'}</strong>.
        </p>
      </div>
      
      <div className="notification-section">
        <h4>Email Notifications</h4>
        <div className="notification-options">
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.email_notifications.new_comments} 
                onChange={() => handleToggleChange('email_notifications', 'new_comments')}
              />
              <span className="toggle-switch"></span>
              <span>New comments on your posts</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.email_notifications.comment_replies} 
                onChange={() => handleToggleChange('email_notifications', 'comment_replies')}
              />
              <span className="toggle-switch"></span>
              <span>Replies to your comments</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.email_notifications.post_likes} 
                onChange={() => handleToggleChange('email_notifications', 'post_likes')}
              />
              <span className="toggle-switch"></span>
              <span>Likes on your posts</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.email_notifications.newsletter} 
                onChange={() => handleToggleChange('email_notifications', 'newsletter')}
              />
              <span className="toggle-switch"></span>
              <span>Weekly newsletter and updates</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="notification-section">
        <h4>Site Notifications</h4>
        <div className="notification-options">
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.site_notifications.new_comments} 
                onChange={() => handleToggleChange('site_notifications', 'new_comments')}
              />
              <span className="toggle-switch"></span>
              <span>New comments on your posts</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.site_notifications.comment_replies} 
                onChange={() => handleToggleChange('site_notifications', 'comment_replies')}
              />
              <span className="toggle-switch"></span>
              <span>Replies to your comments</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.site_notifications.post_likes} 
                onChange={() => handleToggleChange('site_notifications', 'post_likes')}
              />
              <span className="toggle-switch"></span>
              <span>Likes on your posts</span>
            </label>
          </div>
          
          <div className="notification-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.site_notifications.system_announcements} 
                onChange={() => handleToggleChange('site_notifications', 'system_announcements')}
              />
              <span className="toggle-switch"></span>
              <span>System announcements</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="notification-actions">
        <button className="save-notifications-btn" onClick={handleSave}>
          <FiCheck /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings; 
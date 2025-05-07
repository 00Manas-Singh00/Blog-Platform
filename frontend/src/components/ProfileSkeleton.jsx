import React from 'react';
import './ProfileSkeleton.css';

const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
      </div>
      
      <div className="skeleton-tabs">
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-avatar-section">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-name"></div>
        </div>
        
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-text-block"></div>
        </div>
        
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-text-block"></div>
        </div>
        
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-links">
            <div className="skeleton-link"></div>
            <div className="skeleton-link"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 
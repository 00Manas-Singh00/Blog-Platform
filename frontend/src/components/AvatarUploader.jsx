import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import './AvatarUploader.css';

const AvatarUploader = ({ currentAvatar, onAvatarChange, onCancel }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  // Handle file
  const handleFile = (file) => {
    if (!file) return;
    
    // Reset error
    setError(null);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle save
  const handleSave = () => {
    if (previewUrl) {
      onAvatarChange(previewUrl);
    }
  };
  
  return (
    <div className="avatar-uploader">
      <div className="avatar-preview-container">
        <div className="current-avatar">
          <h4>Current Avatar</h4>
          {currentAvatar ? (
            <img src={currentAvatar} alt="Current avatar" className="avatar-image" />
          ) : (
            <div className="no-avatar">No Avatar</div>
          )}
        </div>
        
        <div className="new-avatar">
          <h4>New Avatar</h4>
          {previewUrl ? (
            <img src={previewUrl} alt="New avatar preview" className="avatar-image" />
          ) : (
            <div className="no-avatar">No Preview</div>
          )}
        </div>
      </div>
      
      <div 
        className={`avatar-drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/gif, image/webp"
          className="file-input"
        />
        <FiUpload className="upload-icon" />
        <p>Click or drag image to upload</p>
        <span className="file-requirements">JPEG, PNG, GIF or WEBP (max. 2MB)</span>
      </div>
      
      {error && <div className="upload-error">{error}</div>}
      
      <div className="avatar-actions">
        <button className="cancel-avatar-btn" onClick={onCancel}>
          <FiX /> Cancel
        </button>
        <button 
          className="save-avatar-btn" 
          onClick={handleSave} 
          disabled={!previewUrl}
        >
          <FiCheck /> Save Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarUploader; 
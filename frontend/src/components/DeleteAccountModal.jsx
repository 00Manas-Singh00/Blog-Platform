import React, { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText === 'DELETE' && isChecked) {
      onConfirm();
    }
  };
  
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <FiAlertTriangle className="delete-modal-icon" />
          <h2>Delete Your Account</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="delete-modal-content">
          <p className="delete-warning">
            This action <strong>cannot be undone</strong>. This will permanently delete your account
            and remove all your data from our servers.
          </p>
          
          <div className="delete-consequences">
            <h3>What will be deleted:</h3>
            <ul>
              <li>All your blog posts and drafts</li>
              <li>All your comments and replies</li>
              <li>Your personal information and profile</li>
              <li>Your notification and privacy settings</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="delete-confirm-form">
            <div className="confirm-input-group">
              <label htmlFor="confirm-delete">
                Please type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
              />
            </div>
            
            <div className="confirm-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  required
                />
                I understand that this action is permanent and cannot be undone
              </label>
            </div>
            
            <div className="delete-modal-actions">
              <button 
                type="button" 
                className="cancel-delete-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="confirm-delete-btn"
                disabled={confirmText !== 'DELETE' || !isChecked}
              >
                Permanently Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal; 
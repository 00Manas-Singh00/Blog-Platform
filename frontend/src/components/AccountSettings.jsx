import React, { useState, useEffect } from 'react';
import { FiSettings, FiCheck, FiInfo, FiDownload, FiTrash2 } from 'react-icons/fi';
import DeleteAccountModal from './DeleteAccountModal';
import { useTheme } from '../services/ThemeContext';
import { useLanguage } from '../services/LanguageContext';
import { useUserSettings } from '../services/UserSettingsService';
import './AccountSettings.css';

const AccountSettings = ({ initialSettings, onSave, onDeleteAccount }) => {
  const { theme, updateTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const userSettings = useUserSettings();
  
  const [settings, setSettings] = useState(initialSettings || {
    language: 'en',
    theme: 'light',
    auto_save: true,
    two_factor_enabled: false
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load user preferences from backend on mount if not provided through props
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!initialSettings) {
        try {
          setIsLoading(true);
          const preferences = await userSettings.getPreferences();
          setSettings({
            language: preferences.language || 'en',
            theme: preferences.theme || 'light',
            auto_save: preferences.auto_save || false,
            two_factor_enabled: preferences.two_factor_enabled || false
          });
          
          // Update theme and language context based on fetched preferences
          updateTheme(preferences.theme || 'light');
          changeLanguage(preferences.language || 'en');
        } catch (error) {
          console.error('Failed to load preferences:', error);
          setErrorMessage('Failed to load your preferences. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPreferences();
  }, [initialSettings, userSettings, updateTheme, changeLanguage]);
  
  // Sync local theme state with ThemeContext on initial load
  useEffect(() => {
    if (initialSettings?.theme) {
      updateTheme(initialSettings.theme);
    }
  }, [initialSettings, updateTheme]);
  
  // Sync local language state with LanguageContext on initial load
  useEffect(() => {
    if (initialSettings?.language) {
      changeLanguage(initialSettings.language);
    }
  }, [initialSettings, changeLanguage]);
  
  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    // If theme is being changed, update the ThemeContext
    if (name === 'theme') {
      updateTheme(value);
    }
    
    // If language is being changed, update the LanguageContext
    if (name === 'language') {
      changeLanguage(value);
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle toggle change
  const handleToggleChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Update preferences through the API
      await userSettings.updatePreferences({
        theme: settings.theme,
        language: settings.language,
        auto_save: settings.auto_save,
        two_factor_enabled: settings.two_factor_enabled
      });
      
      // Update local context values if needed
      updateTheme(settings.theme);
      changeLanguage(settings.language);
      
      setSuccessMessage('Settings saved successfully!');
      
      // Call the parent component's onSave if provided
      if (onSave) {
        onSave(settings);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setErrorMessage('Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete account confirmation
  const handleDeleteConfirm = async (confirmText) => {
    try {
      setIsLoading(true);
      
      // Call the API to delete the account
      const result = await userSettings.deleteAccount(confirmText);
      
      // Close the modal
      setShowDeleteModal(false);
      
      // Call the delete account function from props if provided
      if (onDeleteAccount) {
        onDeleteAccount(result);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      setErrorMessage('Failed to delete your account: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="account-settings">
      <div className="account-header">
        <FiSettings className="account-icon" />
        <h3>{t('settings.account')}</h3>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="account-info">
        <FiInfo className="info-icon" />
        <p>
          {t('account.preferencesInfo', 'Manage your account preferences and settings. These settings affect how you interact with the platform.')}
        </p>
      </div>
      
      <div className="account-section">
        <h4>{t('account.preferences')}</h4>
        <div className="account-options">
          <div className="account-option">
            <label className="setting-label">
              {t('account.language')}:
              <select 
                name="language" 
                value={settings.language} 
                onChange={handleSelectChange}
                className="setting-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </label>
          </div>
          
          <div className="account-option">
            <label className="setting-label">
              {t('account.theme')}:
              <select 
                name="theme" 
                value={settings.theme} 
                onChange={handleSelectChange}
                className="setting-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </label>
          </div>
          
          <div className="account-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.auto_save} 
                onChange={() => handleToggleChange('auto_save')}
              />
              <span className="toggle-switch"></span>
              <span>{t('account.autoSave')}</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="account-section">
        <h4>{t('account.security')}</h4>
        <div className="account-options">
          <div className="account-option">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.two_factor_enabled} 
                onChange={() => handleToggleChange('two_factor_enabled')}
              />
              <span className="toggle-switch"></span>
              <span>{t('account.twoFactor')}</span>
            </label>
            {settings.two_factor_enabled && (
              <div className="setting-details">
                {t('account.twoFactorDetails')}
                <button className="setup-2fa-btn">{t('account.setupTwoFactor')}</button>
              </div>
            )}
          </div>
          
          <div className="account-option">
            <button className="change-password-btn">{t('account.changePassword')}</button>
          </div>
        </div>
      </div>
      
      <div className="account-section">
        <h4>{t('account.dataManagement')}</h4>
        <div className="account-options">
          <div className="account-option data-option">
            <div className="data-action">
              <FiDownload className="data-icon" />
              <div className="data-text">
                <h5>{t('account.exportData')}</h5>
                <p>{t('account.exportDataDesc')}</p>
              </div>
            </div>
            <button className="data-btn export-btn">Export Data</button>
          </div>
          
          <div className="account-option data-option">
            <div className="data-action">
              <FiTrash2 className="data-icon danger" />
              <div className="data-text">
                <h5>{t('account.deleteAccount')}</h5>
                <p>{t('account.deleteAccountDesc')}</p>
              </div>
            </div>
            <button 
              className="data-btn delete-btn"
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              {t('button.delete')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="account-actions">
        <button 
          className="save-account-btn"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (
            <>
              <FiCheck />
              {t('button.save')}
            </>
          )}
        </button>
      </div>
      
      <DeleteAccountModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AccountSettings; 
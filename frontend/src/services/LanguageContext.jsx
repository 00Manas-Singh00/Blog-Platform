import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n, { getLanguage, setLanguage } from './i18n';

// Create context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getLanguage());
  
  // Function to change language
  const changeLanguage = (newLanguage) => {
    if (setLanguage(newLanguage)) {
      setLanguageState(newLanguage);
    }
  };
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguageState(e.detail.language);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t: i18n.t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
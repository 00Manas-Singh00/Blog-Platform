import React, { createContext, useState, useContext, useEffect } from 'react';
import ThemeSwitcher from '../components/ThemeSwitcher';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Otherwise default to system preference
    return 'system';
  });
  
  // Set theme when user changes it
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <ThemeSwitcher theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
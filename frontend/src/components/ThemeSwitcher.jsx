import React, { useEffect } from 'react';

const ThemeSwitcher = ({ theme }) => {
  // Apply theme changes whenever the theme prop changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  
  // Function to apply the selected theme
  const applyTheme = (selectedTheme) => {
    // Get system theme preference if set to 'system'
    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      selectedTheme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply the theme by adding/removing a class to the document body
    if (selectedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Store the theme preference in localStorage
    localStorage.setItem('theme', selectedTheme);
  };
  
  // Listen for system theme changes if theme is set to 'system'
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);
  
  // This component doesn't render anything visible
  return null;
};

export default ThemeSwitcher; 
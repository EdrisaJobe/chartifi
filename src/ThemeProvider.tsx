import React, { useState } from 'react';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default to light theme
  
  // ... rest of your theme provider code ...
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';


// interface ThemeContextType {
//   toggleTheme: () => void;
//   isDarkMode: boolean;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const useThemeContext = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useThemeContext must be used within a ThemeProvider');
//   }
//   return context;
// };

// export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   const theme = createTheme({
//     palette: {
//       mode: isDarkMode ? 'dark' : 'light',
//     },
//   });

//   return (
//     <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
//       <ThemeProvider theme={theme}>{children}</ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };
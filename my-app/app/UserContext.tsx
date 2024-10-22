import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  isAuthenticated: boolean;
  setUserId: (id: string | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ userId, isAuthenticated, setUserId, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
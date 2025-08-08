import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Remove automatic login from localStorage for demo purposes
  // In production, you might want to keep this for persistent sessions

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    const demoCredentials = [
      { email: 'admin@company.com', password: 'admin123', role: 'admin' as const },
      { email: 'john@company.com', password: 'employee123', role: 'employee' as const, employeeId: '1' }
    ];
    
    const credential = demoCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (credential) {
      const userData: User = {
        id: credential.email === 'admin@company.com' ? 'admin-1' : 'emp-1',
        name: credential.email === 'admin@company.com' ? 'Admin User' : 'John Doe',
        email: credential.email,
        role: credential.role,
        employeeId: credential.employeeId
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
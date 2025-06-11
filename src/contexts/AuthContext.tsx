import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    userId: '1',
    fullName: 'Pierre Dubois',
    email: 'admin@premunia.fr',
    passwordHash: 'admin123',
    role: 'Admin',
    isActive: true
  },
  {
    userId: '2', 
    fullName: 'Marie Martin',
    email: 'marie@premunia.fr',
    passwordHash: 'marie123',
    role: 'Commercial',
    isActive: true
  },
  {
    userId: '3',
    fullName: 'Jean Dupont',
    email: 'jean@premunia.fr',
    passwordHash: 'jean123',
    role: 'Commercial',
    isActive: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('premuniaUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email && u.passwordHash === password);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('premuniaUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('premuniaUser');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
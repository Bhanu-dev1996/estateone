import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toastSuccess, toastInfo } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [intendedDestination, setIntendedDestination] = useState(() => {
    try {
      return sessionStorage.getItem('estateone_intended_destination') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('estateone_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('estateone_auth_user');
      }
    } catch {
      // storage unavailable
    }
  }, [user]);

  const saveIntendedDestination = useCallback((path) => {
    setIntendedDestination(path);
    try {
      if (path) {
        sessionStorage.setItem('estateone_intended_destination', path);
      } else {
        sessionStorage.removeItem('estateone_intended_destination');
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const login = useCallback((email, role = 'buyer') => {
    const mockUser = {
      id: 'usr-9281',
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };
    setUser(mockUser);
    toastSuccess('Signed in successfully', `Welcome back, ${mockUser.name}.`);

    const destination = intendedDestination || '/';
    saveIntendedDestination(null);
    return destination;
  }, [intendedDestination, saveIntendedDestination, toastSuccess]);

  const logout = useCallback(() => {
    setUser(null);
    saveIntendedDestination(null);
    toastInfo('Signed out', 'You have been securely signed out of EstateOne.');
  }, [saveIntendedDestination, toastInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        intendedDestination,
        saveIntendedDestination
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthState {
  user: string | undefined;
  userId: string | undefined;
  profilePicture: string;
  isSignedIn: boolean;
  isDemoUser: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: { username: string; userId?: string; profilePicture?: string; accessToken?: string }) => void;
  logout: () => void;
  updateProfile: (data: { username?: string; profilePicture?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    user: Cookies.get('user'),
    userId: Cookies.get('userId'),
    profilePicture: Cookies.get('profilePicture') || '/blankProfile.png',
    isSignedIn: Cookies.get('signedIn') === 'true',
    isDemoUser: Cookies.get('user') === 'demo_guest',
  }));

  // Keep cookies in sync for middleware (JWT needs to stay in cookies)
  const login = ({ username, userId, profilePicture, accessToken }: {
    username: string;
    userId?: string;
    profilePicture?: string;
    accessToken?: string;
  }) => {
    Cookies.set('signedIn', 'true', { path: '/' });
    Cookies.set('user', username, { path: '/' });
    if (userId) Cookies.set('userId', userId, { path: '/' });
    if (profilePicture) Cookies.set('profilePicture', profilePicture, { path: '/' });
    if (accessToken) Cookies.set('access_token', accessToken, { path: '/' });

    setAuthState({
      user: username,
      userId: userId || undefined,
      profilePicture: profilePicture || '/blankProfile.png',
      isSignedIn: true,
      isDemoUser: username === 'demo_guest',
    });
  };

  const logout = () => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    localStorage.clear();
    setAuthState({
      user: undefined,
      userId: undefined,
      profilePicture: '/blankProfile.png',
      isSignedIn: false,
      isDemoUser: false,
    });
  };

  const updateProfile = ({ username, profilePicture }: { username?: string; profilePicture?: string }) => {
    if (username) Cookies.set('user', username, { path: '/' });
    if (profilePicture) Cookies.set('profilePicture', profilePicture, { path: '/' });
    setAuthState(prev => ({
      ...prev,
      ...(username && { user: username }),
      ...(profilePicture && { profilePicture }),
    }));
  };

  // Listen for legacy events during transition (from middleware cookie cleanup)
  useEffect(() => {
    const syncFromCookies = () => {
      setAuthState({
        user: Cookies.get('user'),
        userId: Cookies.get('userId'),
        profilePicture: Cookies.get('profilePicture') || '/blankProfile.png',
        isSignedIn: Cookies.get('signedIn') === 'true',
        isDemoUser: Cookies.get('user') === 'demo_guest',
      });
    };
    window.addEventListener('userInfoUpdated', syncFromCookies);
    return () => window.removeEventListener('userInfoUpdated', syncFromCookies);
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateProfile }}>
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

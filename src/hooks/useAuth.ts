import { useState, useEffect } from 'react';
import { saveUser, getUser, clearUser, generateId } from '../lib/storage';
import toast from 'react-hot-toast';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  color: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate registration
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];
      const userData: AuthUser = {
        id: generateId(),
        name,
        email,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setUser(userData);
      saveUser(userData);
      toast.success(`Welcome to SyncNote, ${name}! 🎉`);
      
      return userData;
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate login - in real app, validate credentials
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];
      const userData: AuthUser = {
        id: generateId(),
        name: email.split('@')[0], // Use email prefix as name
        email,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setUser(userData);
      saveUser(userData);
      toast.success(`Welcome back, ${userData.name}! 🎉`);
      
      return userData;
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = () => {
    clearUser();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return { user, isLoading, register, login, logout };
}
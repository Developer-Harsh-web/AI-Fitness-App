"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, UserPreferences } from '../../types';

const defaultPreferences: UserPreferences = {
  measurementSystem: 'metric',
  theme: 'system',
  notificationsEnabled: true,
  motivationFrequency: 'daily',
};

// Mock user with fixed dates to prevent hydration errors
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  height: 175,
  weight: 70,
  preferences: defaultPreferences,
  goals: [
    {
      id: '1',
      type: 'weight',
      target: 65,
      deadline: new Date('2024-12-31'), // Fixed date
      progress: 0.3,
      completed: false,
    },
    {
      id: '2',
      type: 'exercise',
      target: 'Run 5km without stopping',
      deadline: new Date('2024-11-30'), // Fixed date
      progress: 0.5,
      completed: false,
    },
  ],
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data only once on mount
  useEffect(() => {
    // In a real app, this would fetch from an API or auth provider
    const getUser = async () => {
      try {
        // Check if user is logged in
        const loggedIn = typeof window !== 'undefined' && localStorage.getItem('fitcoach_logged_in') === 'true';
        setIsLoggedIn(loggedIn);

        // If not logged in, we won't load the user data
        if (!loggedIn && typeof window !== 'undefined') {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if user exists in localStorage for persistence
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('fitcoach_user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Convert string dates back to Date objects
              if (parsedUser.goals) {
                parsedUser.goals = parsedUser.goals.map((goal: { deadline?: string | null } & Record<string, unknown>) => ({
                  ...goal,
                  deadline: goal.deadline ? new Date(goal.deadline) : null
                }));
              }
              setUser(parsedUser);
            } catch (_) {
              // If there's an error parsing, use the mock user
              setUser(mockUser);
              localStorage.setItem('fitcoach_user', JSON.stringify(mockUser));
            }
          } else {
            // For demo purposes, we'll use the mock user
            setUser(mockUser);
            localStorage.setItem('fitcoach_user', JSON.stringify(mockUser));
          }
        } else {
          // For SSR, just use mock data
          setUser(mockUser);
        }
        
        setLoading(false);
      } catch (_) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    getUser();
  }, []); // Empty dependency array to ensure it only runs once

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create new user object with updates
      const updatedUser = { ...user, ...updates };
      
      // Update local state
      setUser(updatedUser);
      
      // Save to localStorage for persistence in demo
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitcoach_user', JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (_) {
      setError('Failed to update user data');
      return false;
    }
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user || !user.preferences) return false;
    
    const updatedPreferences = { ...user.preferences, ...updates };
    return updateUser({ preferences: updatedPreferences });
  }, [user, updateUser]);

  const login = useCallback(async (email: string, _password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would validate credentials with a server
      // For demo, we just check if there's a matching user in localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('fitcoach_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          
          // Check if email matches (we don't really check password in this demo)
          if (parsedUser.email === email) {
            setUser(parsedUser);
            setIsLoggedIn(true);
            localStorage.setItem('fitcoach_logged_in', 'true');
            return true;
          }
        } else {
          // Create default user if none exists
          localStorage.setItem('fitcoach_user', JSON.stringify(mockUser));
          
          // Allow login with demo@example.com
          if (email === 'demo@example.com') {
            setUser(mockUser);
            setIsLoggedIn(true);
            localStorage.setItem('fitcoach_logged_in', 'true');
            return true;
          }
        }
      }
      
      return false;
    } catch (_) {
      setError('Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitcoach_logged_in');
      // Don't remove user data to allow easy re-login
    }
  }, []);

  return {
    user,
    loading,
    error,
    isLoggedIn,
    updateUser,
    updatePreferences,
    login,
    logout,
  };
} 
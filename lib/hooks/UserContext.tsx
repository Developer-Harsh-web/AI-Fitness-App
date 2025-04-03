"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  preferences: {
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    fitnessGoals: string[];
    dietaryPreferences: string[];
    weightUnit: 'kg' | 'lbs';
    heightUnit: 'cm' | 'ft';
  };
  stats: {
    weight: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  };
};

// Define context type
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  signIn: async () => false,
  signOut: () => {},
  isAuthenticated: false,
});

// Sample user data
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    fitnessLevel: 'intermediate',
    fitnessGoals: ['lose weight', 'build muscle', 'improve endurance'],
    dietaryPreferences: ['high protein', 'low carb'],
    weightUnit: 'kg',
    heightUnit: 'cm',
  },
  stats: {
    weight: 82,
    height: 180,
    age: 32,
    gender: 'male',
    activityLevel: 'moderate',
  },
};

// Create provider component
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount (simulated auth check)
  useEffect(() => {
    // In a real app, this would check for an auth token and fetch user data from an API
    const checkAuth = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start with no authenticated user to force login
        setUser(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Accept any email/password combination
      // Create a user with the email from input
      const newUser = {
        ...MOCK_USER,
        email: email,
        name: email.split('@')[0] // Use part before @ as name
      };
      
      // Set the user and return success
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Sign out function
  const signOut = () => {
    // In a real app, this would clear auth tokens
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook for using the context
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

// Export default for convenience
export default UserContext; 
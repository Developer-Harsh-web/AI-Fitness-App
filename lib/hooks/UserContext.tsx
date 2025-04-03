"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  preferences: {
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    fitnessGoals: string[];
    dietaryPreferences: string[];
    weightUnit: 'kg' | 'lbs';
    heightUnit: 'cm' | 'ft';
    checkInFrequency: 'low' | 'medium' | 'high';
    notificationPreferences: {
      meals: boolean;
      activity: boolean;
      water: boolean;
      sleep: boolean;
      measurements: boolean;
    };
    trackingDevices: string[];
  };
  stats: {
    weight: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
    bodyFatPercentage?: number;
    waistCircumference?: number;
    hipCircumference?: number;
    restingHeartRate?: number;
    vo2Max?: number;
  };
};

// Define context type
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  signIn: async () => false,
  signInWithGoogle: async () => false,
  signOut: () => {},
  isAuthenticated: false,
});

// Sample user data
export const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    fitnessLevel: 'intermediate',
    fitnessGoals: ['lose weight', 'build muscle', 'improve endurance'],
    dietaryPreferences: ['high protein', 'low carb'],
    weightUnit: 'kg',
    heightUnit: 'cm',
    checkInFrequency: 'medium',
    notificationPreferences: {
      meals: true,
      activity: true,
      water: true,
      sleep: true,
      measurements: true,
    },
    trackingDevices: ['Fitbit', 'Apple Watch', 'Garmin', 'Samsung Health'],
  },
  stats: {
    weight: 82,
    height: 180,
    age: 32,
    gender: 'male',
    activityLevel: 'moderate',
    bodyFatPercentage: 18.5,
    waistCircumference: 94,
    hipCircumference: 102,
    restingHeartRate: 62,
    vo2Max: 42.5,
  },
};

// Create provider component
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Load user data from session when available
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Create user from session data
      const sessionUser: User = {
        id: session.user.id || '1',
        name: session.user.name || 'User',
        email: session.user.email || 'user@example.com',
        // Use preferences from session if available or fallback to mock data
        preferences: (session.user.preferences as User['preferences']) || MOCK_USER.preferences,
        stats: (session.user.stats as User['stats']) || MOCK_USER.stats,
      };
      
      setUser(sessionUser);
      setIsLoading(false);
    } else {
      // For demo purposes, use mock user to avoid login
      // In production, this would be: setUser(null)
      setUser(MOCK_USER);
      setIsLoading(false);
    }
  }, [session, status]);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (!result?.ok) {
        // For demo purposes, create a mock user when sign in fails
        // In production, this would just return false
        const customUser = {
          ...MOCK_USER,
          name: email.split('@')[0],
          email: email,
        };
        setUser(customUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return !!result?.ok;
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Sign in with Google function
  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await nextAuthSignIn('google', { redirect: false });
      
      if (!result?.ok) {
        // For demo purposes, use mock user when sign in fails
        setUser(MOCK_USER);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return !!result?.ok;
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Sign out function
  const signOut = () => {
    nextAuthSignOut({ redirect: false });
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isLoading,
    signIn,
    signInWithGoogle,
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
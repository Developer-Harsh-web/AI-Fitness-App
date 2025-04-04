"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  provider?: 'credentials' | 'google' | 'facebook' | string;
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
    trackingApps?: string[];
    trackingIntegrations?: {
      appleHealth?: {
        connected: boolean;
        lastSynced?: string;
        permissions: {
          steps: boolean;
          heartRate: boolean;
          workout: boolean;
          sleep: boolean;
          nutrition: boolean;
        };
      };
      googleFit?: {
        connected: boolean;
        lastSynced?: string;
        accountEmail?: string;
      };
      fitbit?: {
        connected: boolean;
        lastSynced?: string;
        deviceModel?: string;
      };
      garmin?: {
        connected: boolean;
        lastSynced?: string;
        deviceModel?: string;
      };
      strava?: {
        connected: boolean;
        lastSynced?: string;
        accountEmail?: string;
      };
      myFitnessPal?: {
        connected: boolean;
        lastSynced?: string;
        accountEmail?: string;
      };
      otherDevices?: Array<{
        name: string;
        connected: boolean;
        lastSynced?: string;
      }>;
      otherApps?: Array<{
        name: string;
        connected: boolean;
        lastSynced?: string;
      }>;
    };
    aiPersonaId?: string;
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
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
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
  requestPasswordReset: async () => false,
  resetPassword: async () => false,
});

// Sample user data
export const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  provider: 'credentials', // Mock user came from credentials login (not social)
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
    trackingApps: ['Strava', 'MyFitnessPal'],
    trackingIntegrations: {
      appleHealth: {
        connected: true,
        lastSynced: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        permissions: {
          steps: true,
          heartRate: true,
          workout: true,
          sleep: true,
          nutrition: false,
        },
      },
      fitbit: {
        connected: true,
        lastSynced: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        deviceModel: 'Versa 3',
      },
      garmin: {
        connected: true,
        lastSynced: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        deviceModel: 'Forerunner 245',
      },
      strava: {
        connected: true,
        lastSynced: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
        accountEmail: 'john@example.com',
      },
      myFitnessPal: {
        connected: true,
        lastSynced: new Date(Date.now() - 9000000).toISOString(), // 2.5 hours ago
        accountEmail: 'john@example.com',
      },
      otherDevices: [
        {
          name: 'Samsung Health',
          connected: true,
          lastSynced: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
        }
      ],
      otherApps: [
        {
          name: 'MapMyRun',
          connected: true,
          lastSynced: new Date(Date.now() - 19200000).toISOString(), // 5.3 hours ago
        }
      ]
    },
    aiPersonaId: 'coach-alex', // Default AI persona
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
        provider: session.user.provider,
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
        // For demo purposes only
        // In a real app, this would return false after the failed NextAuth signIn
        console.log('Using mock login for demo');
        const mockUserWithProvider = {
          ...MOCK_USER,
          provider: 'credentials'
        };
        setUser(mockUserWithProvider);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return true;
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
      // Use redirect:true to automatically redirect to the callback URL after Google authentication
      const result = await nextAuthSignIn('google', {
        redirect: true,
        callbackUrl: '/dashboard'
      });
      
      // This code will only run if redirect is set to false
      if (!result?.ok) {
        // For demo purposes only
        // In a real app, this would return false after the failed NextAuth signIn
        console.log('Using mock Google login for demo');
        const mockUserWithProvider = {
          ...MOCK_USER,
          provider: 'google',
          // Clear body fat percentage to simulate incomplete profile
          stats: {
            ...MOCK_USER.stats,
            bodyFatPercentage: undefined
          }
        };
        setUser(mockUserWithProvider);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Sign in with Google error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Sign out function
  const signOut = () => {
    nextAuthSignOut({ redirect: false });
    setUser(null);
  };

  // Request password reset function
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would check if the user exists and send an email
      
      // Simulate checking if user exists
      const emailExists = email.includes('@');
      
      if (!emailExists) {
        setIsLoading(false);
        return false;
      }
      
      // Simulate API call to send reset email
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a reset token and link it to the user
      // In a real app, this would be stored in a database
      const resetToken = generateResetToken();
      
      // Send reset email (simulated)
      console.log(`Reset token for ${email}: ${resetToken}`);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would verify the token and update the password
      
      // Verify token (simulate checking token validity)
      const isValidToken = token && token.length >= 10;
      
      if (!isValidToken) {
        setIsLoading(false);
        return false;
      }
      
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, update the user's password in the database
      console.log(`Password updated successfully for token: ${token}, new password length: ${newPassword.length}`);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Helper function to generate a token
  const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const value = {
    user,
    setUser,
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    requestPasswordReset,
    resetPassword,
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
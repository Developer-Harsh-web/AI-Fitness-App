"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../lib/hooks/UserContext';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  height: z.string().optional(),
  weight: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  fitnessGoals: z.array(z.string()).optional(),
  coachingIntensity: z.enum(['light', 'moderate', 'intensive']).default('moderate'),
  measurementSystem: z.enum(['metric', 'imperial']).default('metric'),
  acceptTerms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { setUser, signInWithGoogle } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      measurementSystem: 'metric',
      fitnessLevel: 'beginner',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setRegisterError(null);
    
    try {
      // Create new user object with form data
      const newUser = {
        id: Date.now().toString(), // Generate a unique ID
        name: data.name,
        email: data.email,
        preferences: {
          fitnessLevel: data.fitnessLevel || 'beginner',
          fitnessGoals: data.fitnessGoals || ['lose weight', 'improve fitness'],
          dietaryPreferences: [],
          weightUnit: data.measurementSystem === 'metric' ? 'kg' : 'lbs',
          heightUnit: data.measurementSystem === 'metric' ? 'cm' : 'ft',
          checkInFrequency: data.coachingIntensity || 'moderate',
          notificationPreferences: {
            meals: true,
            activity: true,
            water: true,
            sleep: true,
            measurements: true,
          },
          trackingDevices: [],
          trackingApps: [],
          aiPersonaId: 'coach-alex',
        },
        stats: {
          weight: data.weight ? Number(data.weight) : 70,
          height: data.height ? Number(data.height) : 175,
          age: 30,
          gender: data.gender || 'male',
          activityLevel: 'moderate',
        },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set user in context
      setUser(newUser);
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google registration
  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      setRegisterError(null);
      
      // This would normally call an API or service to register with Google
      // We'll use the same signInWithGoogle function - if it fails, we know
      // the user isn't registered and we should create a new account
      
      // Try to sign in with Google first
      const signInResult = await signInWithGoogle();
      
      // If sign in is successful, user already exists, redirect to dashboard
      if (signInResult) {
        router.push('/dashboard');
        return;
      }
      
      // If sign in fails, create a new user with Google
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set default coaching intensity to moderate
      const coachingIntensity = 'moderate';
      
      const newUser = {
        id: Date.now().toString(),
        name: 'Google User',
        email: 'google-user@example.com',
        preferences: {
          fitnessLevel: 'beginner',
          fitnessGoals: ['lose weight', 'improve fitness'],
          dietaryPreferences: [],
          weightUnit: 'kg',
          heightUnit: 'cm',
          checkInFrequency: coachingIntensity,
          notificationPreferences: {
            meals: true,
            activity: true,
            water: true,
            sleep: true,
            measurements: true,
          },
          trackingDevices: [],
          trackingApps: [],
          aiPersonaId: 'coach-alex',
        },
        stats: {
          weight: 70,
          height: 175,
          age: 30,
          gender: 'male',
          activityLevel: 'moderate',
        },
      };
      
      // Set user in context
      setUser(newUser);
      
      // Redirect to dashboard - new account created
      router.push('/dashboard');
    } catch (error) {
      console.error('Google registration error:', error);
      setRegisterError('An error occurred during Google registration. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Registration Successful!</h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Your account has been created successfully. You can now proceed to the dashboard.
        </p>
        <Button 
          onClick={() => router.push('/dashboard')}
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {registerError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {registerError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Profile Information (Optional)</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height
            </label>
            <input
              id="height"
              type="text"
              placeholder="cm"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              {...register('height')}
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight
            </label>
            <input
              id="weight"
              type="text"
              placeholder="kg"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              {...register('weight')}
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              id="gender"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              {...register('gender')}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="measurementSystem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Preferred Measurement System
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="metric"
              className="text-blue-600 focus:ring-blue-500 mr-2"
              {...register('measurementSystem')}
            />
            <span className="text-gray-700 dark:text-gray-300">Metric (kg, cm)</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="imperial"
              className="text-blue-600 focus:ring-blue-500 mr-2"
              {...register('measurementSystem')}
            />
            <span className="text-gray-700 dark:text-gray-300">Imperial (lb, ft)</span>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">AI Coaching Preferences</h3>
        
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How often would you like your AI coach to check in on you?
        </label>
        
        <div className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="coaching-light"
                type="radio"
                value="light"
                className="text-blue-600 focus:ring-blue-500"
                {...register('coachingIntensity')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="coaching-light" className="font-medium text-gray-700 dark:text-gray-300">Light</label>
              <p className="text-gray-500 dark:text-gray-400">Check-ins once or twice per day. Best for those who prefer minimal interruptions.</p>
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="coaching-moderate"
                type="radio"
                value="moderate"
                className="text-blue-600 focus:ring-blue-500"
                {...register('coachingIntensity')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="coaching-moderate" className="font-medium text-gray-700 dark:text-gray-300">Moderate</label>
              <p className="text-gray-500 dark:text-gray-400">Check-ins 3-5 times per day. Balanced accountability without being intrusive.</p>
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="coaching-intensive"
                type="radio"
                value="intensive"
                className="text-blue-600 focus:ring-blue-500"
                {...register('coachingIntensity')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="coaching-intensive" className="font-medium text-gray-700 dark:text-gray-300">Intensive</label>
              <p className="text-gray-500 dark:text-gray-400">Frequent check-ins every 30-60 minutes. Maximum accountability for dedicated fitness goals.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <input
          id="acceptTerms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
          {...register('acceptTerms')}
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Sign in
        </Link>
      </div>

      {/* Add Google Sign Up Button */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogleSignUp}
        isLoading={isGoogleLoading}
      >
        {!isGoogleLoading && (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Sign up with Google
      </Button>
    </form>
  );
} 
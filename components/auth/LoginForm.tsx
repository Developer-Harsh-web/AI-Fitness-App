"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../lib/hooks/UserContext';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | React.ReactNode | null>(null);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      // Check if the user exists before attempting to sign in
      const checkResult = await fetch('/api/auth/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      }).then(res => res.json());
      
      if (checkResult.exists) {
        // If the user exists, proceed with sign-in
        const success = await signIn(data.email, data.password);
        
        if (success) {
          // Redirect to dashboard on successful login
          router.push('/dashboard');
        } else {
          // Display error message if login failed - assuming incorrect password
          setLoginError('Invalid email or password. Please try again.');
        }
      } else {
        // Display error message if user not registered
        setLoginError(
          <div className="flex flex-col">
            <span className="font-medium mb-2">Account not found!</span>
            <span>It looks like you're not registered yet. Please create an account first.</span>
            <Button 
              onClick={() => router.push('/register')}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Register Now
            </Button>
          </div>
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      // Before redirecting, check if this is a new Google account that hasn't registered
      const checkResult = await fetch('/api/auth/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      }).then(res => res.json());
      
      if (checkResult.exists) {
        // If the user exists, proceed with Google sign-in
        await signInWithGoogle();
      } else {
        // If the user doesn't exist, show registration message
        setLoginError(
          <div className="flex flex-col">
            <span className="font-medium mb-2">Account not found!</span>
            <span>It looks like you haven't registered with Google yet. Please create an account first.</span>
            <Button 
              onClick={() => router.push('/register')}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Register with Google
            </Button>
          </div>
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {loginError}
        </div>
      )}
      
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

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <Link 
            href="/forgot-password" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Remember me
          </label>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
      >
        Sign In
      </Button>

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
        onClick={handleGoogleSignIn}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign in with Google
      </Button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
          Create an account
        </Link>
      </div>
    </form>
  );
} 
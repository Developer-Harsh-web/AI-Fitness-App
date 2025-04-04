"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import Link from 'next/link';
import { useUserContext } from '../../lib/hooks/UserContext';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { requestPasswordReset } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await requestPasswordReset(data.email);
      
      if (result) {
        setSuccess(`Password reset link sent to ${data.email}. Check your email inbox.`);
        reset(); // Clear the form
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="Enter your email address"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
      >
        Send Reset Link
      </Button>

      <div className="text-center text-sm">
        <Link 
          href="/login" 
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
} 
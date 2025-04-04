"use client";

import React from 'react';
import ResetPasswordForm from '../../../components/auth/ResetPasswordForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Set New Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a new password for your account
        </p>
      </div>
      
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400">
              Invalid or missing reset token. Please request a new password reset link.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
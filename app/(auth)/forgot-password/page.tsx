"use client";

import React from 'react';
import ForgotPasswordForm from '../../../components/auth/ForgotPasswordForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
} 
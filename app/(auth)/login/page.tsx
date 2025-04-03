"use client";

import LoginForm from '../../../components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sign in to your account to continue your fitness journey
        </p>
      </div>
      
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
} 
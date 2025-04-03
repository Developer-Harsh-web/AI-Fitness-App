"use client";

import LoginForm from '../../components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back to FitCoach
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account to continue your fitness journey
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
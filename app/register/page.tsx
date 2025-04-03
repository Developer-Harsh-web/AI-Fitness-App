"use client";

import RegisterForm from '../../components/auth/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Join FitCoach Today
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create an account to start your personalized fitness journey
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
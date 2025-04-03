"use client";

import RegisterForm from '../../../components/auth/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-2xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Join FitAI Companion
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create an account to start your personalized fitness journey
        </p>
      </div>
      
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
} 
"use client";

import React from 'react';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const features = [
  {
    title: 'Personalized Workout Plans',
    description: 'Get customized workout routines based on your goals, fitness level, and preferences.',
  },
  {
    title: 'Nutrition Tracking',
    description: 'Log your meals and track your nutritional intake to optimize your diet.',
  },
  {
    title: 'Health Metrics Monitoring',
    description: 'Keep track of your weight, heart rate, sleep, and other vital health metrics.',
  },
  {
    title: 'Voice-Activated Logging',
    description: 'Simply talk to your device to log workouts, meals, and other activities.',
  },
  {
    title: 'Goal Setting & Progress Tracking',
    description: 'Set fitness goals and track your progress with detailed reports and visualizations.',
  },
  {
    title: 'Smart Motivation System',
    description: 'Receive personalized motivational messages to keep you inspired and on track.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 py-20 px-6 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Your Personal Fitness Companion
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Track your workouts, monitor your nutrition, and stay motivated with personalized coaching and insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" passHref>
                  <Button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login" passHref>
                  <Button className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-3 text-lg" size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative h-[400px] w-full max-w-[400px] rounded-xl bg-white/10 p-2 shadow-2xl">
                <div className="absolute -top-4 -left-4 h-full w-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-50"></div>
                <div className="relative h-full w-full rounded-lg bg-white/80 dark:bg-gray-900/90 overflow-hidden">
                  <Image
                    src="/fitness-app-screen.jpg"
                    alt="FitCoach App Screenshot"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need for Your Fitness Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              FitCoach combines cutting-edge technology with personalized coaching to help you achieve your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-50 dark:bg-blue-950">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already improved their health and fitness with FitCoach.
          </p>
          <Link href="/register" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" size="lg">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 
"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UserStats from '../../../components/dashboard/UserStats';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import MotivationCard from '../../../components/dashboard/MotivationCard';
import HealthMetricsChart from '../../../components/dashboard/HealthMetricsChart';
import PersonalizedReminders from '../../../components/dashboard/PersonalizedReminders';
import TrackerImport from '../../../components/dashboard/TrackerImport';
import PhotoMealLogger from '../../../components/nutrition/PhotoMealLogger';
import AiChat from '../../../components/dashboard/AiChat';
import { useUserContext } from '../../../lib/hooks/UserContext';
import { ArrowRightIcon, ActivityIcon, LineChartIcon, PlusIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';

// Dynamically import VoiceInput with no SSR to prevent hydration issues
const VoiceInput = dynamic(() => import('../../../components/ui/VoiceInput'), { ssr: false });

// Dynamically import MotivationCard with no SSR to ensure it re-renders on each load
const DynamicMotivationCard = dynamic(() => Promise.resolve(MotivationCard), { ssr: false });

export default function DashboardPage() {
  const { user } = useUserContext();
  const [showOnboarding, setShowOnboarding] = useState(!user?.stats.bodyFatPercentage);
  // Create a unique timestamp key that will ensure the motivation card gets a new key on each render
  const timeKey = Date.now();
  
  const handleStartOnboarding = () => {
    window.location.href = '/onboarding';
  };
  
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Onboarding prompt if user hasn't completed profile */}
      {showOnboarding && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">Complete Your Profile</h2>
          <p className="text-yellow-700 dark:text-yellow-400 mb-4">
            For fully personalized fitness recommendations, we need a bit more information about you.
          </p>
          <Button onClick={handleStartOnboarding} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            Complete Onboarding
          </Button>
        </div>
      )}
      
      {/* Hero section with welcome message */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'User'}!
        </h1>
          <p className="text-blue-100 text-lg">
            Track your progress and stay motivated with your personalized fitness journey.
          </p>
          
          <div className="mt-6">
            <a href="/workouts" className="inline-flex items-center bg-white/90 backdrop-blur-sm text-blue-700 hover:bg-white font-medium rounded-lg px-5 py-2.5 text-sm transition-all shadow-md hover:shadow-lg">
              Start today's workout
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* AI Chat section */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <AiChat />
      </div>

      {/* Grid layout for main dashboard components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Stats, Reminders, Tracker Import */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <UserStats />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <PersonalizedReminders />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <TrackerImport />
          </div>
        </div>
        
        {/* Right columns - Photo Logger, Charts, Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Photo Meal Logger */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <PhotoMealLogger />
          </div>
          
          {/* Motivation card - using key to ensure it re-renders */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-md overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
            <DynamicMotivationCard key={timeKey} />
      </div>

      {/* Voice input for tracking activities */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ActivityIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Log</h3>
            </div>
        <VoiceInput
          onInputCapture={(text) => {
            // In a real app, this would process the voice input
            console.log('Voice input captured:', text);
            
            // For demo, you could add an alert
            alert(`Activity logged: "${text}"`);
          }}
          placeholder="Say 'I ran for 30 minutes' or 'I had a salad for lunch'..."
        />
      </div>

          {/* Charts section with title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Health Metrics</h3>
            </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthMetricsChart metricType="weight" />
        <HealthMetricsChart metricType="heartRate" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <ActivityIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
      <RecentActivity />
      </div>
    </div>
  );
} 
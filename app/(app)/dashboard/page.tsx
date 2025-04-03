"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UserStats from '../../../components/dashboard/UserStats';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import MotivationCard from '../../../components/dashboard/MotivationCard';
import HealthMetricsChart from '../../../components/dashboard/HealthMetricsChart';
import PersonalizedReminders from '../../../components/dashboard/PersonalizedReminders';
import { useUserContext } from '../../../lib/hooks/UserContext';
import { ArrowRightIcon, ActivityIcon, LineChartIcon } from 'lucide-react';

// Dynamically import VoiceInput with no SSR to prevent hydration issues
const VoiceInput = dynamic(() => import('../../../components/ui/VoiceInput'), { ssr: false });

// Dynamically import MotivationCard with no SSR to ensure it re-renders on each load
const DynamicMotivationCard = dynamic(() => Promise.resolve(MotivationCard), { ssr: false });

export default function DashboardPage() {
  const { user } = useUserContext();
  // Create a unique timestamp key that will ensure the motivation card gets a new key on each render
  const timeKey = Date.now();
  
  return (
    <div className="flex flex-col gap-8">
      {/* Hero section with welcome message */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-blue-100">
            Track your progress and stay motivated with your personalized fitness journey.
          </p>
          
          <div className="mt-4">
            <a href="/workouts" className="inline-flex items-center bg-white text-blue-700 hover:bg-blue-50 font-medium rounded-md px-4 py-2 text-sm transition-colors">
              Start today's workout
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid layout for main dashboard components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Stats and Reminders */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <UserStats />
          <PersonalizedReminders />
        </div>
        
        {/* Right columns - Charts and Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Motivation card - using key to ensure it re-renders */}
          <DynamicMotivationCard key={timeKey} />
          
          {/* Voice input for tracking activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <ActivityIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <RecentActivity />
      </div>
    </div>
  );
} 
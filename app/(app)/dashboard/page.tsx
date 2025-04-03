"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UserStats from '../../../components/dashboard/UserStats';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import MotivationCard from '../../../components/dashboard/MotivationCard';
import HealthMetricsChart from '../../../components/dashboard/HealthMetricsChart';
import { useUserContext } from '../../../lib/hooks/UserContext';

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
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name || 'User'}! Track your progress and stay motivated.
        </p>
      </div>

      {/* Voice input for tracking activities */}
      <div className="w-full max-w-3xl mx-auto">
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

      {/* Motivation card - using key to ensure it re-renders */}
      <DynamicMotivationCard key={timeKey} />

      {/* User stats */}
      <UserStats />

      {/* Grid layout for charts and activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthMetricsChart metricType="weight" />
        <HealthMetricsChart metricType="heartRate" />
      </div>

      {/* Recent activity */}
      <RecentActivity />
    </div>
  );
} 
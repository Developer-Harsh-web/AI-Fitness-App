"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UserStats from '../../../components/dashboard/UserStats';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import MotivationCard from '../../../components/dashboard/MotivationCard';
import HealthMetricsChart from '../../../components/dashboard/HealthMetricsChart';
import PersonalizedReminders from '../../../components/dashboard/PersonalizedReminders';
import { useUserContext } from '../../../lib/hooks/UserContext';
import { 
  ArrowRightIcon, 
  ActivityIcon, 
  LineChartIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  CameraIcon, 
  UtensilsIcon,
  Zap,
  TrendingUp,
  Flame,
  Trophy,
  LinkIcon,
  Smartphone
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Link from 'next/link';

// Dynamically import VoiceInput with no SSR to prevent hydration issues
const VoiceInput = dynamic(() => import('../../../components/ui/VoiceInput'), { ssr: false });

// Dynamically import MotivationCard with no SSR to ensure it re-renders on each load
const DynamicMotivationCard = dynamic(() => Promise.resolve(MotivationCard), { ssr: false });

export default function DashboardPage() {
  const { user } = useUserContext();
  
  // Show onboarding only for social login users (Google, etc.) who haven't completed their profile
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user exists
    if (!user) return false;
    
    // Check if user was registered via social login (Google)
    const isSocialLogin = user.provider === 'google' || user.provider === 'facebook';
    
    // Check if profile is incomplete (missing body fat percentage or other key stats)
    const isProfileIncomplete = !user.stats.bodyFatPercentage || !user.stats.weight;
    
    // Only show onboarding for social login users with incomplete profiles
    return isSocialLogin && isProfileIncomplete;
  });
  
  // Create a unique timestamp key that will ensure the motivation card gets a new key on each render
  const timeKey = Date.now();
  
  const handleStartOnboarding = () => {
    window.location.href = '/onboarding';
  };
  
  const [expandedSections, setExpandedSections] = useState({
    photoMealLogger: false,
    voiceInput: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {/* Welcome Card */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-5 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-8 -mr-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -mb-6 -ml-6"></div>
              
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-blue-100 text-sm mb-4 max-w-lg">
                Track your progress and stay motivated with your personalized fitness journey.
              </p>
              
              <div className="flex gap-3 mt-4">
                <Link href="/workouts">
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Zap className="h-4 w-4 mr-1" />
                    Start Workout
                  </Button>
                </Link>
                <Link href="/meal-tracker">
                  <Button size="sm" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <UtensilsIcon className="h-4 w-4 mr-1" />
                    Log Meal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                Today's Progress
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg">
                  <div className="text-xs text-orange-700 dark:text-orange-300 mb-1">Calories Burned</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">327</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
                  <div className="text-xs text-green-700 dark:text-green-300 mb-1">Steps</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">4,218</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                  <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">Water</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3/8</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
                  <div className="text-xs text-purple-700 dark:text-purple-300 mb-1">Workout</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0/1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivation Card */}
      <div className="mb-5">
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-xl shadow-sm overflow-hidden border border-purple-100 dark:border-purple-800/30">
          <DynamicMotivationCard key={timeKey} />
        </div>
      </div>
      
      {/* Onboarding prompt if social login user hasn't completed profile */}
      {showOnboarding && (
        <div className="mb-5">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Complete Your Profile</h2>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-3">
                  Thanks for signing in with Google! To get personalized fitness recommendations, we need a bit more information about your fitness goals and body measurements.
                </p>
                <Button onClick={handleStartOnboarding} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Complete Onboarding
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column - Stats and Reminders */}
        <div className="lg:col-span-4 space-y-5">
          {/* User Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                Your Stats
              </h3>
              <Link href="/profile" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View All</Link>
            </div>
            <UserStats />
          </div>
          
          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Reminders</h3>
            </div>
            <PersonalizedReminders />
          </div>
          
          {/* Integrations Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl shadow-sm overflow-hidden border border-purple-100 dark:border-purple-800/30">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Connect Your Apps</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Sync data from your favorite fitness apps and devices to get a complete picture of your health.
                  </p>
                  <Link href="/integrations">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Connect Apps
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Charts and Activity */}
        <div className="lg:col-span-8 space-y-5">
          {/* Health Metrics Charts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <LineChartIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Health Metrics</h3>
              </div>
              <Link href="/progress" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View More</Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HealthMetricsChart metricType="weight" />
                <HealthMetricsChart metricType="heartRate" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Meal Tracker */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Track Your Meals</h3>
              </div>
              <div className="p-5 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <UtensilsIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                  Log meals with a photo or track your daily nutrition manually
                </p>
                <Link href="/meal-tracker" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Track a Meal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Voice Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => toggleSection('voiceInput')}>
                <h3 className="font-semibold text-gray-900 dark:text-white">Quick Voice Log</h3>
                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.voiceInput ? 'rotate-180' : ''}`} />
              </div>
              {expandedSections.voiceInput ? (
                <div className="p-4">
                  <VoiceInput
                    onInputCapture={(text) => {
                      console.log('Voice input captured:', text);
                      alert(`Activity logged: "${text}"`);
                    }}
                    placeholder="Say 'I ran for 30 minutes' or 'I had a salad for lunch'..."
                  />
                </div>
              ) : (
                <div className="p-5 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                    <ActivityIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                    Quickly log activities or meals with your voice
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <ActivityIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <Link href="/progress" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View All</Link>
            </div>
            <div className="p-4">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
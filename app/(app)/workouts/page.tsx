"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { PlusIcon, ClockIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';
import WorkoutSuggestions from '../../../components/workouts/WorkoutSuggestions';
import WorkoutHistory from '../../../components/workouts/WorkoutHistory';
import ExerciseLibrary from '../../../components/workouts/ExerciseLibrary';

export default function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'history' | 'library'>('suggestions');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Workouts</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            AI Suggestions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'library'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Exercise Library
          </button>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center pt-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4 Workouts</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center pt-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Time</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3h 45m</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center pt-6">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
              <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,850</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'suggestions' && <WorkoutSuggestions />}
      {activeTab === 'history' && <WorkoutHistory />}
      {activeTab === 'library' && <ExerciseLibrary />}
    </div>
  );
} 
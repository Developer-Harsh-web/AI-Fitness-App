"use client";

import React, { useState } from 'react';
import MealTracker from '../../../components/nutrition/MealTracker';
import QuickFoodCapture from '../../../components/nutrition/QuickFoodCapture';
import PortionComparisonGuide from '../../../components/food/PortionComparisonGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { useMealTracking } from '../../../lib/hooks/MealTrackingContext';

export default function MealTrackerPage() {
  const { dailyCalories } = useMealTracking();
  const [activeTab, setActiveTab] = useState<string>("tracker");
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  return (
    <div className="max-w-7xl mx-auto pb-6 pt-2 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 shadow-lg relative overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 backdrop-blur-sm"></div>
        <div className="relative z-0">
          <h1 className="text-xl font-bold text-white mb-1">Meal Tracker</h1>
          <p className="text-blue-100 text-sm">
            Track your nutrition with accurate portion sizes and descriptions
          </p>
          <div className="mt-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 inline-flex items-center">
            <span className="text-white/90 text-xs mr-1">Daily Calories:</span>
            <span className="text-white font-medium text-sm">{Math.round(dailyCalories)} kcal</span>
          </div>
        </div>
      </div>

      {/* Quick capture buttons (only shown when not in capture mode) */}
      {!showQuickCapture && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowQuickCapture(true)}
            className="p-3 flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors hover:scale-105 transform duration-200 shadow-sm hover:shadow"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-1">
              <span className="text-xl">📸</span>
            </div>
            <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Take Food Photo</span>
          </button>
          
          <button
            onClick={() => setActiveTab("tracker")}
            className="p-3 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors hover:scale-105 transform duration-200 shadow-sm hover:shadow"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-1">
              <span className="text-xl">🍽️</span>
            </div>
            <span className="text-xs font-medium text-green-800 dark:text-green-200">Manual Meal Entry</span>
          </button>
        </div>
      )}

      {/* Quick food capture component */}
      {showQuickCapture && (
        <div className="mb-6">
          <QuickFoodCapture onComplete={() => setShowQuickCapture(false)} />
        </div>
      )}

      {/* Main Tabs */}
      {!showQuickCapture && (
        <Tabs 
          defaultValue="tracker" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="tracker">Meal Tracker</TabsTrigger>
            <TabsTrigger value="guide">Portion Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
              <MealTracker />
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Portion Comparison Guide
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Use this guide to help you accurately describe portion sizes when tracking your meals.
                  Better portion descriptions lead to more accurate calorie tracking.
                </p>
                <PortionComparisonGuide />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 
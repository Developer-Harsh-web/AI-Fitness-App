"use client";

import React, { useState } from 'react';
import MealTracker from '../../../components/nutrition/MealTracker';
import NutritionSummary from '../../../components/nutrition/NutritionSummary';
import AINutritionSuggestions from '../../../components/nutrition/AINutritionSuggestions';

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'summary' | 'suggestions'>('tracker');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nutrition</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your meals and get personalized nutrition insights</p>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'tracker'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Meal Tracker
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'summary'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Nutrition Summary
        </button>
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
      </div>

      {activeTab === 'tracker' && <MealTracker />}
      {activeTab === 'summary' && <NutritionSummary />}
      {activeTab === 'suggestions' && <AINutritionSuggestions />}
    </div>
  );
} 
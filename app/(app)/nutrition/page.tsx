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

      {/* Food banner */}
      <div className="relative w-full h-48 md:h-64 mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-emerald-600/90 z-10"></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="flex justify-between w-full px-6 md:px-12">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Healthy Eating Made Simple</h2>
              <p className="text-white/80 max-w-md">Track your meals, monitor nutrients, and get AI-powered recommendations</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-5xl">🥗</div>
              <div className="text-5xl">🍎</div>
              <div className="text-5xl">🥑</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJmb29kUGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiB4PSIwIiB5PSIwIj48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtc2l6ZT0iMjAiPjwvdGV4dD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZm9vZFBhdHRlcm4pIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md mb-6 flex space-x-1">
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
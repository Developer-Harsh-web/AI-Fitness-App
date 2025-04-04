"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useUserContext } from '../../lib/hooks/UserContext';

// Sample nutrition data for demo
const SAMPLE_NUTRITION_DATA = {
  weeklyCalories: [2100, 1950, 2250, 2050, 1900, 2300, 2150],
  macroPercentages: {
    protein: 30,
    carbs: 45,
    fats: 25,
  },
  topFoods: [
    { name: 'Chicken Breast', count: 5 },
    { name: 'Brown Rice', count: 4 },
    { name: 'Broccoli', count: 4 },
    { name: 'Eggs', count: 3 },
    { name: 'Oatmeal', count: 3 },
  ],
  nutritionScores: {
    overall: 82,
    protein: 90,
    carbs: 78,
    fats: 75,
    micronutrients: 80,
  },
};

// Food icon mapping
const NUTRIENT_ICONS = {
  protein: '🥩',
  carbs: '🍚',
  fats: '🥑',
  fiber: '🍎',
  water: '💧',
  vitamins: '🥕',
  minerals: '🧂',
};

export default function NutritionSummary() {
  const { user } = useUserContext();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  
  // Get days of the week for the chart
  const getDaysOfWeek = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };
  
  const daysOfWeek = getDaysOfWeek();
  
  // Mock data for the visualization
  const weeklyData = [
    { day: 'Mon', calories: 2100, protein: 120, carbs: 210, fats: 70 },
    { day: 'Tue', calories: 2250, protein: 130, carbs: 225, fats: 75 },
    { day: 'Wed', calories: 1950, protein: 115, carbs: 195, fats: 65 },
    { day: 'Thu', calories: 2300, protein: 135, carbs: 230, fats: 77 },
    { day: 'Fri', calories: 2400, protein: 140, carbs: 240, fats: 80 },
    { day: 'Sat', calories: 2600, protein: 150, carbs: 260, fats: 87 },
    { day: 'Sun', calories: 2200, protein: 125, carbs: 220, fats: 73 },
  ];

  const dailyAverage = {
    calories: Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7),
    protein: Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / 7),
    carbs: Math.round(weeklyData.reduce((sum, day) => sum + day.carbs, 0) / 7),
    fats: Math.round(weeklyData.reduce((sum, day) => sum + day.fats, 0) / 7),
  };

  const maxCalories = Math.max(...weeklyData.map(day => day.calories));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Calorie Intake</CardTitle>
            <div className="flex rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${
                  timeframe === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                onClick={() => setTimeframe('week')}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  timeframe === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                onClick={() => setTimeframe('month')}
              >
                Month
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <div className="flex h-full items-end">
              {SAMPLE_NUTRITION_DATA.weeklyCalories.map((calories, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full px-1">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${(calories / 2500) * 200}px`,
                        maxHeight: '200px',
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {daysOfWeek[index]}
                  </div>
                  <div className="text-xs font-medium">{calories}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Daily Calorie Target: 2000-2200
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Macro Nutrient Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* Protein */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${SAMPLE_NUTRITION_DATA.macroPercentages.protein * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90, 50, 50)"
                />
                {/* Carbs */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${SAMPLE_NUTRITION_DATA.macroPercentages.carbs * 2.51} 251`}
                  strokeDashoffset={`${-SAMPLE_NUTRITION_DATA.macroPercentages.protein * 2.51}`}
                  transform="rotate(-90, 50, 50)"
                />
                {/* Fats */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray={`${SAMPLE_NUTRITION_DATA.macroPercentages.fats * 2.51} 251`}
                  strokeDashoffset={`${-(SAMPLE_NUTRITION_DATA.macroPercentages.protein + SAMPLE_NUTRITION_DATA.macroPercentages.carbs) * 2.51}`}
                  transform="rotate(-90, 50, 50)"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Protein
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {SAMPLE_NUTRITION_DATA.macroPercentages.protein}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Carbs
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {SAMPLE_NUTRITION_DATA.macroPercentages.carbs}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Fats
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {SAMPLE_NUTRITION_DATA.macroPercentages.fats}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Frequent Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_NUTRITION_DATA.topFoods.map((food, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {food.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {food.count} times this week
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Nutrition Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
              <div className="text-lg font-medium mb-1">Overall</div>
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={SAMPLE_NUTRITION_DATA.nutritionScores.overall >= 80 ? '#22c55e' : 
                            SAMPLE_NUTRITION_DATA.nutritionScores.overall >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${SAMPLE_NUTRITION_DATA.nutritionScores.overall * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90, 50, 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                  {SAMPLE_NUTRITION_DATA.nutritionScores.overall}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
              <div className="text-sm font-medium mb-1">Protein</div>
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeDasharray={`${SAMPLE_NUTRITION_DATA.nutritionScores.protein * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90, 50, 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {SAMPLE_NUTRITION_DATA.nutritionScores.protein}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
              <div className="text-sm font-medium mb-1">Carbs</div>
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray={`${SAMPLE_NUTRITION_DATA.nutritionScores.carbs * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90, 50, 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {SAMPLE_NUTRITION_DATA.nutritionScores.carbs}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
              <div className="text-sm font-medium mb-1">Fats</div>
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={`${SAMPLE_NUTRITION_DATA.nutritionScores.fats * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90, 50, 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {SAMPLE_NUTRITION_DATA.nutritionScores.fats}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
              <div className="text-sm font-medium mb-1">Micro</div>
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray={`${SAMPLE_NUTRITION_DATA.nutritionScores.micronutrients * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90, 50, 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {SAMPLE_NUTRITION_DATA.nutritionScores.micronutrients}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
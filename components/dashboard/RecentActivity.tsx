"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatDate, formatCalories, formatDuration } from '../../lib/utils/formatting';
import { mockWorkouts, mockMeals } from '../../lib/mock-data';

// Combine workouts and meals into a single activity feed
interface Activity {
  id: string;
  type: 'workout' | 'meal';
  date: Date;
  title: string;
  detail: string;
  calories: number;
}

export default function RecentActivity() {
  // Convert workouts to activities
  const workoutActivities: Activity[] = mockWorkouts.map(workout => ({
    id: `workout-${workout.id}`,
    type: 'workout',
    date: workout.date,
    title: `Workout: ${workout.exercises.length} exercises`,
    detail: `Duration: ${formatDuration(workout.duration)}`,
    calories: -1 * (workout.calories || 0), // Negative for calories burned
  }));
  
  // Convert meals to activities
  const mealActivities: Activity[] = mockMeals.map(meal => ({
    id: `meal-${meal.id}`,
    type: 'meal',
    date: meal.date,
    title: `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}: ${meal.foods.length} items`,
    detail: `Total: ${formatCalories(meal.totalCalories)}`,
    calories: meal.totalCalories,
  }));
  
  // Combine and sort by date (most recent first)
  const activities = [...workoutActivities, ...mealActivities].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  ).slice(0, 5); // Get only the 5 most recent
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No recent activity found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatDate(activity.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.detail}</span>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    activity.calories < 0 
                      ? 'text-green-600 dark:text-green-500' 
                      : 'text-orange-600 dark:text-orange-500'
                  }`}>
                    {activity.calories < 0 
                      ? `Burned ${formatCalories(Math.abs(activity.calories))}` 
                      : `Added ${formatCalories(activity.calories)}`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 
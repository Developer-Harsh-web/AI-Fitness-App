"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { CalendarIcon, ClockIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Sample workout history data
const WORKOUT_HISTORY = [
  {
    id: 1,
    title: 'Upper Body Strength',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    duration: 45,
    caloriesBurned: 320,
    type: 'strength',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '10, 8, 8, 6', weight: '135, 155, 155, 165' },
      { name: 'Overhead Press', sets: 3, reps: '10, 8, 8', weight: '85, 95, 95' },
      { name: 'Barbell Rows', sets: 3, reps: '10, 10, 10', weight: '135, 135, 135' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12, 12, 10', weight: '50, 60, 60' },
      { name: 'Bicep Curls', sets: 3, reps: '12, 10, 10', weight: '25, 30, 30' },
    ],
    notes: 'Felt strong on bench press today. Might increase weight next session.',
    rating: 4,
  },
  {
    id: 2,
    title: 'Morning HIIT Session',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    duration: 25,
    caloriesBurned: 280,
    type: 'hiit',
    exercises: [
      { name: 'Jump Squats', duration: '45 seconds', sets: 4 },
      { name: 'Mountain Climbers', duration: '45 seconds', sets: 4 },
      { name: 'Burpees', duration: '30 seconds', sets: 4 },
      { name: 'Plank Jacks', duration: '45 seconds', sets: 4 },
      { name: 'High Knees', duration: '45 seconds', sets: 4 },
    ],
    notes: 'Tough session but felt good. Kept rest periods to 20 seconds.',
    rating: 5,
  },
  {
    id: 3,
    title: 'Leg Day',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    duration: 60,
    caloriesBurned: 450,
    type: 'strength',
    exercises: [
      { name: 'Squats', sets: 5, reps: '10, 8, 8, 6, 6', weight: '155, 185, 195, 205, 205' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10, 10, 8', weight: '135, 155, 175' },
      { name: 'Leg Press', sets: 3, reps: '12, 12, 10', weight: '270, 360, 410' },
      { name: 'Walking Lunges', sets: 3, reps: '10 each leg', weight: '30, 35, 35' },
      { name: 'Calf Raises', sets: 4, reps: '15, 15, 15, 15', weight: '120, 140, 140, 150' },
    ],
    notes: 'Great leg session. Squats felt solid with good depth.',
    rating: 4,
  },
  {
    id: 4,
    title: '5K Run',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    duration: 28,
    caloriesBurned: 320,
    type: 'cardio',
    exercises: [
      { name: '5K Run', duration: '28:15', distance: '5 km', pace: '5:39 min/km' },
    ],
    notes: 'Morning run in the park. Weather was perfect. Felt strong throughout.',
    rating: 5,
  },
  {
    id: 5,
    title: 'Core & Abs',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    duration: 30,
    caloriesBurned: 220,
    type: 'strength',
    exercises: [
      { name: 'Plank', sets: 3, duration: '60s, 45s, 40s' },
      { name: 'Russian Twists', sets: 3, reps: '20, 20, 15', weight: '10, 10, 12' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12, 10, 8' },
      { name: 'Ab Rollouts', sets: 3, reps: '10, 8, 6' },
      { name: 'Mountain Climbers', sets: 3, duration: '45s, 45s, 30s' },
    ],
    notes: 'Focused on form rather than intensity. Core feels stronger.',
    rating: 3,
  },
];

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Helper function to get rating stars
const getRatingStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
        ★
      </span>
    ));
};

export default function WorkoutHistory() {
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'strength' | 'cardio' | 'hiit'>('all');

  const filteredWorkouts = filter === 'all' 
    ? WORKOUT_HISTORY 
    : WORKOUT_HISTORY.filter(workout => workout.type === filter);

  // Calculate summary statistics
  const totalWorkouts = WORKOUT_HISTORY.length;
  const totalDuration = WORKOUT_HISTORY.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = WORKOUT_HISTORY.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
  const averageRating = WORKOUT_HISTORY.reduce((sum, workout) => sum + workout.rating, 0) / totalWorkouts;

  return (
    <div>
      {/* Summary Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workout Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDuration} min</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCalories}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calories Burned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white flex justify-center">
                {getRatingStars(Math.round(averageRating))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
            </div>
          </div>

          {/* Weekly Progress Chart (simplified representation) */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weekly Workout Progress</h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-end h-32 space-x-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  // Count workouts for each day in the last 7 days
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dayStr = date.toISOString().split('T')[0].substring(0, 10);
                  
                  const workoutsForDay = WORKOUT_HISTORY.filter(w => 
                    new Date(w.date).toISOString().split('T')[0].substring(0, 10) === dayStr
                  );
                  
                  const height = workoutsForDay.length > 0 ? (workoutsForDay.length * 30) : 8;
                  
                  return (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full ${workoutsForDay.length > 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'} rounded-t`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-500">
                        {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold text-gray-900 dark:text-white">Workout History</div>
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'strength' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('strength')}
          >
            Strength
          </Button>
          <Button 
            variant={filter === 'cardio' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('cardio')}
          >
            Cardio
          </Button>
          <Button 
            variant={filter === 'hiit' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('hiit')}
          >
            HIIT
          </Button>
        </div>
      </div>

      {/* Workout History List */}
      {filteredWorkouts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No workout history found matching your filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} 
              className={`cursor-pointer transition-shadow hover:shadow-md ${selectedWorkout === workout.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedWorkout(selectedWorkout === workout.id ? null : workout.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{workout.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(workout.date)}
                      <span className="mx-2">•</span>
                      <span className="capitalize">{workout.type}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {workout.duration} min
                    </div>
                    <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm">
                      <FireIcon className="h-4 w-4 mr-1" />
                      {workout.caloriesBurned} cal
                    </div>
                  </div>
                </div>

                {/* Only show details if selected */}
                {selectedWorkout === workout.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exercises</h4>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-3">
                      <div className="space-y-2">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {exercise.sets && <span>{exercise.sets} sets </span>}
                              {exercise.reps && <span>• {exercise.reps} reps </span>}
                              {exercise.weight && <span>• {exercise.weight} lbs </span>}
                              {exercise.duration && <span>• {exercise.duration} </span>}
                              {exercise.distance && <span>• {exercise.distance} </span>}
                              {exercise.pace && <span>• Pace: {exercise.pace}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Notes</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{workout.notes}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Rating:</span>
                        <div className="flex">{getRatingStars(workout.rating)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
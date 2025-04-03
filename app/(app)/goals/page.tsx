"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { PlusIcon, TrashIcon, CheckCircleIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '../../../lib/hooks/UserContext';

// Sample goal types
const GOAL_TYPES = [
  { id: 'weight', name: 'Weight Goal', icon: '⚖️', unit: 'kg' },
  { id: 'steps', name: 'Daily Steps', icon: '👣', unit: 'steps' },
  { id: 'workout', name: 'Weekly Workouts', icon: '💪', unit: 'sessions' },
  { id: 'water', name: 'Daily Water Intake', icon: '💧', unit: 'liters' },
  { id: 'sleep', name: 'Sleep Duration', icon: '😴', unit: 'hours' },
  { id: 'meditation', name: 'Meditation', icon: '🧘', unit: 'minutes' },
  { id: 'nutrition', name: 'Vegetable Servings', icon: '🥗', unit: 'servings' },
  { id: 'custom', name: 'Custom Goal', icon: '🎯', unit: 'custom' },
];

// Sample initial goals for demo purposes
const INITIAL_GOALS = [
  {
    id: '1',
    type: 'weight',
    name: 'Reach Target Weight',
    targetValue: 75,
    currentValue: 82,
    initialValue: 90,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    progress: 67, // calculated as (initial - current) / (initial - target) * 100
    unit: 'kg',
    icon: '⚖️',
    streakDays: 30,
    history: [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), value: 90 },
      { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), value: 88 },
      { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), value: 86 },
      { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), value: 85 },
      { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), value: 84 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 83 },
      { date: new Date().toISOString(), value: 82 },
    ],
  },
  {
    id: '2',
    type: 'steps',
    name: 'Daily Steps',
    targetValue: 10000,
    currentValue: 8500,
    initialValue: 5000,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    progress: 70, // calculated
    unit: 'steps',
    icon: '👣',
    streakDays: 14,
    history: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 6000 },
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 6500 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 7000 },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 7500 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 8000 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 8200 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 8500 },
    ],
  },
  {
    id: '3',
    type: 'workout',
    name: 'Weekly Workouts',
    targetValue: 4,
    currentValue: 3,
    initialValue: 1,
    startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    progress: 75,
    unit: 'sessions',
    icon: '💪',
    streakDays: 21,
    history: [
      { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), value: 1 },
      { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), value: 2 },
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 3 },
    ],
  },
];

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper function to calculate days left until target
const calculateDaysLeft = (targetDateString: string) => {
  const targetDate = new Date(targetDateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function HealthGoalsPage() {
  const { user } = useUserContext();
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'weight',
    name: '',
    targetValue: 0,
    currentValue: 0,
    unit: 'kg',
  });
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.name || newGoal.targetValue === 0) return;

    const goalType = GOAL_TYPES.find(type => type.id === newGoal.type);
    
    const goal = {
      id: Date.now().toString(),
      type: newGoal.type,
      name: newGoal.name,
      targetValue: newGoal.targetValue,
      currentValue: newGoal.currentValue || 0,
      initialValue: newGoal.currentValue || 0,
      startDate: new Date().toISOString(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now by default
      progress: 0,
      unit: goalType?.unit || 'units',
      icon: goalType?.icon || '🎯',
      streakDays: 0,
      history: [
        { date: new Date().toISOString(), value: newGoal.currentValue || 0 },
      ],
    };

    setGoals([...goals, goal]);
    setNewGoal({
      type: 'weight',
      name: '',
      targetValue: 0,
      currentValue: 0,
      unit: 'kg',
    });
    setShowNewGoalForm(false);
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    if (selectedGoal === id) setSelectedGoal(null);
  };

  // Update goal progress
  const handleUpdateProgress = (id: string, newValue: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        // Calculate new progress percentage
        let progress;
        // For goals where target < initial (e.g., weight loss)
        if (goal.targetValue < goal.initialValue) {
          progress = Math.min(100, Math.max(0, 
            ((goal.initialValue - newValue) / (goal.initialValue - goal.targetValue)) * 100
          ));
        } 
        // For goals where target > initial (e.g., steps increase)
        else {
          progress = Math.min(100, Math.max(0,
            ((newValue - goal.initialValue) / (goal.targetValue - goal.initialValue)) * 100
          ));
        }
        
        // Add new value to history
        const newHistory = [...goal.history, { date: new Date().toISOString(), value: newValue }];
        
        return {
          ...goal,
          currentValue: newValue,
          progress: Math.round(progress),
          history: newHistory,
        };
      }
      return goal;
    }));
  };

  // Calculate progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Goals</h1>
        <Button 
          onClick={() => setShowNewGoalForm(true)}
          className="flex items-center"
          size="sm"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add New Goal
        </Button>
      </div>

      {/* New Goal Form */}
      {showNewGoalForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Type
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    const goalType = GOAL_TYPES.find(type => type.id === selectedType);
                    setNewGoal({
                      ...newGoal,
                      type: selectedType,
                      unit: goalType?.unit || 'units',
                    });
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {GOAL_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Lose 10kg, Walk 10,000 steps daily"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Value
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={newGoal.currentValue || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, currentValue: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-md rounded-r-none border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    {newGoal.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Value
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={newGoal.targetValue || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-md rounded-r-none border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    {newGoal.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewGoalForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                disabled={!newGoal.name || newGoal.targetValue === 0}
              >
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">You don't have any health goals yet.</p>
          <Button
            onClick={() => setShowNewGoalForm(true)}
            className="mt-4"
          >
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map(goal => (
            <Card 
              key={goal.id} 
              className={`cursor-pointer transition-shadow hover:shadow-lg ${selectedGoal === goal.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{goal.icon}</span>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGoal(goal.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {goal.currentValue} {goal.unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Target:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                  <div 
                    className={`${getProgressColor(goal.progress)} h-2.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">complete</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {calculateDaysLeft(goal.targetDate)} days left
                  </div>
                </div>

                {/* Streak indicator */}
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-orange-500 mr-1">🔥</span>
                  <span className="font-medium text-gray-900 dark:text-white">{goal.streakDays}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">day streak</span>
                </div>

                {/* Show Update Form if selected */}
                {selectedGoal === goal.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Update Today's Progress
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          defaultValue={goal.currentValue}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = e.currentTarget.previousElementSibling?.querySelector('input');
                          if (input) {
                            handleUpdateProgress(goal.id, parseFloat(input.value) || 0);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </div>

                    {/* Simple trend visualization */}
                    {goal.history.length > 1 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Recent Progress
                        </div>
                        <div className="flex items-end h-24 space-x-1">
                          {goal.history.slice(-7).map((entry, index) => {
                            // Normalize height based on min/max values in history
                            const entries = goal.history.slice(-7);
                            const values = entries.map(e => e.value);
                            const min = Math.min(...values);
                            const max = Math.max(...values);
                            const range = max - min || 1;
                            const normalizedHeight = ((entry.value - min) / range) * 100;
                            
                            // Is this the first or last entry?
                            const isFirst = index === 0;
                            const isLast = index === entries.length - 1;
                            
                            // Determine if value is better than previous
                            const isBetter = index > 0 && 
                              ((goal.targetValue < goal.initialValue && entry.value < entries[index-1].value) || 
                               (goal.targetValue > goal.initialValue && entry.value > entries[index-1].value));
                            
                            return (
                              <div key={index} className="flex flex-col items-center flex-1">
                                {isLast && (
                                  <div className={`mb-1 ${isBetter ? 'text-green-500' : 'text-red-500'}`}>
                                    {isBetter ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                                  </div>
                                )}
                                <div 
                                  className={`w-full ${isLast ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} rounded-t`}
                                  style={{ height: `${Math.max(10, normalizedHeight)}%` }}
                                ></div>
                                <div className="text-xs mt-1 text-gray-500 truncate w-full text-center">
                                  {new Date(entry.date).toLocaleDateString(undefined, {day: '2-digit'})}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
"use client";

import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../lib/hooks/UserContext';
import { format } from 'date-fns';
import { BellIcon, CheckCircleIcon } from 'lucide-react';

// Define reminder types
type Reminder = {
  id: string;
  title: string;
  description: string;
  time?: string;
  type: 'workout' | 'water' | 'meal' | 'sleep' | 'measurement';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export default function PersonalizedReminders() {
  const { user } = useUserContext();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentDate] = useState(new Date());

  // Generate personalized reminders based on user data
  useEffect(() => {
    if (!user) return;

    const userSpecificReminders: Reminder[] = [];

    // Generate workout reminder based on user's activity level
    if (user.stats.activityLevel) {
      const activityMap = {
        'sedentary': 'start with a 15-minute walk',
        'light': 'do a 20-minute home workout',
        'moderate': 'complete your 30-minute cardio session',
        'active': 'hit the gym for your strength training',
        'very active': "don't forget your high-intensity interval training"
      };
      
      const activitySuggestion = activityMap[user.stats.activityLevel] || 'exercise today';
      
      userSpecificReminders.push({
        id: '1',
        title: 'Workout Reminder',
        description: `Don't forget to ${activitySuggestion} today!`,
        time: '5:00 PM',
        type: 'workout',
        completed: false,
        priority: 'high',
      });
    }

    // Add water reminder based on weight
    if (user.stats.weight) {
      const waterAmount = Math.round((user.stats.weight * 0.033) * 10) / 10; // 33ml per kg
      userSpecificReminders.push({
        id: '2',
        title: 'Hydration Check',
        description: `Aim to drink ${waterAmount} liters of water today`,
        type: 'water',
        completed: false,
        priority: 'medium',
      });
    }

    // Add meal planning reminder based on dietary preferences
    if (user.preferences.dietaryPreferences?.length > 0) {
      const dietaryPrefs = user.preferences.dietaryPreferences.join(', ');
      userSpecificReminders.push({
        id: '3',
        title: 'Meal Planning',
        description: `Plan your meals considering your ${dietaryPrefs} preferences`,
        time: '7:00 AM',
        type: 'meal',
        completed: false,
        priority: 'medium',
      });
    }

    // Add sleep reminder
    userSpecificReminders.push({
      id: '4',
      title: 'Sleep Schedule',
      description: 'Aim for 7-8 hours of sleep tonight',
      time: '10:00 PM',
      type: 'sleep',
      completed: false,
      priority: 'high',
    });

    // Add body measurement reminder (weekly)
    if (currentDate.getDay() === 1) { // Monday
      userSpecificReminders.push({
        id: '5',
        title: 'Weekly Check-in',
        description: 'Log your weight and measurements for weekly tracking',
        type: 'measurement',
        completed: false,
        priority: 'low',
      });
    }

    setReminders(userSpecificReminders);
  }, [user, currentDate]);

  const toggleReminderCompletion = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  if (!user || reminders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
        <div className="flex items-center">
          <BellIcon className="h-6 w-6 text-white mr-2" />
          <h3 className="text-lg font-semibold text-white">Personalized Reminders</h3>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-start gap-3">
              <button 
                onClick={() => toggleReminderCompletion(reminder.id)}
                className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                  reminder.completed 
                    ? 'text-green-500 bg-green-100 dark:bg-green-900/20'
                    : 'text-gray-400 bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <CheckCircleIcon className="h-5 w-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className={`font-medium ${reminder.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {reminder.title}
                  </p>
                  {reminder.time && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {reminder.time}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${reminder.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  {reminder.description}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    reminder.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} priority
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
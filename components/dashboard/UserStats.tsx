"use client";

import React from 'react';
import { useUserContext } from '../../lib/hooks/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { calculateBMI, getBMICategory } from '../../lib/utils/health-calculations';
import { formatWeight, formatHeight } from '../../lib/utils/formatting';
import ProgressBar from '../ui/ProgressBar';

export default function UserStats() {
  const { user } = useUserContext();

  if (!user || !user.height || !user.weight) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Please update your profile with your height and weight to see your stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  const bmi = calculateBMI(user.weight, user.height);
  const bmiCategory = getBMICategory(bmi);
  const measurementSystem = user.preferences?.measurementSystem || 'metric';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatWeight(user.weight, measurementSystem)}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatHeight(user.height, measurementSystem)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BMI</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {bmi.toFixed(1)}
              </p>
              <div className="flex items-center mt-1">
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    bmiCategory.color === 'green' ? 'bg-green-500' :
                    bmiCategory.color === 'yellow' ? 'bg-yellow-500' :
                    bmiCategory.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                ></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {bmiCategory.category}
                </span>
              </div>
            </div>
            {user.goals && user.goals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goals Progress</h4>
                {user.goals.map((goal) => (
                  <div key={goal.id} className="mb-3">
                    <ProgressBar
                      value={goal.progress * 100}
                      label={typeof goal.target === 'string' ? goal.target : `${goal.type}: ${goal.target}`}
                      color={goal.type === 'weight' ? 'blue' : goal.type === 'exercise' ? 'green' : 'purple'}
                      showValue
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
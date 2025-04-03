"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { useUserContext } from '../../lib/hooks/UserContext';
import { LightBulbIcon, ArrowPathIcon, PlayIcon, BookmarkIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';

// Sample workout data
const WORKOUT_SUGGESTIONS = {
  beginner: [
    {
      id: 1,
      title: 'Full Body Beginner Workout',
      type: 'strength',
      difficulty: 'beginner',
      duration: 30,
      caloriesBurn: 200,
      description: 'A full body workout designed to build strength foundations for beginners.',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: 12, restSeconds: 60 },
        { name: 'Push-ups (Modified if needed)', sets: 3, reps: 8, restSeconds: 60 },
        { name: 'Glute Bridges', sets: 3, reps: 12, restSeconds: 60 },
        { name: 'Plank', sets: 3, duration: '20 seconds', restSeconds: 60 },
        { name: 'Dumbbell Rows (Light weight)', sets: 3, reps: 10, restSeconds: 60 },
      ]
    },
    {
      id: 2,
      title: 'Cardio for Beginners',
      type: 'cardio',
      difficulty: 'beginner',
      duration: 25,
      caloriesBurn: 180,
      description: 'A gentle introduction to cardio training with intervals of low-impact exercises.',
      exercises: [
        { name: 'Brisk Walking', duration: '5 minutes', intensity: 'Light' },
        { name: 'Marching in Place', duration: '2 minutes', intensity: 'Moderate' },
        { name: 'Step Touches', duration: '2 minutes', intensity: 'Light' },
        { name: 'Walking Lunges', duration: '2 minutes', intensity: 'Moderate' },
        { name: 'Seated Rest', duration: '1 minute', intensity: 'Recovery' },
        { name: 'Repeat Above Sequence', duration: '13 minutes', intensity: 'Varied' },
      ]
    }
  ],
  intermediate: [
    {
      id: 3,
      title: 'Intermediate HIIT Workout',
      type: 'hiit',
      difficulty: 'intermediate',
      duration: 35,
      caloriesBurn: 350,
      description: 'A high-intensity interval training workout that combines cardio and strength exercises.',
      exercises: [
        { name: 'Jump Squats', duration: '40 seconds', restSeconds: 20 },
        { name: 'Push-ups', duration: '40 seconds', restSeconds: 20 },
        { name: 'Burpees', duration: '40 seconds', restSeconds: 20 },
        { name: 'Mountain Climbers', duration: '40 seconds', restSeconds: 20 },
        { name: 'Plank Jacks', duration: '40 seconds', restSeconds: 20 },
        { name: 'Rest', duration: '1 minute', intensity: 'Recovery' },
        { name: 'Repeat Circuit 3 Times', duration: '', intensity: '' },
      ]
    },
    {
      id: 4,
      title: 'Upper Body Focus',
      type: 'strength',
      difficulty: 'intermediate',
      duration: 40,
      caloriesBurn: 280,
      description: 'Target your chest, back, shoulders and arms with this comprehensive upper body workout.',
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 12, restSeconds: 60 },
        { name: 'Dumbbell Rows', sets: 4, reps: 12, restSeconds: 60 },
        { name: 'Shoulder Press', sets: 3, reps: 10, restSeconds: 60 },
        { name: 'Bicep Curls', sets: 3, reps: 12, restSeconds: 45 },
        { name: 'Tricep Dips', sets: 3, reps: 12, restSeconds: 45 },
        { name: 'Plank to Push-up', sets: 3, reps: 10, restSeconds: 60 },
      ]
    }
  ],
  advanced: [
    {
      id: 5,
      title: 'Advanced CrossFit-Style Workout',
      type: 'crossfit',
      difficulty: 'advanced',
      duration: 45,
      caloriesBurn: 450,
      description: 'A high-intensity CrossFit-inspired workout that will challenge your strength and endurance.',
      exercises: [
        { name: 'Complete as many rounds as possible in 20 minutes:', reps: null, sets: null },
        { name: 'Pull-ups', reps: 10, sets: null },
        { name: 'Kettlebell Swings (24kg/16kg)', reps: 15, sets: null },
        { name: 'Box Jumps (24"/20")', reps: 12, sets: null },
        { name: 'Rest', duration: '2 minutes', intensity: 'Recovery' },
        { name: 'Then, 5 sets for time:', reps: null, sets: null },
        { name: 'Deadlifts (225lb/155lb)', reps: 5, sets: 5 },
        { name: 'Handstand Push-ups or Pike Push-ups', reps: 10, sets: 5 },
      ]
    },
    {
      id: 6,
      title: 'Advanced Leg Crusher',
      type: 'strength',
      difficulty: 'advanced',
      duration: 55,
      caloriesBurn: 420,
      description: 'An intensive leg workout designed to build strength, power and endurance in your lower body.',
      exercises: [
        { name: 'Barbell Squats', sets: 5, reps: '5 (heavy weight)', restSeconds: 120 },
        { name: 'Romanian Deadlifts', sets: 4, reps: 8, restSeconds: 90 },
        { name: 'Walking Lunges with Dumbbells', sets: 3, reps: '12 each leg', restSeconds: 90 },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each leg', restSeconds: 60 },
        { name: 'Leg Press', sets: 3, reps: 12, restSeconds: 60 },
        { name: 'Calf Raises', sets: 4, reps: 15, restSeconds: 45 },
        { name: 'Plyo Box Jumps', sets: 3, reps: 10, restSeconds: 60 },
      ]
    }
  ]
};

// Fitness tips based on level
const FITNESS_TIPS = {
  beginner: [
    "Start slow and focus on proper form rather than intensity",
    "Aim for consistency over perfection - even short workouts count",
    "Allow 48 hours of recovery between strength training the same muscle group",
    "Stay hydrated before, during, and after your workouts",
    "Listen to your body and don't push through sharp pain"
  ],
  intermediate: [
    "Consider splitting your workouts by muscle groups for better recovery",
    "Add progressive overload by gradually increasing weight, reps, or sets",
    "Include both compound and isolation exercises in your routine",
    "Track your workouts to see progress and stay motivated",
    "Incorporate active recovery days with light activity like walking or yoga"
  ],
  advanced: [
    "Periodize your training to avoid plateaus and prevent overtraining",
    "Consider adding specialized techniques like drop sets or supersets",
    "Fine-tune your nutrition to match your specific training goals",
    "Schedule deload weeks every 4-6 weeks to allow for recovery",
    "Focus on weak points or imbalances to prevent injuries and improve performance"
  ]
};

export default function WorkoutSuggestions() {
  const { user } = useUserContext();
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [workoutType, setWorkoutType] = useState<'all' | 'strength' | 'cardio' | 'hiit' | 'crossfit'>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<number[]>([]);
  
  // Use a ref to store the timer ID
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // AI personalized suggestion based on user data
  const getPersonalizedSuggestion = useCallback(() => {
    // In a real app, this would use AI to analyze user data
    // For demo, we'll return a tip based on selected fitness level
    return fitnessLevel === 'beginner' 
      ? "Based on your goals and experience level, start with 2-3 full body workouts per week with at least one day of rest between sessions. Focus on learning proper form and building consistency."
      : fitnessLevel === 'intermediate'
      ? "Your profile indicates you're ready for more structured training. Try a 4-day split targeting different muscle groups, with a mix of compound and isolation exercises to build balanced strength."
      : "Your advanced fitness level allows for specialized training. Consider a 5-day training split with periodized programming to continue making progress and avoiding plateaus.";
  }, [fitnessLevel]);

  // Handle AI generation separately with proper timeout cleanup
  const generateNewSuggestion = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setIsGenerating(true);
    
    // Store the timer ID in ref so we can clear it if needed
    timerRef.current = setTimeout(() => {
      setIsGenerating(false);
      timerRef.current = null;
    }, 1500);
  }, []);

  const handleSaveWorkout = (workoutId: number) => {
    setSavedWorkouts((prev) => [...prev, workoutId]);
  };

  // Memoize filtered workouts to avoid recalculating on every render
  const filteredWorkouts = useMemo(() => {
    const levelWorkouts = WORKOUT_SUGGESTIONS[fitnessLevel] || [];
    if (workoutType === 'all') return levelWorkouts;
    return levelWorkouts.filter(workout => workout.type === workoutType);
  }, [fitnessLevel, workoutType]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Customize Workout Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Fitness Level
                </label>
                <select
                  id="fitnessLevel"
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workout Type
                </label>
                <select
                  id="workoutType"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio</option>
                  <option value="hiit">HIIT</option>
                  <option value="crossfit">CrossFit</option>
                </select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personalized AI Suggestion
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                      <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-blue-700 dark:text-blue-400 ml-2">Analyzing your fitness profile...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-blue-700 dark:text-blue-400">
                        <LightBulbIcon className="inline-block h-5 w-5 mr-1" />
                        {getPersonalizedSuggestion()}
                      </p>
                      <button
                        onClick={generateNewSuggestion}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        <ArrowPathIcon className="h-3 w-3 mr-1" />
                        Generate New Suggestion
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tips for {fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)} Level
                </h3>
                <ul className="space-y-2 text-sm">
                  {FITNESS_TIPS[fitnessLevel].map((tip, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Recommended Workouts
        </h2>
        
        {filteredWorkouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No workouts found matching your criteria. Try changing your filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{workout.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} • {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                    </p>
                  </div>
                  <div className="flex space-x-2 text-sm">
                    <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {workout.duration} min
                    </div>
                    <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                      <FireIcon className="h-4 w-4 mr-1" />
                      {workout.caloriesBurn} cal
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {workout.description}
                </p>
                
                {selectedWorkout === workout.id ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Exercises</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Exercise
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Sets/Duration
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Reps/Intensity
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Rest
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {workout.exercises.map((exercise, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {exercise.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {exercise.sets ? `${exercise.sets} sets` : exercise.duration}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {exercise.reps ? `${exercise.reps} reps` : exercise.intensity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {exercise.restSeconds ? `${exercise.restSeconds}s` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex space-x-3 mt-2">
                      <Button
                        onClick={() => setSelectedWorkout(null)}
                        variant="outline"
                      >
                        Close
                      </Button>
                      <Button>
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                      {!savedWorkouts.includes(workout.id) && (
                        <Button
                          onClick={() => handleSaveWorkout(workout.id)}
                          variant="outline"
                        >
                          <BookmarkIcon className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Exercises:</span>{' '}
                        <span className="font-medium">{workout.exercises.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {savedWorkouts.includes(workout.id) && (
                        <span className="text-green-600 mr-3 flex items-center text-sm">
                          <BookmarkIcon className="h-4 w-4 mr-1" />
                          Saved
                        </span>
                      )}
                      <Button
                        onClick={() => setSelectedWorkout(workout.id)}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
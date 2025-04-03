import { Workout, Meal, HealthMetric, MotivationalMessage } from '../types';

// Mock workouts for the demo
export const mockWorkouts: Workout[] = [
  {
    id: '1',
    userId: '1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
    duration: 45,
    exercises: [
      {
        id: '101',
        name: 'Bench Press',
        type: 'strength',
        sets: [
          { reps: 10, weight: 60, restTime: 90 },
          { reps: 8, weight: 65, restTime: 90 },
          { reps: 6, weight: 70, restTime: 90 },
        ],
      },
      {
        id: '102',
        name: 'Squats',
        type: 'strength',
        sets: [
          { reps: 12, weight: 80, restTime: 120 },
          { reps: 10, weight: 90, restTime: 120 },
          { reps: 8, weight: 100, restTime: 120 },
        ],
      },
    ],
    calories: 320,
  },
  {
    id: '2',
    userId: '1',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    duration: 30,
    exercises: [
      {
        id: '201',
        name: 'Running',
        type: 'cardio',
        duration: 30,
        distance: 5,
        calories: 350,
      },
    ],
    calories: 350,
  },
  {
    id: '3',
    userId: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    duration: 60,
    exercises: [
      {
        id: '301',
        name: 'Pull-ups',
        type: 'strength',
        sets: [
          { reps: 8, restTime: 60 },
          { reps: 7, restTime: 60 },
          { reps: 6, restTime: 60 },
        ],
      },
      {
        id: '302',
        name: 'Deadlifts',
        type: 'strength',
        sets: [
          { reps: 10, weight: 100, restTime: 120 },
          { reps: 8, weight: 110, restTime: 120 },
          { reps: 6, weight: 120, restTime: 120 },
        ],
      },
      {
        id: '303',
        name: 'Planks',
        type: 'strength',
        sets: [
          { reps: 1, duration: 60 },
          { reps: 1, duration: 45 },
          { reps: 1, duration: 30 },
        ],
      },
    ],
    calories: 450,
  },
];

// Mock meals for the demo
export const mockMeals: Meal[] = [
  {
    id: '1',
    userId: '1',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    type: 'breakfast',
    foods: [
      {
        id: '101',
        name: 'Oatmeal',
        portion: 1,
        calories: 150,
        protein: 5,
        carbs: 27,
        fats: 3,
        fiber: 4,
      },
      {
        id: '102',
        name: 'Banana',
        portion: 1,
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fats: 0.4,
        fiber: 3.1,
      },
      {
        id: '103',
        name: 'Protein Shake',
        portion: 1,
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1,
        fiber: 0,
      },
    ],
    totalCalories: 375,
  },
  {
    id: '2',
    userId: '1',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    type: 'lunch',
    foods: [
      {
        id: '201',
        name: 'Grilled Chicken Breast',
        portion: 1,
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        fiber: 0,
      },
      {
        id: '202',
        name: 'Brown Rice',
        portion: 1,
        calories: 216,
        protein: 5,
        carbs: 45,
        fats: 1.8,
        fiber: 3.5,
      },
      {
        id: '203',
        name: 'Broccoli',
        portion: 1,
        calories: 55,
        protein: 3.7,
        carbs: 11.2,
        fats: 0.6,
        fiber: 5.1,
      },
    ],
    totalCalories: 436,
  },
];

// Mock health metrics for the demo
export const mockHealthMetrics: HealthMetric[] = [
  // Weight measurements
  {
    id: '1',
    userId: '1',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    type: 'weight',
    value: 75,
    unit: 'kg',
  },
  {
    id: '2',
    userId: '1',
    date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
    type: 'weight',
    value: 74.2,
    unit: 'kg',
  },
  {
    id: '3',
    userId: '1',
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
    type: 'weight',
    value: 73.1,
    unit: 'kg',
  },
  {
    id: '4',
    userId: '1',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    type: 'weight',
    value: 72.3,
    unit: 'kg',
  },
  {
    id: '5',
    userId: '1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'weight',
    value: 71.5,
    unit: 'kg',
  },
  // Heart rate
  {
    id: '6',
    userId: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: 'heartRate',
    value: 72,
    unit: 'bpm',
  },
  {
    id: '7',
    userId: '1',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    type: 'heartRate',
    value: 68,
    unit: 'bpm',
  },
  {
    id: '8',
    userId: '1',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'heartRate',
    value: 75,
    unit: 'bpm',
  },
  {
    id: '9',
    userId: '1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'heartRate',
    value: 71,
    unit: 'bpm',
  },
  {
    id: '10',
    userId: '1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'heartRate',
    value: 69,
    unit: 'bpm',
  },
  // Water intake
  {
    id: '11',
    userId: '1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'water',
    value: 2200,
    unit: 'ml',
  },
];

// Mock motivational messages
export const mockMotivationalMessages: MotivationalMessage[] = [
  {
    id: '1',
    content: "Great job on your workout yesterday! Keep up the momentum.",
    type: 'achievement',
  },
  {
    id: '2',
    content: "You're making progress towards your weight goal! Already 30% there.",
    type: 'milestone',
    relatedGoal: '1',
  },
  {
    id: '3',
    content: "Remember, consistency is key. Try to get in at least 30 minutes of exercise today.",
    type: 'daily',
  },
  {
    id: '4',
    content: "It's been 2 days since your last workout. Let's get moving today!",
    type: 'reminder',
  },
  {
    id: '5',
    content: "Drinking water is essential for recovery. Aim for 2-3 liters today.",
    type: 'daily',
  },
]; 
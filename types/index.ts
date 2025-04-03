export interface User {
  id: string;
  name: string;
  email: string;
  height?: number; // in cm
  weight?: number; // in kg
  goals?: UserGoal[];
  preferences?: UserPreferences;
}

export interface UserGoal {
  id: string;
  type: 'weight' | 'exercise' | 'nutrition' | 'custom';
  target: string | number;
  deadline?: Date;
  progress: number;
  completed: boolean;
}

export interface UserPreferences {
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  motivationFrequency: 'daily' | 'weekly' | 'monthly' | 'achievements';
}

export interface Workout {
  id: string;
  userId: string;
  date: Date;
  duration: number; // in minutes
  exercises: Exercise[];
  notes?: string;
  calories?: number; // estimated calories burned
}

export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'balance';
  sets?: Set[];
  duration?: number; // in minutes (for cardio, etc.)
  distance?: number; // in km/miles
  calories?: number; // estimated calories burned
}

export interface Set {
  reps: number;
  weight?: number; // in kg/lbs
  duration?: number; // in seconds (for planks, etc.)
  restTime?: number; // in seconds
}

export interface Meal {
  id: string;
  userId: string;
  date: Date;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  totalCalories: number;
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  portion: number; // in servings
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fats?: number; // in grams
  fiber?: number; // in grams
}

export interface HealthMetric {
  id: string;
  userId: string;
  date: Date;
  type: 'weight' | 'bodyFat' | 'heartRate' | 'steps' | 'sleep' | 'water' | 'custom';
  value: number;
  unit: string;
  notes?: string;
}

export interface MotivationalMessage {
  id: string;
  content: string;
  type: 'achievement' | 'milestone' | 'daily' | 'reminder';
  relatedGoal?: string;
} 
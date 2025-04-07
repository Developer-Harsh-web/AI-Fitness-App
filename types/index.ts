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
  image?: string; // path to food image
  description?: string; // portion size description
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

// Device integration interfaces
export interface ConnectedDevice {
  id: string;
  userId: string;
  type: 'oura' | 'whoop' | 'fitbit' | 'garmin' | 'apple_health' | 'google_fit' | 'samsung_health';
  name: string;
  connected: boolean;
  lastSynced?: Date;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  settings?: Record<string, any>;
}

export interface DeviceData {
  id: string;
  userId: string;
  deviceId: string;
  date: Date;
  type: 'sleep' | 'activity' | 'readiness' | 'heart_rate' | 'hrv' | 'steps' | 'calories' | 'workout';
  data: Record<string, any>;
  source: string;
}

// Enhanced nutrition interfaces
export interface ExtendedFood extends Food {
  brand?: string;
  servingSize?: string;
  servingSizeUnit?: string;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  glycemicIndex?: number;
  allergens?: string[];
  organic?: boolean;
  verified?: boolean;
}

// Community features
export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  membersCount: number;
  isPrivate: boolean;
  image?: string;
  tags?: string[];
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  status: 'active' | 'inactive' | 'banned';
}

export interface Post {
  id: string;
  userId: string;
  groupId?: string;
  content: string;
  mediaUrls?: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt?: Date;
  type: 'text' | 'workout' | 'achievement' | 'progress' | 'question';
  workoutId?: string;
  privacy: 'public' | 'friends' | 'group' | 'private';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
} 
// Calculate BMI (Body Mass Index)
// Formula: weight (kg) / (height (m) ^ 2)
export function calculateBMI(weight: number, height: number): number {
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Get BMI category
export function getBMICategory(bmi: number): {
  category: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
} {
  if (bmi < 18.5) {
    return { category: 'Underweight', color: 'yellow' };
  } else if (bmi >= 18.5 && bmi < 25) {
    return { category: 'Normal weight', color: 'green' };
  } else if (bmi >= 25 && bmi < 30) {
    return { category: 'Overweight', color: 'orange' };
  } else {
    return { category: 'Obesity', color: 'red' };
  }
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number {
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    very_active: 1.9, // Very hard exercise and physical job
  };
  
  return bmr * activityMultipliers[activityLevel];
}

// Calculate daily calorie needs based on goal
export function calculateCaloriesForGoal(
  tdee: number,
  goal: 'lose' | 'maintain' | 'gain',
  intensity: 'light' | 'moderate' | 'aggressive' = 'moderate'
): number {
  const adjustments = {
    lose: {
      light: -250,
      moderate: -500,
      aggressive: -750,
    },
    maintain: {
      light: 0,
      moderate: 0,
      aggressive: 0,
    },
    gain: {
      light: 250,
      moderate: 500,
      aggressive: 750,
    },
  };
  
  return Math.max(1200, tdee + adjustments[goal][intensity]);
}

// Calculate ideal weight range based on healthy BMI range (18.5-24.9)
export function calculateIdealWeightRange(height: number): { min: number; max: number } {
  const heightInMeters = height / 100;
  const minBMI = 18.5;
  const maxBMI = 24.9;
  
  return {
    min: Math.round(minBMI * heightInMeters * heightInMeters),
    max: Math.round(maxBMI * heightInMeters * heightInMeters),
  };
}

// Estimate body fat percentage (very rough estimate) based on BMI
// This is only a rough approximation and should not be used for medical purposes
export function estimateBodyFatPercentage(
  bmi: number,
  age: number,
  gender: 'male' | 'female'
): number {
  // This is a simplified formula and not very accurate
  if (gender === 'male') {
    return (1.20 * bmi) + (0.23 * age) - 16.2;
  } else {
    return (1.20 * bmi) + (0.23 * age) - 5.4;
  }
} 
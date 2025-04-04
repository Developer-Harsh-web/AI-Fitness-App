import { Food } from '../../types';

// Food icon mapping
export interface FoodIconsType {
  chicken: string;
  rice: string;
  broccoli: string;
  salmon: string;
  sweetPotato: string;
  avocado: string;
  egg: string;
  oatmeal: string;
  banana: string;
  yogurt: string;
  spinach: string;
  nuts: string;
  protein: string;
  carbs: string;
  fats: string;
  default: string;
  [key: string]: string;
}

export const FOOD_ICONS: FoodIconsType = {
  chicken: '🍗',
  rice: '🍚',
  broccoli: '🥦',
  salmon: '🐟',
  sweetPotato: '🍠',
  avocado: '🥑',
  egg: '🥚',
  oatmeal: '🥣',
  banana: '🍌',
  yogurt: '🥛',
  spinach: '🥬',
  nuts: '🥜',
  // Add nutrient icons
  protein: '🥩',
  carbs: '🍚',
  fats: '🥑',
  default: '🍽️'
};

// Meal type images
export const MEAL_TYPE_IMAGES = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍲',
  snack: '🍌',
};

// Common food database with nutrition info
export const COMMON_FOODS: Food[] = [
  { id: '1', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: 1, image: 'chicken' },
  { id: '2', name: 'Brown Rice (100g, cooked)', calories: 112, protein: 2.6, carbs: 23, fats: 0.9, portion: 1, image: 'rice' },
  { id: '3', name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, portion: 1, image: 'broccoli' },
  { id: '4', name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fats: 13, portion: 1, image: 'salmon' },
  { id: '5', name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, portion: 1, image: 'sweetPotato' },
  { id: '6', name: 'Avocado (1 medium)', calories: 240, protein: 3, carbs: 12, fats: 22, portion: 1, image: 'avocado' },
  { id: '7', name: 'Egg (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fats: 5, portion: 1, image: 'egg' },
  { id: '8', name: 'Oatmeal (100g, cooked)', calories: 71, protein: 2.5, carbs: 12, fats: 1.5, portion: 1, image: 'oatmeal' },
  { id: '9', name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, portion: 1, image: 'banana' },
  { id: '10', name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, portion: 1, image: 'yogurt' },
  { id: '11', name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, portion: 1, image: 'spinach' },
  { id: '12', name: 'Almonds (30g)', calories: 164, protein: 6, carbs: 6, fats: 14, portion: 1, image: 'nuts' },
];

// Utility functions
export function parsePortionFromDescription(description: string): number {
  if (!description) return 1;
  
  // Check for specific portion indicators
  const palmMatch = description.match(/size of (?:my|a) palm/i);
  const fistMatch = description.match(/size of (?:my|a) fist/i);
  const thumbMatch = description.match(/size of (?:my|a) thumb/i);
  const gramsMatch = description.match(/(\d+)\s*(?:g|grams)/i);
  const cupMatch = description.match(/(\d*\.?\d+)\s*cups?/i);
  const tbspMatch = description.match(/(\d*\.?\d+)\s*(?:tbsp|tablespoons?)/i);
  const tspMatch = description.match(/(\d*\.?\d+)\s*(?:tsp|teaspoons?)/i);
  
  // Parse quantity based on description
  if (palmMatch) {
    // Palm sized portion is roughly 100g
    return 1;
  } else if (fistMatch) {
    // Fist sized portion is roughly 1 cup
    return 1;
  } else if (thumbMatch) {
    // Thumb sized portion is roughly 1 tbsp
    return 0.25; // smaller portion
  } else if (gramsMatch) {
    // Convert grams to standard portion
    const grams = parseInt(gramsMatch[1]);
    return grams / 100; // Assuming standard portion is 100g
  } else if (cupMatch) {
    // Use cup measurement
    return parseFloat(cupMatch[1]);
  } else if (tbspMatch) {
    // Convert tablespoons to portion
    return parseFloat(tbspMatch[1]) * 0.25;
  } else if (tspMatch) {
    // Convert teaspoons to portion
    return parseFloat(tspMatch[1]) * 0.08;
  }
  
  // Default to 1 portion if no specific measurement found
  return 1;
}

export function calculateMealTotals(mealFoods: Food[]) {
  return mealFoods.reduce(
    (totals, food) => ({
      calories: totals.calories + food.calories * food.portion,
      protein: totals.protein + (food.protein || 0) * food.portion,
      carbs: totals.carbs + (food.carbs || 0) * food.portion,
      fats: totals.fats + (food.fats || 0) * food.portion,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
} 
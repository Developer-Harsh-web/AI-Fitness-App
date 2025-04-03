"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useUserContext } from '../../lib/hooks/UserContext';
import Button from '../ui/Button';
import { LightBulbIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// AI-generated meal plans based on different goals
const MEAL_SUGGESTIONS = {
  weightLoss: [
    {
      id: 1,
      title: 'High Protein, Low Carb Plan',
      description: 'A meal plan focused on lean proteins and vegetables to support fat loss while preserving muscle.',
      calories: 1800,
      meals: [
        {
          type: 'breakfast',
          name: 'Greek Yogurt Bowl',
          ingredients: ['Greek yogurt', 'Berries', 'Almonds', 'Chia seeds'],
          calories: 320,
          protein: 25,
          carbs: 18,
          fats: 16,
        },
        {
          type: 'lunch',
          name: 'Grilled Chicken Salad',
          ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
          calories: 450,
          protein: 40,
          carbs: 15,
          fats: 22,
        },
        {
          type: 'dinner',
          name: 'Baked Salmon with Vegetables',
          ingredients: ['Salmon fillet', 'Broccoli', 'Cauliflower', 'Bell peppers', 'Olive oil'],
          calories: 520,
          protein: 38,
          carbs: 20,
          fats: 28,
        },
        {
          type: 'snack',
          name: 'Protein Shake with Almonds',
          ingredients: ['Whey protein', 'Almond milk', 'Almonds'],
          calories: 270,
          protein: 25,
          carbs: 8,
          fats: 14,
        },
      ],
    },
    {
      id: 2,
      title: 'Mediterranean Diet Plan',
      description: 'A heart-healthy eating plan that emphasizes whole foods, lean proteins, and healthy fats.',
      calories: 1900,
      meals: [
        {
          type: 'breakfast',
          name: 'Avocado and Egg Toast',
          ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Tomato', 'Olive oil'],
          calories: 380,
          protein: 18,
          carbs: 30,
          fats: 20,
        },
        {
          type: 'lunch',
          name: 'Mediterranean Bowl',
          ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Cherry tomatoes', 'Feta cheese', 'Olive oil'],
          calories: 480,
          protein: 20,
          carbs: 60,
          fats: 18,
        },
        {
          type: 'dinner',
          name: 'Grilled Fish with Vegetables',
          ingredients: ['White fish', 'Zucchini', 'Bell peppers', 'Onions', 'Olive oil', 'Lemon'],
          calories: 410,
          protein: 35,
          carbs: 15,
          fats: 22,
        },
        {
          type: 'snack',
          name: 'Hummus with Vegetables',
          ingredients: ['Hummus', 'Carrots', 'Cucumber', 'Bell peppers'],
          calories: 210,
          protein: 8,
          carbs: 25,
          fats: 10,
        },
      ],
    },
  ],
  muscleGain: [
    {
      id: 3,
      title: 'High Calorie Muscle Building Plan',
      description: 'A calorie-dense meal plan with ample protein to support muscle growth and recovery.',
      calories: 3200,
      meals: [
        {
          type: 'breakfast',
          name: 'Protein Oatmeal with Fruits',
          ingredients: ['Oats', 'Whey protein', 'Banana', 'Peanut butter', 'Whole milk'],
          calories: 650,
          protein: 40,
          carbs: 80,
          fats: 20,
        },
        {
          type: 'lunch',
          name: 'Chicken and Rice Bowl',
          ingredients: ['Chicken breast', 'Brown rice', 'Avocado', 'Broccoli', 'Olive oil'],
          calories: 750,
          protein: 50,
          carbs: 70,
          fats: 25,
        },
        {
          type: 'dinner',
          name: 'Steak with Sweet Potato',
          ingredients: ['Lean steak', 'Sweet potato', 'Asparagus', 'Olive oil', 'Butter'],
          calories: 700,
          protein: 45,
          carbs: 50,
          fats: 35,
        },
        {
          type: 'snack 1',
          name: 'Protein Smoothie',
          ingredients: ['Whey protein', 'Banana', 'Oats', 'Peanut butter', 'Whole milk'],
          calories: 550,
          protein: 35,
          carbs: 60,
          fats: 18,
        },
        {
          type: 'snack 2',
          name: 'Greek Yogurt with Honey and Nuts',
          ingredients: ['Greek yogurt', 'Honey', 'Mixed nuts', 'Granola'],
          calories: 350,
          protein: 25,
          carbs: 30,
          fats: 15,
        },
      ],
    },
  ],
  maintenance: [
    {
      id: 4,
      title: 'Balanced Maintenance Plan',
      description: 'A well-balanced meal plan designed to maintain current weight and support overall health.',
      calories: 2200,
      meals: [
        {
          type: 'breakfast',
          name: 'Veggie Omelet with Toast',
          ingredients: ['Eggs', 'Spinach', 'Mushrooms', 'Bell peppers', 'Whole grain toast', 'Avocado'],
          calories: 450,
          protein: 25,
          carbs: 30,
          fats: 24,
        },
        {
          type: 'lunch',
          name: 'Turkey Wrap with Veggies',
          ingredients: ['Turkey breast', 'Whole grain wrap', 'Lettuce', 'Tomato', 'Hummus'],
          calories: 520,
          protein: 35,
          carbs: 45,
          fats: 20,
        },
        {
          type: 'dinner',
          name: 'Baked Chicken with Quinoa and Vegetables',
          ingredients: ['Chicken breast', 'Quinoa', 'Broccoli', 'Carrots', 'Olive oil'],
          calories: 580,
          protein: 40,
          carbs: 50,
          fats: 22,
        },
        {
          type: 'snack',
          name: 'Apple with Almond Butter',
          ingredients: ['Apple', 'Almond butter'],
          calories: 250,
          protein: 7,
          carbs: 30,
          fats: 12,
        },
      ],
    },
  ],
  healthyEating: [
    {
      id: 5,
      title: 'Nutrient-Dense Whole Foods Plan',
      description: 'A nutrient-rich meal plan focused on whole foods and balanced macronutrients for optimal health.',
      calories: 2000,
      meals: [
        {
          type: 'breakfast',
          name: 'Superfood Smoothie Bowl',
          ingredients: ['Greek yogurt', 'Spinach', 'Banana', 'Berries', 'Chia seeds', 'Almond butter'],
          calories: 420,
          protein: 20,
          carbs: 50,
          fats: 18,
        },
        {
          type: 'lunch',
          name: 'Salmon and Quinoa Bowl',
          ingredients: ['Salmon', 'Quinoa', 'Avocado', 'Kale', 'Cherry tomatoes', 'Lemon dressing'],
          calories: 550,
          protein: 35,
          carbs: 45,
          fats: 25,
        },
        {
          type: 'dinner',
          name: 'Vegetable Stir-Fry with Tofu',
          ingredients: ['Tofu', 'Brown rice', 'Broccoli', 'Bell peppers', 'Carrots', 'Snow peas', 'Sesame oil'],
          calories: 480,
          protein: 25,
          carbs: 60,
          fats: 18,
        },
        {
          type: 'snack',
          name: 'Vegetable Sticks with Hummus',
          ingredients: ['Carrots', 'Cucumber', 'Bell peppers', 'Hummus'],
          calories: 180,
          protein: 8,
          carbs: 20,
          fats: 8,
        },
      ],
    },
  ],
};

// Nutrition tips for different goals
const NUTRITION_TIPS = {
  weightLoss: [
    "Focus on protein-rich foods to help preserve muscle while losing fat",
    "Include plenty of fiber to keep you feeling full longer",
    "Drink water before meals to reduce hunger and calorie intake",
    "Use smaller plates to help control portion sizes",
    "Limit added sugars and processed foods that are calorie-dense",
  ],
  muscleGain: [
    "Eat a caloric surplus of 300-500 calories above maintenance",
    "Aim for 1.6-2.2g of protein per kg of bodyweight daily",
    "Include carbs around your workouts to fuel training and recovery",
    "Don't neglect healthy fats which are crucial for hormone production",
    "Focus on nutrient-dense whole foods, not just calorie-dense options",
  ],
  maintenance: [
    "Balance your plate with 1/4 protein, 1/4 complex carbs, and 1/2 vegetables",
    "Practice mindful eating by paying attention to hunger and fullness cues",
    "Aim for a consistent meal schedule to help regulate metabolism",
    "Include a variety of foods to ensure you get diverse nutrients",
    "Monitor your weight weekly and adjust intake as needed to maintain",
  ],
  healthyEating: [
    "Eat a rainbow of fruits and vegetables to get diverse phytonutrients",
    "Include fermented foods like yogurt and sauerkraut for gut health",
    "Choose whole grains over refined grains for more fiber and nutrients",
    "Stay hydrated with water, herbal tea, and minimize sugary drinks",
    "Include sources of omega-3 fatty acids like fatty fish, walnuts, and flaxseeds",
  ],
};

export default function AINutritionSuggestions() {
  const { user } = useUserContext();
  const [nutritionGoal, setNutritionGoal] = useState<'weightLoss' | 'muscleGain' | 'maintenance' | 'healthyEating'>('weightLoss');
  const [selectedMealPlan, setSelectedMealPlan] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedMealPlans, setSavedMealPlans] = useState<number[]>([]);

  // AI personalized suggestion based on user data
  const getPersonalizedSuggestion = () => {
    // In a real app, this would use AI to analyze user data
    // For demo, we'll return a random tip based on selected goal
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
    
    return nutritionGoal === 'weightLoss' 
      ? "Based on your activity level and current diet, try increasing protein to 25-30% of your daily calories and reducing carbohydrates slightly. This may help with satiety while creating a moderate calorie deficit."
      : nutritionGoal === 'muscleGain'
      ? "Your protein intake is good, but you could benefit from adding 300-400 more calories daily, especially on training days. Consider adding a protein shake with banana and peanut butter after workouts."
      : nutritionGoal === 'maintenance'
      ? "Your current diet is well balanced. Consider adding more variety in your vegetable intake to ensure you're getting a wide range of micronutrients to support overall health."
      : "Your diet is lacking in some essential micronutrients. Try adding more leafy greens and colorful vegetables. Also consider increasing your omega-3 intake through fatty fish or supplements.";
  };

  const handleSaveMealPlan = (mealPlanId: number) => {
    setSavedMealPlans((prev) => [...prev, mealPlanId]);
  };

  const getCurrentMealPlans = () => {
    return MEAL_SUGGESTIONS[nutritionGoal] || [];
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Nutrition Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="nutritionGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Goal
                </label>
                <select
                  id="nutritionGoal"
                  value={nutritionGoal}
                  onChange={(e) => setNutritionGoal(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="weightLoss">Weight Loss</option>
                  <option value="muscleGain">Muscle Gain</option>
                  <option value="maintenance">Weight Maintenance</option>
                  <option value="healthyEating">Healthy Eating</option>
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
                      <span className="text-blue-700 dark:text-blue-400 ml-2">Analyzing your data...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-blue-700 dark:text-blue-400">
                        <LightBulbIcon className="inline-block h-5 w-5 mr-1" />
                        {getPersonalizedSuggestion()}
                      </p>
                      <button
                        onClick={() => setIsGenerating(true)}
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
                  Top Tips for {nutritionGoal === 'weightLoss' ? 'Weight Loss' : 
                               nutritionGoal === 'muscleGain' ? 'Muscle Gain' :
                               nutritionGoal === 'maintenance' ? 'Maintenance' : 'Healthy Eating'}
                </h3>
                <ul className="space-y-2 text-sm">
                  {NUTRITION_TIPS[nutritionGoal].map((tip, index) => (
                    <li key={index} className="flex">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
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
          AI-Generated Meal Plans
        </h2>
        
        {getCurrentMealPlans().map((mealPlan) => (
          <Card key={mealPlan.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{mealPlan.title}</CardTitle>
                <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {mealPlan.calories} calories
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {mealPlan.description}
              </p>
            </CardHeader>
            <CardContent>
              {selectedMealPlan === mealPlan.id ? (
                <div className="space-y-4">
                  {mealPlan.meals.map((meal, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white capitalize">
                        {meal.type}: {meal.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {meal.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                          <span className="font-medium block">{meal.calories}</span>
                          <span className="text-gray-500 dark:text-gray-400">calories</span>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                          <span className="font-medium block">{meal.protein}g</span>
                          <span className="text-gray-500 dark:text-gray-400">protein</span>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-center">
                          <span className="font-medium block">{meal.carbs}g</span>
                          <span className="text-gray-500 dark:text-gray-400">carbs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex space-x-3 mt-2">
                    <Button
                      onClick={() => setSelectedMealPlan(null)}
                      variant="outline"
                    >
                      Close
                    </Button>
                    {!savedMealPlans.includes(mealPlan.id) && (
                      <Button
                        onClick={() => handleSaveMealPlan(mealPlan.id)}
                      >
                        Save Meal Plan
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Meals:</span>{' '}
                      <span className="font-medium">{mealPlan.meals.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Protein:</span>{' '}
                      <span className="font-medium">
                        {mealPlan.meals.reduce((total, meal) => total + meal.protein, 0)}g
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Carbs:</span>{' '}
                      <span className="font-medium">
                        {mealPlan.meals.reduce((total, meal) => total + meal.carbs, 0)}g
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {savedMealPlans.includes(mealPlan.id) && (
                      <span className="text-green-600 mr-3 flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Saved
                      </span>
                    )}
                    <Button
                      onClick={() => setSelectedMealPlan(mealPlan.id)}
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
        ))}
      </div>
    </div>
  );
} 
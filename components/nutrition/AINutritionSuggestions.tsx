"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useUserContext } from '../../lib/hooks/UserContext';
import Button from '../ui/Button';
import { LightBulbIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Label } from '../ui/Label';

// Food icon mapping
const FOOD_ICONS = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍲',
  snack: '🍌',
  protein: '🥩',
  carbs: '🍚',
  fats: '🥑',
  fruits: '🍎',
  vegetables: '🥦',
};

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
  const [goal, setGoal] = useState<'weightLoss' | 'muscleGain' | 'maintenance' | 'healthyEating'>('weightLoss');
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
    
    return goal === 'weightLoss' 
      ? "Based on your activity level and current diet, try increasing protein to 25-30% of your daily calories and reducing carbohydrates slightly. This may help with satiety while creating a moderate calorie deficit."
      : goal === 'muscleGain'
      ? "Your protein intake is good, but you could benefit from adding 300-400 more calories daily, especially on training days. Consider adding a protein shake with banana and peanut butter after workouts."
      : goal === 'maintenance'
      ? "Your current diet is well balanced. Consider adding more variety in your vegetable intake to ensure you're getting a wide range of micronutrients to support overall health."
      : "Your diet is lacking in some essential micronutrients. Try adding more leafy greens and colorful vegetables. Also consider increasing your omega-3 intake through fatty fish or supplements.";
  };

  const handleSaveMealPlan = (mealPlanId: number) => {
    setSavedMealPlans((prev) => [...prev, mealPlanId]);
  };

  const getCurrentMealPlans = () => {
    return MEAL_SUGGESTIONS[goal] || [];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Choose Your Nutrition Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={goal} onChange={setGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="weightLoss" id="weightLoss" className="peer sr-only" />
                <Label
                  htmlFor="weightLoss"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 text-4xl">⚖️</div>
                  <div className="font-semibold">Weight Loss</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                    Calorie-controlled meals to support healthy weight loss
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="muscleGain" id="muscleGain" className="peer sr-only" />
                <Label
                  htmlFor="muscleGain"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 text-4xl">💪</div>
                  <div className="font-semibold">Muscle Gain</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                    Protein-rich meals to support muscle growth and recovery
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="healthyEating" id="healthyEating" className="peer sr-only" />
                <Label
                  htmlFor="healthyEating"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 text-4xl">🥗</div>
                  <div className="font-semibold">Healthy Eating</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                    Balanced nutrition for overall health and wellbeing
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(MEAL_SUGGESTIONS[goal] || []).map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <CardTitle>{plan.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium py-1 px-2 rounded">
                    {plan.calories} calories/day
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {plan.meals.map((meal, index) => (
                  <div key={index} className="border-t pt-3">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl mr-2">
                        {FOOD_ICONS[meal.type as keyof typeof FOOD_ICONS] || '🍽️'}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{meal.type}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{meal.calories} cal</div>
                      </div>
                    </div>
                    
                    <div className="font-medium text-sm mb-1">{meal.name}</div>
                    <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {meal.ingredients.map((ingredient, i) => (
                        <span key={i} className="mr-2 mb-1 bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded-full">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs my-2">
                      <div className="flex items-center">
                        <span className="mr-1">{FOOD_ICONS.protein}</span> {meal.protein}g
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">{FOOD_ICONS.carbs}</span> {meal.carbs}g
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">{FOOD_ICONS.fats}</span> {meal.fats}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="mt-4 w-full">Save This Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
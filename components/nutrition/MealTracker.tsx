"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { PlusIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '../../lib/hooks/UserContext';
import { useMealTracking } from '../../lib/hooks/MealTrackingContext';
import { Food, Meal } from '../../types';
import Image from 'next/image';
import { HelpCircle } from 'lucide-react';
import { FOOD_ICONS, MEAL_TYPE_IMAGES, COMMON_FOODS, parsePortionFromDescription, calculateMealTotals } from '../../lib/data/foodData';

export default function MealTracker() {
  const { user } = useUserContext();
  const { todaysMeals, addFoodToMeal, removeFoodFromMeal } = useMealTracking();
  
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [foodPortion, setFoodPortion] = useState<number>(1);
  const [customFood, setCustomFood] = useState<{
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [isAddingCustomFood, setIsAddingCustomFood] = useState(false);
  const [showPortionTips, setShowPortionTips] = useState(false);
  const [customFoodDescription, setCustomFoodDescription] = useState('');

  const handleAddFood = () => {
    if (selectedMealId === null || (!selectedFoodId && !isAddingCustomFood)) return;
    
    let foodToAdd: Food;
    
    if (isAddingCustomFood) {
      // Determine portion from description if available
      const portionFromDescription = customFoodDescription 
        ? parsePortionFromDescription(customFoodDescription) 
        : foodPortion;
        
      // Add custom food
      foodToAdd = {
        id: `custom-${Date.now()}`,
        name: customFood.name,
        calories: customFood.calories,
        protein: customFood.protein,
        carbs: customFood.carbs,
        fats: customFood.fats,
        portion: portionFromDescription,
        description: customFoodDescription,
      };
      
      // Reset custom food form
      setCustomFood({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });
      setCustomFoodDescription('');
      setIsAddingCustomFood(false);
    } else {
      // Add from common foods
      const food = COMMON_FOODS.find((f) => f.id === selectedFoodId);
      if (!food) return;
      
      foodToAdd = {
        ...food,
        portion: foodPortion,
        description: customFoodDescription,
      };
    }
    
    // Add food to the selected meal using context
    addFoodToMeal(selectedMealId, foodToAdd);
    
    // Reset selection
    setSelectedFoodId('');
    setFoodPortion(1);
    setCustomFoodDescription('');
  };

  // Get the daily totals from all meals
  const dailyTotals = todaysMeals.reduce(
    (totals, meal) => {
      const mealTotals = calculateMealTotals(meal.foods);
      return {
        calories: totals.calories + mealTotals.calories,
        protein: totals.protein + mealTotals.protein,
        carbs: totals.carbs + mealTotals.carbs,
        fats: totals.fats + mealTotals.fats,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* Meal Gallery Banner */}
        <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/90 to-emerald-500/90 p-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-1 text-white">Today's Meals</h2>
              <p className="text-xs text-white/80 mb-3">Track your daily nutrition and maintain a healthy diet</p>
            </div>
            <button
              onClick={() => setShowPortionTips(!showPortionTips)}
              className="text-white/90 hover:text-white p-1 rounded-full"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          
          {showPortionTips && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-3">
              <h3 className="text-xs font-medium text-white mb-1">Portion Size Tips:</h3>
              <ul className="text-xs text-white/90 list-disc pl-4 space-y-0.5">
                <li>Use your palm to estimate a 3-4oz serving of meat (100g)</li>
                <li>Your closed fist is roughly 1 cup of food</li>
                <li>Your thumb is about 1 tablespoon</li>
                <li>Specify measurements like "2 cups" or "200g" when possible</li>
              </ul>
            </div>
          )}
          
          <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {Object.entries(FOOD_ICONS).slice(0, 6).map(([key, icon]) => (
              <div key={key} className="flex-shrink-0 bg-white/10 p-2 rounded-lg backdrop-blur-sm flex flex-col items-center min-w-[70px]">
                <div className="text-xl mb-0.5">{icon}</div>
                <div className="text-xs font-medium text-white/80 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
        
        {todaysMeals.map((meal) => {
          const mealTotals = calculateMealTotals(meal.foods);
          
          return (
            <Card key={meal.id} className="mb-3">
              <CardHeader className="pb-1 pt-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl mr-2">
                    {MEAL_TYPE_IMAGES[meal.type as keyof typeof MEAL_TYPE_IMAGES]}
                  </div>
                  <CardTitle className="capitalize text-lg">{meal.type}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                {meal.foods.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                    No foods added yet
                  </p>
                ) : (
                  <div className="mb-2">
                    <div className="grid grid-cols-12 text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <div className="col-span-6">Food</div>
                      <div className="col-span-2 text-right">Portion</div>
                      <div className="col-span-3 text-right">Calories</div>
                      <div className="col-span-1"></div>
                    </div>
                    {meal.foods.map((food, foodIndex) => (
                      <div key={`${food.id}-${foodIndex}`} className="grid grid-cols-12 text-xs py-1 border-b border-gray-100 dark:border-gray-800">
                        <div className="col-span-6 flex items-center">
                          {food.image && (
                            <div className="mr-1 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-base">
                              {FOOD_ICONS[food.image as keyof typeof FOOD_ICONS] || FOOD_ICONS.default}
                            </div>
                          )}
                          <div>
                            <span>{food.name}</span>
                            {food.description && (
                              <p className="text-xs text-gray-500">{food.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-right">{food.portion}</div>
                        <div className="col-span-3 text-right">{Math.round(food.calories * food.portion)}</div>
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => removeFoodFromMeal(meal.id, foodIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-12 text-xs font-medium mt-1 text-gray-800 dark:text-gray-200">
                      <div className="col-span-6">Total</div>
                      <div className="col-span-2"></div>
                      <div className="col-span-3 text-right">{Math.round(mealTotals.calories)} cal</div>
                      <div className="col-span-1"></div>
                    </div>
                    <div className="grid grid-cols-12 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <div className="col-span-8">Protein: {Math.round(mealTotals.protein)}g | Carbs: {Math.round(mealTotals.carbs)}g | Fats: {Math.round(mealTotals.fats)}g</div>
                      <div className="col-span-4"></div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => setSelectedMealId(meal.id)}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                >
                  <PlusIcon className="h-3 w-3 mr-1" /> Add Food
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        <Card>
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-lg">Daily Totals</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="text-blue-500 mr-1.5 text-lg">🔥</div>
                  <div className="text-xs text-blue-700 dark:text-blue-400">Calories</div>
                </div>
                <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                  {Math.round(dailyTotals.calories)}
                </div>
                <div className="w-full bg-blue-100 dark:bg-blue-800/30 h-1 mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${Math.min(100, (dailyTotals.calories / 2500) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-500 mr-1.5 text-lg">{FOOD_ICONS.protein}</div>
                  <div className="text-xs text-red-700 dark:text-red-400">Protein</div>
                </div>
                <div className="text-lg font-bold text-red-800 dark:text-red-300">
                  {Math.round(dailyTotals.protein)}g
                </div>
                <div className="w-full bg-red-100 dark:bg-red-800/30 h-1 mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${Math.min(100, (dailyTotals.protein / 120) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-1.5 text-lg">{FOOD_ICONS.carbs}</div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-400">Carbs</div>
                </div>
                <div className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                  {Math.round(dailyTotals.carbs)}g
                </div>
                <div className="w-full bg-yellow-100 dark:bg-yellow-800/30 h-1 mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${Math.min(100, (dailyTotals.carbs / 300) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-500 mr-1.5 text-lg">{FOOD_ICONS.fats}</div>
                  <div className="text-xs text-green-700 dark:text-green-400">Fats</div>
                </div>
                <div className="text-lg font-bold text-green-800 dark:text-green-300">
                  {Math.round(dailyTotals.fats)}g
                </div>
                <div className="w-full bg-green-100 dark:bg-green-800/30 h-1 mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${Math.min(100, (dailyTotals.fats / 70) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        {selectedMealId !== null && (
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-lg">Add Food to {todaysMeals.find(m => m.id === selectedMealId)?.type}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                {!isAddingCustomFood ? (
                  <>
                    <div>
                      <label htmlFor="food" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Food
                      </label>
                      <select
                        id="food"
                        value={selectedFoodId}
                        onChange={(e) => setSelectedFoodId(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Select a food...</option>
                        {COMMON_FOODS.map((food) => (
                          <option key={food.id} value={food.id}>
                            {food.name} ({food.calories} cal)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="portion" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Portion
                      </label>
                      <input
                        id="portion"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={foodPortion}
                        onChange={(e) => setFoodPortion(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        onClick={() => {
                          setIsAddingCustomFood(true);
                          setSelectedFoodId("");
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        + Custom Food
                      </Button>
                      
                      <div className="space-x-2">
                        <Button
                          onClick={() => setSelectedMealId(null)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!selectedFoodId}
                          onClick={handleAddFood}
                          size="sm"
                          className="text-xs h-7"
                        >
                          Add Food
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="customFoodName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Food Name
                      </label>
                      <input
                        id="customFoodName"
                        type="text"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="e.g. Grilled Chicken Breast"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="customFoodCalories" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Calories (per portion)
                        </label>
                        <input
                          id="customFoodCalories"
                          type="number"
                          value={customFood.calories}
                          onChange={(e) => setCustomFood({ ...customFood, calories: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="customFoodPortion" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Portion
                        </label>
                        <input
                          id="customFoodPortion"
                          type="number"
                          min="0.25"
                          step="0.25"
                          value={foodPortion}
                          onChange={(e) => setFoodPortion(Number(e.target.value))}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label htmlFor="customFoodProtein" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Protein (g)
                        </label>
                        <input
                          id="customFoodProtein"
                          type="number"
                          value={customFood.protein || 0}
                          onChange={(e) => setCustomFood({ ...customFood, protein: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="customFoodCarbs" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Carbs (g)
                        </label>
                        <input
                          id="customFoodCarbs"
                          type="number"
                          value={customFood.carbs || 0}
                          onChange={(e) => setCustomFood({ ...customFood, carbs: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="customFoodFats" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fats (g)
                        </label>
                        <input
                          id="customFoodFats"
                          type="number"
                          value={customFood.fats || 0}
                          onChange={(e) => setCustomFood({ ...customFood, fats: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        onClick={() => {
                          setIsAddingCustomFood(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        Back
                      </Button>
                      
                      <div className="space-x-2">
                        <Button
                          onClick={() => setSelectedMealId(null)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!customFood.name || customFood.calories <= 0}
                          onClick={handleAddFood}
                          size="sm"
                          className="text-xs h-7"
                        >
                          Add Food
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
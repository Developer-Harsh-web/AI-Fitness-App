"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '../../lib/hooks/UserContext';
import { Food, Meal } from '../../types';

// Common food database with nutrition info
const COMMON_FOODS: Food[] = [
  { id: '1', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, portion: 1 },
  { id: '2', name: 'Brown Rice (100g, cooked)', calories: 112, protein: 2.6, carbs: 23, fats: 0.9, portion: 1 },
  { id: '3', name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, portion: 1 },
  { id: '4', name: 'Salmon (100g)', calories: 206, protein: 22, carbs: 0, fats: 13, portion: 1 },
  { id: '5', name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, portion: 1 },
  { id: '6', name: 'Avocado (1 medium)', calories: 240, protein: 3, carbs: 12, fats: 22, portion: 1 },
  { id: '7', name: 'Egg (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fats: 5, portion: 1 },
  { id: '8', name: 'Oatmeal (100g, cooked)', calories: 71, protein: 2.5, carbs: 12, fats: 1.5, portion: 1 },
  { id: '9', name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, portion: 1 },
  { id: '10', name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, portion: 1 },
  { id: '11', name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, portion: 1 },
  { id: '12', name: 'Almonds (30g)', calories: 164, protein: 6, carbs: 6, fats: 14, portion: 1 },
];

export default function MealTracker() {
  const { user } = useUserContext();
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      userId: user?.id || '1',
      date: new Date(),
      type: 'breakfast',
      foods: [],
      totalCalories: 0,
    },
    {
      id: '2',
      userId: user?.id || '1',
      date: new Date(),
      type: 'lunch',
      foods: [],
      totalCalories: 0,
    },
    {
      id: '3',
      userId: user?.id || '1',
      date: new Date(),
      type: 'dinner',
      foods: [],
      totalCalories: 0,
    },
    {
      id: '4',
      userId: user?.id || '1',
      date: new Date(),
      type: 'snack',
      foods: [],
      totalCalories: 0,
    },
  ]);

  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
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

  const calculateMealTotals = (mealFoods: Food[]) => {
    return mealFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories * food.portion,
        protein: totals.protein + (food.protein || 0) * food.portion,
        carbs: totals.carbs + (food.carbs || 0) * food.portion,
        fats: totals.fats + (food.fats || 0) * food.portion,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const handleAddFood = () => {
    if (selectedMealIndex === null || (!selectedFoodId && !isAddingCustomFood)) return;
    
    setMeals((prevMeals) => {
      const updatedMeals = [...prevMeals];
      const selectedMeal = { ...updatedMeals[selectedMealIndex] };
      
      let foodToAdd: Food;
      
      if (isAddingCustomFood) {
        // Add custom food
        foodToAdd = {
          id: `custom-${Date.now()}`,
          name: customFood.name,
          calories: customFood.calories,
          protein: customFood.protein,
          carbs: customFood.carbs,
          fats: customFood.fats,
          portion: foodPortion,
        };
        
        // Reset custom food form
        setCustomFood({
          name: '',
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        });
        setIsAddingCustomFood(false);
      } else {
        // Add from common foods
        const food = COMMON_FOODS.find((f) => f.id === selectedFoodId);
        if (!food) return prevMeals;
        
        foodToAdd = {
          ...food,
          portion: foodPortion,
        };
      }
      
      selectedMeal.foods = [...selectedMeal.foods, foodToAdd];
      selectedMeal.totalCalories = selectedMeal.foods.reduce(
        (total, food) => total + food.calories * food.portion,
        0
      );
      
      updatedMeals[selectedMealIndex] = selectedMeal;
      return updatedMeals;
    });
    
    // Reset selection
    setSelectedFoodId('');
    setFoodPortion(1);
  };

  const handleRemoveFood = (mealIndex: number, foodIndex: number) => {
    setMeals((prevMeals) => {
      const updatedMeals = [...prevMeals];
      const selectedMeal = { ...updatedMeals[mealIndex] };
      
      selectedMeal.foods = selectedMeal.foods.filter((_, index) => index !== foodIndex);
      selectedMeal.totalCalories = selectedMeal.foods.reduce(
        (total, food) => total + food.calories * food.portion,
        0
      );
      
      updatedMeals[mealIndex] = selectedMeal;
      return updatedMeals;
    });
  };

  const getDailyTotals = () => {
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.totalCalories,
        protein: totals.protein + meal.foods.reduce((total, food) => total + (food.protein || 0) * food.portion, 0),
        carbs: totals.carbs + meal.foods.reduce((total, food) => total + (food.carbs || 0) * food.portion, 0),
        fats: totals.fats + meal.foods.reduce((total, food) => total + (food.fats || 0) * food.portion, 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const dailyTotals = getDailyTotals();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Today's Meals</h2>
        
        {meals.map((meal, index) => {
          const mealTotals = calculateMealTotals(meal.foods);
          
          return (
            <Card key={meal.id} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="capitalize">{meal.type}</CardTitle>
              </CardHeader>
              <CardContent>
                {meal.foods.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    No foods added yet
                  </p>
                ) : (
                  <div className="mb-4">
                    <div className="grid grid-cols-12 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="col-span-6">Food</div>
                      <div className="col-span-2 text-right">Portion</div>
                      <div className="col-span-3 text-right">Calories</div>
                      <div className="col-span-1"></div>
                    </div>
                    {meal.foods.map((food, foodIndex) => (
                      <div key={`${food.id}-${foodIndex}`} className="grid grid-cols-12 text-sm py-1 border-b border-gray-100 dark:border-gray-800">
                        <div className="col-span-6">{food.name}</div>
                        <div className="col-span-2 text-right">{food.portion}</div>
                        <div className="col-span-3 text-right">{Math.round(food.calories * food.portion)}</div>
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => handleRemoveFood(index, foodIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-12 text-sm font-medium mt-2 text-gray-800 dark:text-gray-200">
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
                  onClick={() => setSelectedMealIndex(index)}
                  variant="outline"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Food
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Daily Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm text-blue-700 dark:text-blue-400">Calories</div>
                <div className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  {Math.round(dailyTotals.calories)}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="text-sm text-red-700 dark:text-red-400">Protein</div>
                <div className="text-xl font-bold text-red-800 dark:text-red-300">
                  {Math.round(dailyTotals.protein)}g
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="text-sm text-yellow-700 dark:text-yellow-400">Carbs</div>
                <div className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
                  {Math.round(dailyTotals.carbs)}g
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-400">Fats</div>
                <div className="text-xl font-bold text-green-800 dark:text-green-300">
                  {Math.round(dailyTotals.fats)}g
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        {selectedMealIndex !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Add Food to {meals[selectedMealIndex].type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isAddingCustomFood ? (
                  <>
                    <div>
                      <label htmlFor="food" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Food
                      </label>
                      <select
                        id="food"
                        value={selectedFoodId}
                        onChange={(e) => setSelectedFoodId(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
                      <label htmlFor="portion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Portion
                      </label>
                      <input
                        id="portion"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={foodPortion}
                        onChange={(e) => setFoodPortion(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleAddFood} disabled={!selectedFoodId}>
                        Add Food
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCustomFood(true)}
                      >
                        Add Custom Food
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="custom-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Food Name
                      </label>
                      <input
                        id="custom-name"
                        type="text"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="E.g., Chicken Sandwich"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="custom-calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Calories
                        </label>
                        <input
                          id="custom-calories"
                          type="number"
                          value={customFood.calories}
                          onChange={(e) => setCustomFood({ ...customFood, calories: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="custom-portion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Portion
                        </label>
                        <input
                          id="custom-portion"
                          type="number"
                          min="0.25"
                          step="0.25"
                          value={foodPortion}
                          onChange={(e) => setFoodPortion(Number(e.target.value))}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="custom-protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Protein (g)
                        </label>
                        <input
                          id="custom-protein"
                          type="number"
                          value={customFood.protein}
                          onChange={(e) => setCustomFood({ ...customFood, protein: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="custom-carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Carbs (g)
                        </label>
                        <input
                          id="custom-carbs"
                          type="number"
                          value={customFood.carbs}
                          onChange={(e) => setCustomFood({ ...customFood, carbs: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="custom-fats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fats (g)
                        </label>
                        <input
                          id="custom-fats"
                          type="number"
                          value={customFood.fats}
                          onChange={(e) => setCustomFood({ ...customFood, fats: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddFood}
                        disabled={!customFood.name || customFood.calories <= 0}
                      >
                        Add Custom Food
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCustomFood(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMealIndex(null)}
                  className="mt-2"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
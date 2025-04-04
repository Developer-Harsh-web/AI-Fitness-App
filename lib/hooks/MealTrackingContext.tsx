"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, Food } from '../../types';
import { useUserContext } from './UserContext';

interface MealTrackingContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  updateMeal: (mealId: string, updatedMeal: Partial<Meal>) => void;
  deleteMeal: (mealId: string) => void;
  addFoodToMeal: (mealId: string, food: Food) => void;
  removeFoodFromMeal: (mealId: string, foodIndex: number) => void;
  clearMealData: () => void;
  todaysMeals: Meal[];
  dailyCalories: number;
  dailyNutrients: { protein: number; carbs: number; fats: number };
}

const MealTrackingContext = createContext<MealTrackingContextType | undefined>(undefined);

export const MealTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [meals, setMeals] = useState<Meal[]>([]);
  
  // Load meals from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const storedMeals = localStorage.getItem(`meals-${user.id}`);
      if (storedMeals) {
        try {
          const parsedMeals = JSON.parse(storedMeals);
          // Convert string dates back to Date objects
          const mealsWithDates = parsedMeals.map((meal: any) => ({
            ...meal,
            date: new Date(meal.date)
          }));
          setMeals(mealsWithDates);
        } catch (error) {
          console.error('Error parsing stored meals:', error);
        }
      } else {
        // Initialize with empty meals for each meal type if no data exists
        const initialMeals = [
          {
            id: `breakfast-${Date.now()}`,
            userId: user.id,
            date: new Date(),
            type: 'breakfast',
            foods: [],
            totalCalories: 0,
          },
          {
            id: `lunch-${Date.now()}`,
            userId: user.id,
            date: new Date(),
            type: 'lunch',
            foods: [],
            totalCalories: 0,
          },
          {
            id: `dinner-${Date.now()}`,
            userId: user.id,
            date: new Date(),
            type: 'dinner',
            foods: [],
            totalCalories: 0,
          },
          {
            id: `snack-${Date.now()}`,
            userId: user.id,
            date: new Date(),
            type: 'snack',
            foods: [],
            totalCalories: 0,
          },
        ];
        setMeals(initialMeals);
        saveMealsToStorage(initialMeals);
      }
    }
  }, [user?.id]);
  
  // Save meals to localStorage whenever they change
  const saveMealsToStorage = (updatedMeals: Meal[]) => {
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`meals-${user.id}`, JSON.stringify(updatedMeals));
    }
  };
  
  // Add a new meal
  const addMeal = (meal: Meal) => {
    const newMeals = [...meals, meal];
    setMeals(newMeals);
    saveMealsToStorage(newMeals);
  };
  
  // Update an existing meal
  const updateMeal = (mealId: string, updatedMeal: Partial<Meal>) => {
    const newMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, ...updatedMeal } : meal
    );
    setMeals(newMeals);
    saveMealsToStorage(newMeals);
  };
  
  // Delete a meal
  const deleteMeal = (mealId: string) => {
    const newMeals = meals.filter(meal => meal.id !== mealId);
    setMeals(newMeals);
    saveMealsToStorage(newMeals);
  };
  
  // Add food to a meal
  const addFoodToMeal = (mealId: string, food: Food) => {
    const newMeals = meals.map(meal => {
      if (meal.id === mealId) {
        const updatedFoods = [...meal.foods, food];
        const totalCalories = updatedFoods.reduce(
          (total, food) => total + food.calories * food.portion,
          0
        );
        return { ...meal, foods: updatedFoods, totalCalories };
      }
      return meal;
    });
    setMeals(newMeals);
    saveMealsToStorage(newMeals);
  };
  
  // Remove food from a meal
  const removeFoodFromMeal = (mealId: string, foodIndex: number) => {
    const newMeals = meals.map(meal => {
      if (meal.id === mealId) {
        const updatedFoods = meal.foods.filter((_, index) => index !== foodIndex);
        const totalCalories = updatedFoods.reduce(
          (total, food) => total + food.calories * food.portion,
          0
        );
        return { ...meal, foods: updatedFoods, totalCalories };
      }
      return meal;
    });
    setMeals(newMeals);
    saveMealsToStorage(newMeals);
  };
  
  // Clear all meal data
  const clearMealData = () => {
    setMeals([]);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.removeItem(`meals-${user.id}`);
    }
  };
  
  // Get today's meals
  const todaysMeals = meals.filter(meal => {
    const today = new Date();
    const mealDate = new Date(meal.date);
    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Calculate daily calories
  const dailyCalories = todaysMeals.reduce(
    (total, meal) => total + meal.totalCalories,
    0
  );
  
  // Calculate daily nutrients
  const dailyNutrients = todaysMeals.reduce(
    (totals, meal) => ({
      protein: totals.protein + meal.foods.reduce((total, food) => total + (food.protein || 0) * food.portion, 0),
      carbs: totals.carbs + meal.foods.reduce((total, food) => total + (food.carbs || 0) * food.portion, 0),
      fats: totals.fats + meal.foods.reduce((total, food) => total + (food.fats || 0) * food.portion, 0),
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );
  
  return (
    <MealTrackingContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        addFoodToMeal,
        removeFoodFromMeal,
        clearMealData,
        todaysMeals,
        dailyCalories,
        dailyNutrients,
      }}
    >
      {children}
    </MealTrackingContext.Provider>
  );
};

export const useMealTracking = () => {
  const context = useContext(MealTrackingContext);
  if (context === undefined) {
    throw new Error('useMealTracking must be used within a MealTrackingProvider');
  }
  return context;
}; 
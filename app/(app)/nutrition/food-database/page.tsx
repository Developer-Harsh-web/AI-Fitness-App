"use client";

import { DetailedFoodCard } from '../../../../components/food/DetailedFoodCard';
import { ExtendedFood } from '../../../../types';
import { useState } from 'react';

// Sample food data
const sampleFoods: ExtendedFood[] = [
  {
    id: 'food-1',
    name: 'Greek Yogurt',
    brand: 'Fage',
    portion: 1,
    calories: 130,
    protein: 18,
    carbs: 6,
    fats: 4,
    servingSize: '170',
    servingSizeUnit: 'g',
    vitamins: {
      'Vitamin A': 2,
      'Vitamin D': 15,
      'Calcium': 200,
    },
    minerals: {
      'Calcium': 200,
      'Potassium': 240,
    },
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Greek+Yogurt',
    verified: true,
    description: 'Plain Greek yogurt. Good source of protein and probiotics.',
  },
  {
    id: 'food-2',
    name: 'Atlantic Salmon',
    brand: 'Wild Caught',
    portion: 1,
    calories: 206,
    protein: 22,
    carbs: 0,
    fats: 13,
    servingSize: '100',
    servingSizeUnit: 'g',
    vitamins: {
      'Vitamin D': 12,
      'Vitamin B12': 24,
    },
    minerals: {
      'Selenium': 38,
      'Potassium': 360,
    },
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Salmon',
    verified: true,
    description: 'Wild caught Atlantic salmon fillet, rich in omega-3 fatty acids.',
  },
  {
    id: 'food-3',
    name: 'Quinoa',
    brand: 'Organic',
    portion: 1,
    calories: 222,
    protein: 8,
    carbs: 39,
    fats: 3.6,
    fiber: 5,
    servingSize: '185',
    servingSizeUnit: 'g',
    vitamins: {
      'Folate': 19,
      'Vitamin B6': 11,
    },
    minerals: {
      'Magnesium': 30,
      'Phosphorus': 28,
      'Iron': 15,
    },
    glycemicIndex: 53,
    organic: true,
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Quinoa',
    verified: true,
    description: 'Organic cooked quinoa. A complete protein source with all nine essential amino acids.',
  },
  {
    id: 'food-4',
    name: 'Avocado',
    portion: 1,
    calories: 240,
    protein: 3,
    carbs: 12,
    fats: 22,
    fiber: 10,
    servingSize: '1',
    servingSizeUnit: 'medium',
    vitamins: {
      'Vitamin K': 26,
      'Vitamin E': 15,
      'Vitamin C': 17,
    },
    minerals: {
      'Potassium': 720,
      'Folate': 160,
    },
    glycemicIndex: 15,
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Avocado',
    description: 'Medium-sized whole avocado. Rich in healthy monounsaturated fats.',
    allergens: [],
  },
  {
    id: 'food-5',
    name: 'Almond Butter',
    brand: 'Justin\'s',
    portion: 1,
    calories: 190,
    protein: 7,
    carbs: 6,
    fats: 18,
    fiber: 3,
    servingSize: '32',
    servingSizeUnit: 'g',
    minerals: {
      'Magnesium': 90,
      'Phosphorus': 110,
    },
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Almond+Butter',
    verified: true,
    allergens: ['Tree Nuts'],
    description: 'Creamy almond butter made from dry-roasted almonds.',
  },
  {
    id: 'food-6',
    name: 'Sweet Potato',
    portion: 1,
    calories: 112,
    protein: 2,
    carbs: 26,
    fats: 0.1,
    fiber: 4,
    servingSize: '130',
    servingSizeUnit: 'g',
    vitamins: {
      'Vitamin A': 384,
      'Vitamin C': 22,
    },
    minerals: {
      'Potassium': 448,
      'Manganese': 30,
    },
    glycemicIndex: 70,
    image: 'https://placehold.co/300x300/FAFAFA/A0A0A0?text=Sweet+Potato',
    organic: true,
    description: 'Medium baked sweet potato with skin. High in beta-carotene.',
  },
];

export default function FoodDatabasePage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Food Database</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse our comprehensive collection of foods with detailed nutritional information.
          Add foods to your meal plan or track your daily intake.
        </p>
        
        <div className="space-y-6">
          {sampleFoods.map(food => (
            <DetailedFoodCard 
              key={food.id} 
              food={food} 
              onAddToMeal={(food) => {
                console.log('Adding to meal:', food);
                alert(`Added ${food.name} to your meal plan.`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
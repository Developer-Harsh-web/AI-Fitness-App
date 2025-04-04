"use client";

import React, { useState } from 'react';
import { Hand, DollarSign, CreditCard, Dices, Lightbulb, Package, Apple, Award, Banana, EggFried, Beef, Fish, Salad } from 'lucide-react';
import Image from 'next/image';

interface PortionComparison {
  object: string;
  foodType: string;
  portion: string;
  calories: string;
  icon: React.ReactNode;
}

export default function PortionComparisonGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Comparisons' },
    { id: 'protein', name: 'Protein' },
    { id: 'carbs', name: 'Carbohydrates' },
    { id: 'fruits', name: 'Fruits & Vegetables' },
  ];
  
  const portionComparisons: PortionComparison[] = [
    {
      object: 'Your palm',
      foodType: 'Meat/Fish',
      portion: '~100g (3.5oz)',
      calories: '~150-200 kcal',
      icon: <Hand className="w-8 h-8 text-pink-500" />
    },
    {
      object: 'Deck of cards',
      foodType: 'Meat/Poultry',
      portion: '~85g (3oz)',
      calories: '~125-175 kcal',
      icon: <CreditCard className="w-8 h-8 text-red-500" />
    },
    {
      object: 'Tennis ball',
      foodType: 'Rice/Pasta (cooked)',
      portion: '~1/2 cup',
      calories: '~100-120 kcal',
      icon: <Award className="w-8 h-8 text-yellow-500" />
    },
    {
      object: 'Your fist',
      foodType: 'Vegetables',
      portion: '~1 cup',
      calories: '~30-50 kcal',
      icon: <Salad className="w-8 h-8 text-green-500" />
    },
    {
      object: 'Golf ball',
      foodType: 'Nuts/Seeds',
      portion: '~1 oz (28g)',
      calories: '~160-200 kcal',
      icon: <Dices className="w-8 h-8 text-amber-600" />
    },
    {
      object: 'Your thumb',
      foodType: 'Oils/Butter',
      portion: '~1 tbsp',
      calories: '~120-135 kcal',
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />
    },
    {
      object: 'Baseball',
      foodType: 'Fruit',
      portion: '~1 medium fruit',
      calories: '~80-120 kcal',
      icon: <Apple className="w-8 h-8 text-red-400" />
    },
    {
      object: 'Checkbook',
      foodType: 'Bread slice',
      portion: '~1 slice',
      calories: '~80-100 kcal',
      icon: <Package className="w-8 h-8 text-amber-300" />
    },
    {
      object: 'Tube of chapstick',
      foodType: 'Cheese',
      portion: '~1 oz (28g)',
      calories: '~100-120 kcal',
      icon: <DollarSign className="w-8 h-8 text-yellow-200" />
    },
    {
      object: 'Computer mouse',
      foodType: 'Baked potato',
      portion: '~1 medium',
      calories: '~150-170 kcal',
      icon: <Package className="w-8 h-8 text-amber-700" />
    },
    {
      object: 'Standard ice cream scoop',
      foodType: 'Ice cream',
      portion: '~1/2 cup',
      calories: '~140-160 kcal',
      icon: <Award className="w-8 h-8 text-blue-200" />
    },
    {
      object: '4 stacked dice',
      foodType: 'Hard cheese',
      portion: '~30g (1oz)',
      calories: '~110-120 kcal',
      icon: <Dices className="w-8 h-8 text-yellow-300" />
    },
  ];
  
  const filteredComparisons = selectedCategory === 'all' 
    ? portionComparisons 
    : portionComparisons.filter(comparison => {
        if (selectedCategory === 'protein') {
          return ['Meat/Fish', 'Meat/Poultry', 'Cheese', 'Hard cheese'].includes(comparison.foodType);
        } else if (selectedCategory === 'carbs') {
          return ['Rice/Pasta (cooked)', 'Bread slice', 'Baked potato'].includes(comparison.foodType);
        } else if (selectedCategory === 'fruits') {
          return ['Vegetables', 'Fruit'].includes(comparison.foodType);
        }
        return false;
      });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 p-4 border-b border-green-200 dark:border-green-800">
        <h2 className="text-lg font-medium text-green-800 dark:text-green-300">Portion Size Comparison Guide</h2>
        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
          Use everyday objects to help estimate your food portions more accurately
        </p>
      </div>
      
      {/* Category tabs */}
      <div className="flex space-x-1 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Comparison cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800">
        {filteredComparisons.map((comparison, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center mr-3">
                {comparison.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{comparison.object}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">is about the size of</p>
              </div>
            </div>
            
            <div className="ml-2 mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Food type:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{comparison.foodType}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portion size:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{comparison.portion}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approx. calories:</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">{comparison.calories}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tips section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Tips for More Accurate Tracking</h3>
        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 ml-4 list-disc">
          <li>Use "a steak the size of my palm" instead of just "a steak"</li>
          <li>For liquids, use standard measurements like cups or tablespoons</li>
          <li>Include cooking methods: "grilled chicken" vs "fried chicken"</li>
          <li>Specify "about 200 grams of pasta" instead of "a plate of pasta"</li>
          <li>Include any sauces or toppings in your description</li>
        </ul>
      </div>
    </div>
  );
} 
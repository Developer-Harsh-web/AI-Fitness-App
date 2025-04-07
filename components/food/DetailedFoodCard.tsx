"use client";

import { useState } from 'react';
import { ExtendedFood } from '../../types';
import { Plus, Minus, ChevronDown, ChevronUp, Info, AlertTriangle, Check } from 'lucide-react';

interface DetailedFoodCardProps {
  food: ExtendedFood;
  onAddToMeal?: (food: ExtendedFood) => void;
  isSelectable?: boolean;
  showMacroDetails?: boolean;
}

export function DetailedFoodCard({ 
  food, 
  onAddToMeal, 
  isSelectable = true,
  showMacroDetails = false
}: DetailedFoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate the nutritional values based on quantity
  const calculatedCalories = Math.round(food.calories * quantity);
  const calculatedProtein = food.protein ? Math.round(food.protein * quantity) : 0;
  const calculatedCarbs = food.carbs ? Math.round(food.carbs * quantity) : 0;
  const calculatedFats = food.fats ? Math.round(food.fats * quantity) : 0;
  const calculatedFiber = food.fiber ? Math.round(food.fiber * quantity) : 0;
  
  // Determine macronutrient percentages
  const totalMacros = calculatedProtein * 4 + calculatedCarbs * 4 + calculatedFats * 9;
  const proteinPercentage = totalMacros > 0 ? Math.round((calculatedProtein * 4 / totalMacros) * 100) : 0;
  const carbsPercentage = totalMacros > 0 ? Math.round((calculatedCarbs * 4 / totalMacros) * 100) : 0;
  const fatsPercentage = totalMacros > 0 ? Math.round((calculatedFats * 9 / totalMacros) * 100) : 0;
  
  // Handle adding the food to a meal
  const handleAddToMeal = () => {
    if (onAddToMeal && isSelectable) {
      const foodWithQuantity: ExtendedFood = {
        ...food,
        portion: quantity
      };
      onAddToMeal(foodWithQuantity);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start">
          {/* Food image */}
          <div className="relative w-24 h-24 mr-4 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {food.image ? (
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/96x96/FAFAFA/A0A0A0?text=Food";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">No image</span>
              </div>
            )}
            
            {food.verified && (
              <div className="absolute top-1 right-1 bg-green-500 dark:bg-green-600 rounded-full w-5 h-5 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Food info */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{food.name}</h3>
                {food.brand && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{food.brand}</span>
                )}
              </div>
              
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{calculatedCalories}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">cal</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {food.servingSize && `${food.servingSize} ${food.servingSizeUnit || 'g'}/serving`}
                </div>
              </div>
            </div>
            
            {/* Macronutrient information */}
            <div className="mt-3 flex space-x-3 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{calculatedProtein}g</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Protein</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{calculatedCarbs}g</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Carbs</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-green-600 dark:text-green-400">{calculatedFats}g</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Fats</span>
              </div>
              {calculatedFiber > 0 && (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{calculatedFiber}g</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Fiber</span>
                </div>
              )}
            </div>
            
            {/* Macronutrient bars */}
            <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-full" 
                  style={{ width: `${proteinPercentage}%` }}
                  title={`Protein: ${proteinPercentage}%`}
                ></div>
                <div 
                  className="bg-yellow-500 dark:bg-yellow-400 h-full" 
                  style={{ width: `${carbsPercentage}%` }}
                  title={`Carbs: ${carbsPercentage}%`}
                ></div>
                <div 
                  className="bg-green-500 dark:bg-green-400 h-full" 
                  style={{ width: `${fatsPercentage}%` }}
                  title={`Fats: ${fatsPercentage}%`}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quantity selector and add button */}
        {isSelectable && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-10 text-center">
                <span className="text-sm font-medium">{quantity}</span>
              </div>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= 10}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToMeal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Meal</span>
            </button>
          </div>
        )}
        
        {/* Toggle detailed view */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <span className="mr-1">{isExpanded ? 'Less details' : 'More details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* Food details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Vitamins & Minerals */}
            {(food.vitamins || food.minerals) && (
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Micronutrients</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {food.vitamins && Object.entries(food.vitamins).map(([name, value]) => (
                    <div key={name} className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
                      <div className="text-xs font-medium text-purple-800 dark:text-purple-300">{name}</div>
                      <div className="text-sm font-semibold">{value}mg</div>
                    </div>
                  ))}
                  
                  {food.minerals && Object.entries(food.minerals).map(([name, value]) => (
                    <div key={name} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                      <div className="text-xs font-medium text-blue-800 dark:text-blue-300">{name}</div>
                      <div className="text-sm font-semibold">{value}mg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Allergens */}
            {food.allergens && food.allergens.length > 0 && (
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" />
                  Allergens
                </h4>
                <div className="flex flex-wrap gap-2">
                  {food.allergens.map(allergen => (
                    <span 
                      key={allergen} 
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md text-xs"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Info */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Info className="w-4 h-4 mr-1 text-blue-500" />
                Additional Info
              </h4>
              <div className="space-y-2 text-sm">
                {food.organic && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4 mr-1" />
                    Organic
                  </div>
                )}
                {food.glycemicIndex && (
                  <div className="text-gray-700 dark:text-gray-300">
                    Glycemic Index: <span className="font-medium">{food.glycemicIndex}</span>
                  </div>
                )}
                {food.description && (
                  <div className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                    {food.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
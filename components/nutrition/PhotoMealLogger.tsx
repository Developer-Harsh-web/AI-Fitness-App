"use client";

import React, { useState, useRef } from 'react';
import { Camera, X, Check, Send, Trash2, Edit2 } from 'lucide-react';
import Button from '../ui/Button';

interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export default function PhotoMealLogger() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(null);
  const [foodDescription, setFoodDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Simulate AI-based food detection
  const detectFoodFromImage = async (imageSrc: string) => {
    setIsLoading(true);
    
    // In a real app, this would call an AI service to detect food
    // For demo, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock detected food items
    const mockDetectedFoods: FoodItem[] = [
      {
        id: '1',
        name: 'Grilled Chicken Breast',
        portion: 'Medium (100g)',
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
      },
      {
        id: '2',
        name: 'Brown Rice',
        portion: 'Medium (150g)',
        calories: 150,
        protein: 4,
        carbs: 32,
        fats: 1,
      },
      {
        id: '3',
        name: 'Steamed Broccoli',
        portion: 'Small (80g)',
        calories: 30,
        protein: 2.5,
        carbs: 6,
        fats: 0.4,
      }
    ];
    
    setDetectedFoods(mockDetectedFoods);
    setIsLoading(false);
  };
  
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        detectFoodFromImage(result);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemovePhoto = () => {
    setCapturedImage(null);
    setDetectedFoods([]);
    setIsEditing(false);
    setEditingFoodIndex(null);
    setFoodDescription('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleEditFood = (index: number) => {
    setIsEditing(true);
    setEditingFoodIndex(index);
    setFoodDescription(`${detectedFoods[index].name}, ${detectedFoods[index].portion}`);
  };
  
  const handleSaveEdit = () => {
    if (editingFoodIndex !== null && foodDescription) {
      // Parse user description (in real app, would use AI to parse)
      const [name, portion] = foodDescription.split(',').map(s => s.trim());
      
      const updatedFoods = [...detectedFoods];
      updatedFoods[editingFoodIndex] = {
        ...updatedFoods[editingFoodIndex],
        name: name || updatedFoods[editingFoodIndex].name,
        portion: portion || updatedFoods[editingFoodIndex].portion,
      };
      
      setDetectedFoods(updatedFoods);
      setIsEditing(false);
      setEditingFoodIndex(null);
      setFoodDescription('');
    }
  };
  
  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...detectedFoods];
    updatedFoods.splice(index, 1);
    setDetectedFoods(updatedFoods);
  };
  
  const handleLogMeal = () => {
    // In a real app, this would save the meal to a database
    alert(`Meal logged! Total calories: ${detectedFoods.reduce((sum, food) => sum + food.calories, 0)}`);
    handleRemovePhoto();
  };
  
  const handleAddFoodByDescription = () => {
    if (foodDescription) {
      // In a real app, this would use AI to convert description to nutritional data
      // For demo, we'll add a simple food item
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: foodDescription,
        portion: 'Medium',
        calories: 120,
        protein: 5,
        carbs: 15,
        fats: 3,
      };
      
      setDetectedFoods([...detectedFoods, newFood]);
      setFoodDescription('');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <h3 className="text-lg font-semibold text-white">Quick Food Logger</h3>
        <p className="text-indigo-100 text-sm">Take a photo of your meal or describe it</p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {!capturedImage ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Take a photo of your meal or upload an image
              </p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                type="button"
                onClick={handleTakePhoto}
              >
                Take Photo
              </Button>
            </div>
          ) : (
            <>
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured meal"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-gray-800/70 text-white p-1.5 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing your meal...</span>
                </div>
              ) : (
                <>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={foodDescription}
                        onChange={(e) => setFoodDescription(e.target.value)}
                        placeholder="Describe food (e.g. Steak, 200g)"
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveEdit}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingFoodIndex(null);
                          setFoodDescription('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={foodDescription}
                        onChange={(e) => setFoodDescription(e.target.value)}
                        placeholder="Describe additional food not in photo"
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddFoodByDescription}
                        disabled={!foodDescription}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {detectedFoods.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Detected Foods:
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {detectedFoods.map((food, index) => (
                          <div 
                            key={food.id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{food.name}</p>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {food.calories} kcal
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {food.portion} • {food.protein}g P, {food.carbs}g C, {food.fats}g F
                              </p>
                            </div>
                            <div className="flex items-center ml-2">
                              <button
                                type="button"
                                onClick={() => handleEditFood(index)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFood(index)}
                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            Total: {detectedFoods.reduce((sum, food) => sum + food.calories, 0)} kcal
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Protein: {detectedFoods.reduce((sum, food) => sum + (food.protein || 0), 0)}g • 
                            Carbs: {detectedFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)}g • 
                            Fats: {detectedFoods.reduce((sum, food) => sum + (food.fats || 0), 0)}g
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={handleLogMeal}
                        >
                          Log Meal
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
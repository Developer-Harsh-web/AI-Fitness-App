"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useMealTracking } from '../../lib/hooks/MealTrackingContext';
import { Food } from '../../types';
import { COMMON_FOODS } from '../../lib/data/foodData';
import { v4 as uuidv4 } from 'uuid';

interface QuickFoodCaptureProps {
  onComplete: () => void;
}

export default function QuickFoodCapture({ onComplete }: QuickFoodCaptureProps) {
  const { todaysMeals, addFoodToMeal } = useMealTracking();
  
  // Photo capture state
  const [step, setStep] = useState<'initial' | 'camera' | 'preview' | 'results'>('initial');
  const [preview, setPreview] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedFood, setIdentifiedFood] = useState<Food[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle camera capture
  const handleCameraCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/png');
        setPreview(imageDataUrl);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        setStep('preview');
      }
    }
  };

  // Initialize camera
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setStep('initial');
    }
  };

  // Handle food identification
  const handleIdentifyFood = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would send the image to an AI service for food recognition
      // For demo purposes, we'll simulate the analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find matching meal from todaysMeals
      const targetMeal = todaysMeals.find(meal => meal.type === mealType);
      if (!targetMeal) {
        throw new Error("Meal not found");
      }
      
      // Simulate identified food based on meal type
      const simulateIdentifiedFood = (): Food[] => {
        switch (mealType) {
          case 'breakfast':
            return [
              { ...COMMON_FOODS.find(f => f.name.includes("Egg")) || COMMON_FOODS[6], id: uuidv4(), portion: 2 },
              { ...COMMON_FOODS.find(f => f.name.includes("Oatmeal")) || COMMON_FOODS[7], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Banana")) || COMMON_FOODS[8], id: uuidv4() }
            ];
          case 'lunch':
            return [
              { ...COMMON_FOODS.find(f => f.name.includes("Chicken")) || COMMON_FOODS[0], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Rice")) || COMMON_FOODS[1], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Broccoli")) || COMMON_FOODS[2], id: uuidv4() }
            ];
          case 'dinner':
            return [
              { ...COMMON_FOODS.find(f => f.name.includes("Salmon")) || COMMON_FOODS[3], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Sweet Potato")) || COMMON_FOODS[4], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Spinach")) || COMMON_FOODS[10], id: uuidv4() }
            ];
          case 'snack':
            return [
              { ...COMMON_FOODS.find(f => f.name.includes("Yogurt")) || COMMON_FOODS[9], id: uuidv4() },
              { ...COMMON_FOODS.find(f => f.name.includes("Almonds")) || COMMON_FOODS[11], id: uuidv4() }
            ];
          default:
            return [{ ...COMMON_FOODS[0], id: uuidv4() }];
        }
      };
      
      // Set simulated results
      const identified = simulateIdentifiedFood();
      setIdentifiedFood(identified);
      
      setStep('results');
    } catch (error) {
      console.error('Error analyzing food:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add identified foods to meal
  const addIdentifiedFoods = () => {
    // Find matching meal from todaysMeals
    const targetMeal = todaysMeals.find(meal => meal.type === mealType);
    if (!targetMeal) {
      console.error("Meal not found");
      return;
    }
    
    // Add each food to the meal
    identifiedFood.forEach(food => {
      addFoodToMeal(targetMeal.id, food);
    });
    
    // Complete the flow
    resetAll();
    onComplete();
  };

  // Reset everything
  const resetAll = () => {
    setPreview(null);
    setStep('initial');
    setIdentifiedFood([]);
  };

  // Start camera when camera mode is selected
  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
  }, [step]);

  // Meal type selection view
  const renderMealTypeSelector = () => (
    <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
      {[
        { id: 'breakfast', label: 'Breakfast', emoji: '🍳' },
        { id: 'lunch', label: 'Lunch', emoji: '🥗' },
        { id: 'dinner', label: 'Dinner', emoji: '🍲' },
        { id: 'snack', label: 'Snack', emoji: '🍌' },
      ].map((type) => (
        <button
          key={type.id}
          onClick={() => {
            setMealType(type.id as any);
            setStep('camera');
          }}
          className="p-3 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors hover:scale-105 transform duration-200 shadow-sm hover:shadow"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2 text-xl">
            {type.emoji}
          </div>
          <span className="text-sm font-medium">{type.label}</span>
        </button>
      ))}
    </div>
  );

  // Camera view
  const renderCameraView = () => (
    <div className="rounded-xl overflow-hidden bg-black mb-4 aspect-[4/3] relative shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
        <Button
          onClick={handleCameraCapture}
          className="px-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white hover:bg-white text-blue-600"
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture
        </Button>
        <Button
          variant="outline"
          onClick={() => setStep('initial')}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white/90 transition-all"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );

  // Preview view
  const renderPreview = () => (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 shadow-md hover:shadow-lg transition-shadow">
            <img
              src={preview as string}
              alt="Food preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Confirm Meal Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'breakfast', label: 'Breakfast', emoji: '🍳' },
                { id: 'lunch', label: 'Lunch', emoji: '🥗' },
                { id: 'dinner', label: 'Dinner', emoji: '🍲' },
                { id: 'snack', label: 'Snack', emoji: '🍌' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setMealType(type.id as any)}
                  className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all hover:scale-105 transform duration-200 ${
                    mealType === type.id
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleIdentifyFood}
            isLoading={isProcessing}
            className="w-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Analyzing Food...' : 'Identify Food'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setStep('camera')}
            className="w-full mt-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Retake Photo
          </Button>
        </div>
      </div>
    </div>
  );

  // Results view
  const renderResults = () => (
    <div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-center mb-4 animate-fadeIn">
        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mr-3">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-green-800 dark:text-green-300 font-medium">Food Identified!</h3>
          <p className="text-green-700 dark:text-green-400 text-sm">
            We detected these items in your {mealType}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 shadow-md hover:shadow-lg transition-shadow">
            <img
              src={preview as string}
              alt="Food"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">
            Identified Food Items
          </h3>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-6 bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 shadow-sm">
            {identifiedFood.map((food, index) => (
              <div key={food.id} className="py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded transition-colors">
                <div>
                  <span className="font-medium">{food.name}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(food.calories * food.portion)} calories
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={food.portion}
                    onChange={(e) => {
                      setIdentifiedFood(prev => 
                        prev.map((f, i) => 
                          i === index ? { ...f, portion: Number(e.target.value) } : f
                        )
                      );
                    }}
                    className="w-16 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    onClick={() => {
                      setIdentifiedFood(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={addIdentifiedFoods}
              className="w-full hover:scale-105 transform transition-transform duration-200 bg-green-600 hover:bg-green-700 shadow-md"
            >
              <Check className="h-4 w-4 mr-2" />
              Add to Meal Log
            </Button>
            <Button
              variant="outline"
              onClick={resetAll}
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate view based on the current step
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 p-6 transition-all duration-500">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">
          {step === 'initial' && '📸'}
          {step === 'camera' && '📸'}
          {step === 'preview' && '🔍'}
          {step === 'results' && '✅'}
        </span>
        {step === 'initial' && 'Quick Food Tracker'}
        {step === 'camera' && 'Take a Photo'}
        {step === 'preview' && 'Confirm Your Photo'}
        {step === 'results' && 'Food Recognition Results'}
      </h2>
      
      <div className="transition-opacity duration-300">
        {step === 'initial' && renderMealTypeSelector()}
        {step === 'camera' && renderCameraView()}
        {step === 'preview' && renderPreview()}
        {step === 'results' && renderResults()}
      </div>
    </div>
  );
} 
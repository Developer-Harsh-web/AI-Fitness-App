"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';

interface OnboardingFormProps {
  step: string;
  formData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function OnboardingForm({ 
  step, 
  formData, 
  onComplete, 
  onBack,
  isFirstStep,
  isLastStep
}: OnboardingFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: formData
  });

  const [trackingDeviceSelected, setTrackingDeviceSelected] = useState<string | null>(null);
  
  // Function to handle form submission
  const onSubmit = (data: any) => {
    onComplete(data);
  };

  // Render different form content based on current step
  const renderStepContent = () => {
    switch(step) {
      case 'basics':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.name.message as string}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Your age"
                  {...register("age", { 
                    required: "Age is required",
                    min: { value: 18, message: "Must be at least 18 years old" },
                    max: { value: 100, message: "Must be at most 100 years old" }
                  })}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.age.message as string}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.gender.message as string}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Height in cm"
                    {...register("height", { 
                      required: "Height is required",
                      min: { value: 100, message: "Must be at least 100 cm" },
                      max: { value: 250, message: "Must be at most 250 cm" }
                    })}
                  />
                  {errors.height && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.height.message as string}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Weight in kg"
                    {...register("weight", { 
                      required: "Weight is required",
                      min: { value: 30, message: "Must be at least 30 kg" },
                      max: { value: 300, message: "Must be at most 300 kg" }
                    })}
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.weight.message as string}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
        
      case 'measurements':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="bodyFatPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Body Fat Percentage (if known)
                </label>
                <input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Body fat percentage"
                  {...register("bodyFatPercentage")}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank if you don't know. We'll estimate based on other measurements.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="waistCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Waist Circumference (cm)
                  </label>
                  <input
                    id="waistCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Waist measurement"
                    {...register("waistCircumference")}
                  />
                </div>
                
                <div>
                  <label htmlFor="hipCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hip Circumference (cm)
                  </label>
                  <input
                    id="hipCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Hip measurement"
                    {...register("hipCircumference")}
                  />
                </div>
              </div>
            </div>
          </>
        );
        
      case 'tracking':
        return (
          <>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <input
                    id="hasTrackingDevice"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("hasTrackingDevice")}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setValue("trackingDevices", []);
                        setTrackingDeviceSelected(null);
                      }
                    }}
                  />
                  <label htmlFor="hasTrackingDevice" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    I use a fitness tracking device or app
                  </label>
                </div>
              </div>
              
              {watch("hasTrackingDevice") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select your tracking devices/apps
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Fitbit', 'Apple Watch', 'Garmin', 'Samsung Health', 'Google Fit', 'Whoop', 'Oura Ring', 'Other'].map((device) => (
                      <div 
                        key={device}
                        className={`flex items-center justify-center p-3 border ${
                          watch("trackingDevices")?.includes(device) 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-700'
                        } rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800`}
                        onClick={() => {
                          const currentDevices = watch("trackingDevices") || [];
                          if (currentDevices.includes(device)) {
                            setValue("trackingDevices", currentDevices.filter(d => d !== device));
                          } else {
                            setValue("trackingDevices", [...currentDevices, device]);
                          }
                        }}
                      >
                        <span className="text-sm">{device}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {watch("hasTrackingDevice") && watch("trackingDevices")?.length > 0 && (
                <>
                  <div>
                    <label htmlFor="restingHeartRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Resting Heart Rate (if known)
                    </label>
                    <input
                      id="restingHeartRate"
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Beats per minute"
                      {...register("restingHeartRate")}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="vo2Max" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      VO2 Max (if known)
                    </label>
                    <input
                      id="vo2Max"
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="VO2 Max"
                      {...register("vo2Max")}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        );
        
      case 'goals':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What is your primary health goal?
                </label>
                <select
                  id="primaryGoal"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("primaryGoal", { required: "Primary goal is required" })}
                >
                  <option value="">Select your main goal</option>
                  <option value="lose weight">Lose weight</option>
                  <option value="gain muscle">Gain muscle</option>
                  <option value="improve fitness">Improve fitness</option>
                  <option value="improve health">Improve overall health</option>
                  <option value="athletic performance">Improve athletic performance</option>
                  <option value="maintain weight">Maintain weight</option>
                </select>
                {errors.primaryGoal && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.primaryGoal.message as string}</p>
                )}
              </div>
              
              {watch("primaryGoal") === "lose weight" && (
                <div>
                  <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target weight (kg)
                  </label>
                  <input
                    id="weightGoal"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Target weight"
                    {...register("weightGoal")}
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="activityGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  How active do you want to be?
                </label>
                <select
                  id="activityGoal"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("activityGoal")}
                >
                  <option value="">Select activity level</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-4 days/week)</option>
                  <option value="active">Active (5-6 days/week)</option>
                  <option value="very active">Very active (Daily)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dietary preferences (select all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'high-protein', label: 'High protein' },
                    { id: 'low-carb', label: 'Low carb' },
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'gluten-free', label: 'Gluten-free' },
                    { id: 'dairy-free', label: 'Dairy-free' },
                    { id: 'keto', label: 'Keto' },
                    { id: 'paleo', label: 'Paleo' },
                  ].map((diet) => (
                    <div key={diet.id} className="flex items-center">
                      <input
                        id={diet.id}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        value={diet.label.toLowerCase()}
                        {...register("dietaryGoals")}
                      />
                      <label htmlFor={diet.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {diet.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      case 'preferences':
        return (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How frequently should we check in with you?
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        watch("checkInFrequency") === "low" 
                          ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400" 
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setValue("checkInFrequency", "low")}
                    >
                      <div className={`h-5 w-5 rounded-full border ${
                        watch("checkInFrequency") === "low"
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300 dark:border-gray-600"
                      } flex items-center justify-center mr-3`}>
                        {watch("checkInFrequency") === "low" && (
                          <span className="h-2 w-2 bg-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Light touch</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Check in once or twice a day
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        watch("checkInFrequency") === "medium" 
                          ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400" 
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setValue("checkInFrequency", "medium")}
                    >
                      <div className={`h-5 w-5 rounded-full border ${
                        watch("checkInFrequency") === "medium"
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300 dark:border-gray-600"
                      } flex items-center justify-center mr-3`}>
                        {watch("checkInFrequency") === "medium" && (
                          <span className="h-2 w-2 bg-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Regular check-ins</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Check in every few hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        watch("checkInFrequency") === "high" 
                          ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400" 
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setValue("checkInFrequency", "high")}
                    >
                      <div className={`h-5 w-5 rounded-full border ${
                        watch("checkInFrequency") === "high"
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300 dark:border-gray-600"
                      } flex items-center justify-center mr-3`}>
                        {watch("checkInFrequency") === "high" && (
                          <span className="h-2 w-2 bg-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Highly accountable</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Frequent check-ins (every 10-15 minutes)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification preferences
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'meals', label: 'Meal reminders and logging' },
                    { id: 'activity', label: 'Activity reminders' },
                    { id: 'water', label: 'Water intake tracking' },
                    { id: 'sleep', label: 'Sleep tracking and reminders' },
                    { id: 'measurements', label: 'Weekly measurement check-ins' },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center">
                      <input
                        id={`notificationPreferences.${pref.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register(`notificationPreferences.${pref.id}`)}
                      />
                      <label 
                        htmlFor={`notificationPreferences.${pref.id}`} 
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {pref.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderStepContent()}
      
      <div className="mt-8 flex justify-between">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
        )}
        
        <div className={`${isFirstStep ? 'ml-auto' : ''}`}>
          <Button
            type="submit"
          >
            {isLastStep ? 'Complete' : 'Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
} 
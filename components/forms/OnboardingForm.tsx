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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="neckCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Neck Circumference (cm)
                  </label>
                  <input
                    id="neckCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Neck measurement"
                    {...register("neckCircumference")}
                  />
                </div>
                
                <div>
                  <label htmlFor="chestCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chest Circumference (cm)
                  </label>
                  <input
                    id="chestCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Chest measurement"
                    {...register("chestCircumference")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="armCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Arm (cm)
                  </label>
                  <input
                    id="armCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Arm"
                    {...register("armCircumference")}
                  />
                </div>
                
                <div>
                  <label htmlFor="thighCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thigh (cm)
                  </label>
                  <input
                    id="thighCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Thigh"
                    {...register("thighCircumference")}
                  />
                </div>
                
                <div>
                  <label htmlFor="calfCircumference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calf (cm)
                  </label>
                  <input
                    id="calfCircumference"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Calf"
                    {...register("calfCircumference")}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Note: These measurements help us track your progress more accurately. All measurements should be taken relaxed, not flexed.
              </p>
            </div>
          </>
        );
        
      case 'fitnessLevel':
        return (
          <>
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let's assess your current fitness level to help tailor your workouts and track progress.
              </p>
              
              <div>
                <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  How would you describe your fitness level?
                </label>
                <select
                  id="fitnessLevel"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("fitnessLevel")}
                >
                  <option value="">Select your fitness level</option>
                  <option value="beginner">Beginner - New to regular exercise</option>
                  <option value="intermediate">Intermediate - Exercise regularly for 6+ months</option>
                  <option value="advanced">Advanced - Consistently training for 1+ years</option>
                  <option value="athlete">Athlete - Competitive fitness level</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weeklyExercise" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weekly Exercise (hours)
                  </label>
                  <input
                    id="weeklyExercise"
                    type="number"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Hours per week"
                    {...register("weeklyExercise")}
                  />
                </div>
                
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Training Experience (years)
                  </label>
                  <input
                    id="experienceLevel"
                    type="number"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Years of experience"
                    {...register("experienceLevel")}
                  />
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
                Fitness Performance Metrics (Optional)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxPushups" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Push-ups (consecutive)
                  </label>
                  <input
                    id="maxPushups"
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Number of push-ups"
                    {...register("maxPushups")}
                  />
                </div>
                
                <div>
                  <label htmlFor="maxPullups" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Pull-ups (consecutive)
                  </label>
                  <input
                    id="maxPullups"
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Number of pull-ups"
                    {...register("maxPullups")}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="oneRepMaxBench" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bench Press 1RM (kg)
                  </label>
                  <input
                    id="oneRepMaxBench"
                    type="number"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Max bench press weight"
                    {...register("oneRepMaxBench")}
                  />
                </div>
                
                <div>
                  <label htmlFor="oneRepMaxSquat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Squat 1RM (kg)
                  </label>
                  <input
                    id="oneRepMaxSquat"
                    type="number"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Max squat weight"
                    {...register("oneRepMaxSquat")}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="mileRunTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  1-Mile Run Time (minutes)
                </label>
                <input
                  id="mileRunTime"
                  type="number"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Time in minutes (e.g., 8.5 for 8:30)"
                  {...register("mileRunTime")}
                />
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                These metrics help us assess your current fitness level and design appropriate workouts. If you're not sure about some values, you can leave them blank or estimate.
              </p>
            </div>
          </>
        );
        
      case 'healthMetrics':
        return (
          <>
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Health metrics help us create a safe and effective fitness plan tailored to your needs. Fill in any metrics you know.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="restingHeartRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resting Heart Rate (bpm)
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
                    placeholder="mL/kg/min"
                    {...register("vo2Max")}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="bloodPressureSystolic"
                    type="number"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Systolic (top number)"
                    {...register("bloodPressureSystolic")}
                  />
                  <span className="text-gray-500 dark:text-gray-400">/</span>
                  <input
                    id="bloodPressureDiastolic"
                    type="number"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Diastolic (bottom number)"
                    {...register("bloodPressureDiastolic")}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: 120/80
                </p>
              </div>
              
              <div>
                <label htmlFor="glucoseLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fasting Blood Glucose (if known)
                </label>
                <input
                  id="glucoseLevel"
                  type="number"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="mg/dL"
                  {...register("glucoseLevel")}
                />
              </div>
              
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
                Cholesterol (if known)
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cholesterolTotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </label>
                  <input
                    id="cholesterolTotal"
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="mg/dL"
                    {...register("cholesterolTotal")}
                  />
                </div>
                
                <div>
                  <label htmlFor="cholesterolHDL" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    HDL
                  </label>
                  <input
                    id="cholesterolHDL"
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="mg/dL"
                    {...register("cholesterolHDL")}
                  />
                </div>
                
                <div>
                  <label htmlFor="cholesterolLDL" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    LDL
                  </label>
                  <input
                    id="cholesterolLDL"
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="mg/dL"
                    {...register("cholesterolLDL")}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sleepQuality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sleep Quality
                  </label>
                  <select
                    id="sleepQuality"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("sleepQuality")}
                  >
                    <option value="">Select your sleep quality</option>
                    <option value="poor">Poor - Difficulty falling/staying asleep</option>
                    <option value="fair">Fair - Occasional sleep issues</option>
                    <option value="good">Good - Generally sleep well</option>
                    <option value="excellent">Excellent - Consistently sleep well</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Average Sleep (hours)
                  </label>
                  <input
                    id="sleepHours"
                    type="number"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Hours per night"
                    {...register("sleepHours")}
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                These metrics help us customize your fitness plan to your health status. This information is kept confidential.
              </p>
            </div>
          </>
        );
        
      case 'tracking':
        return (
          <>
            <div className="space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connecting your fitness tracking devices and apps allows us to provide more personalized insights and recommendations.
              </p>
              
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
                        
                        // Reset all tracking integrations
                        setValue("trackingIntegrations.appleHealth.connected", false);
                        setValue("trackingIntegrations.googleFit.connected", false);
                        setValue("trackingIntegrations.fitbit.connected", false);
                        setValue("trackingIntegrations.garmin.connected", false);
                        setValue("trackingIntegrations.otherDevices.connected", false);
                      }
                    }}
                  />
                  <label htmlFor="hasTrackingDevice" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    I use fitness tracking devices or apps
                  </label>
                </div>
              </div>
              
              {watch("hasTrackingDevice") && (
                <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select your tracking devices/apps
                  </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                              
                              // If removing a device, update the associated integration
                              if (device === 'Apple Watch') {
                                setValue("trackingIntegrations.appleHealth.connected", false);
                              } else if (device === 'Google Fit') {
                                setValue("trackingIntegrations.googleFit.connected", false);
                              } else if (device === 'Fitbit') {
                                setValue("trackingIntegrations.fitbit.connected", false);
                              } else if (device === 'Garmin') {
                                setValue("trackingIntegrations.garmin.connected", false);
                              } else if (device === 'Other') {
                                setValue("trackingIntegrations.otherDevices.connected", false);
                              }
                              
                              if (trackingDeviceSelected === device) {
                                setTrackingDeviceSelected(null);
                              }
                          } else {
                            setValue("trackingDevices", [...currentDevices, device]);
                              setTrackingDeviceSelected(device);
                              
                              // Set connected state for the selected integration
                              if (device === 'Apple Watch') {
                                setValue("trackingIntegrations.appleHealth.connected", true);
                              } else if (device === 'Google Fit') {
                                setValue("trackingIntegrations.googleFit.connected", true);
                              } else if (device === 'Fitbit') {
                                setValue("trackingIntegrations.fitbit.connected", true);
                              } else if (device === 'Garmin') {
                                setValue("trackingIntegrations.garmin.connected", true);
                              } else if (device === 'Other') {
                                setValue("trackingIntegrations.otherDevices.connected", true);
                                setValue("trackingIntegrations.otherDevices.deviceName", device);
                              }
                          }
                        }}
                      >
                        <span className="text-sm">{device}</span>
                      </div>
                    ))}
                  </div>
                  </div>
                  
                  {trackingDeviceSelected === 'Apple Watch' && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-3">Apple Health Integration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Choose which data you'd like to sync from Apple Health:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Steps & Activity
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register("trackingIntegrations.appleHealth.permissions.steps")}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Heart Rate
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register("trackingIntegrations.appleHealth.permissions.heartRate")}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Workouts
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register("trackingIntegrations.appleHealth.permissions.workouts")}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Sleep Data
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register("trackingIntegrations.appleHealth.permissions.sleep")}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Nutrition
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register("trackingIntegrations.appleHealth.permissions.nutrition")}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        In a real app, this would open Apple Health authorization. For this demo, we're simulating the connection.
                      </p>
                </div>
              )}
              
                  {(trackingDeviceSelected === 'Fitbit' || trackingDeviceSelected === 'Garmin' || trackingDeviceSelected === 'Google Fit') && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-3">{trackingDeviceSelected} Integration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Choose which data you'd like to sync from {trackingDeviceSelected}:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Steps & Activity
                    </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                    <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register(`trackingIntegrations.${trackingDeviceSelected === 'Google Fit' ? 'googleFit' : trackingDeviceSelected.toLowerCase()}.permissions.steps`)}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                  </div>
                  
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Heart Rate
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register(`trackingIntegrations.${trackingDeviceSelected === 'Google Fit' ? 'googleFit' : trackingDeviceSelected.toLowerCase()}.permissions.heartRate`)}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Workouts
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register(`trackingIntegrations.${trackingDeviceSelected === 'Google Fit' ? 'googleFit' : trackingDeviceSelected.toLowerCase()}.permissions.workouts`)}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Sleep Data
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register(`trackingIntegrations.${trackingDeviceSelected === 'Google Fit' ? 'googleFit' : trackingDeviceSelected.toLowerCase()}.permissions.sleep`)}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            Nutrition
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              {...register(`trackingIntegrations.${trackingDeviceSelected === 'Google Fit' ? 'googleFit' : trackingDeviceSelected.toLowerCase()}.permissions.nutrition`)}
                            />
                            <label
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        In a real app, this would initiate the OAuth flow with {trackingDeviceSelected}. For this demo, we're simulating the connection.
                      </p>
                    </div>
                  )}
                  
                  {trackingDeviceSelected === 'Other' && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-3">Other Device</h3>
                  <div>
                        <label htmlFor="otherDeviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Device Name
                    </label>
                    <input
                          id="otherDeviceName"
                          type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="Name of your device"
                          {...register("trackingIntegrations.otherDevices.deviceName")}
                    />
                  </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        We'll help you manually enter data from this device.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {!watch("hasTrackingDevice") && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can always connect your fitness tracking devices later from your profile settings.
                  </p>
                </div>
              )}
            </div>
          </>
        );
        
      case 'goals':
        return (
          <>
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Setting clear goals helps us tailor your fitness journey and measure your progress over time.
              </p>
              
              <div>
                <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Fitness Goal
                </label>
                <select
                  id="primaryGoal"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("primaryGoal", { required: "Primary goal is required" })}
                >
                  <option value="">Select your primary goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain/Building</option>
                  <option value="strength">Strength Improvement</option>
                  <option value="endurance">Endurance/Stamina</option>
                  <option value="flexibility">Flexibility/Mobility</option>
                  <option value="general-fitness">General Fitness</option>
                  <option value="athletic-performance">Athletic Performance</option>
                  <option value="health-improvement">Health Improvement</option>
                </select>
                {errors.primaryGoal && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.primaryGoal.message as string}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Goal Timeframe
                </label>
                <select
                  id="timeframe"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("timeframe")}
                >
                  <option value="">Select your timeframe</option>
                  <option value="1-month">1 Month (Short Term)</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year (Long Term)</option>
                </select>
              </div>
              
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-3">
                Specific Goals (Optional)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weight Goal (kg)
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
              
              <div>
                <label htmlFor="activityGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weekly Activity Goal (hours)
                </label>
                  <input
                  id="activityGoal"
                    type="number"
                    step="0.5"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Hours per week"
                  {...register("activityGoal")}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="strengthGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Strength Goal
                  </label>
                  <input
                    id="strengthGoal"
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Bench press 100kg"
                    {...register("strengthGoal")}
                  />
                </div>
                
                <div>
                  <label htmlFor="enduranceGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Endurance Goal
                  </label>
                  <input
                    id="enduranceGoal"
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Run 10km in 50min"
                    {...register("enduranceGoal")}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="flexibilityGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Flexibility/Mobility Goal
                </label>
                <input
                  id="flexibilityGoal"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., Touch toes, Full splits"
                  {...register("flexibilityGoal")}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dietary Goals (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Reduce Calorie Intake', 'Increase Protein', 'Reduce Sugar', 'Reduce Processed Foods', 
                    'Meal Prep Regularly', 'Eat More Vegetables', 'Reduce Alcohol', 'Track Macros', 
                    'Intermittent Fasting', 'Drink More Water'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center">
                      <input
                        id={`diet-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        value={goal}
                        {...register("dietaryGoals")}
                      />
                      <label
                        htmlFor={`diet-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {goal}
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
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let's personalize your fitness experience to match your preferences and lifestyle.
              </p>
              
              <div>
                <label htmlFor="workoutPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Workout Location
                </label>
                <select
                  id="workoutPreference"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("workoutPreference")}
                >
                  <option value="">Select preference</option>
                  <option value="home">Home Workouts</option>
                  <option value="gym">Gym Workouts</option>
                  <option value="outdoors">Outdoor Workouts</option>
                  <option value="mixed">Mixed (Combination)</option>
                </select>
                      </div>
              
                      <div>
                <label htmlFor="workoutDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Workout Duration
                </label>
                <select
                  id="workoutDuration"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("workoutDuration")}
                >
                  <option value="">Select duration</option>
                  <option value="15-30min">Short (15-30 minutes)</option>
                  <option value="30-45min">Medium (30-45 minutes)</option>
                  <option value="45-60min">Standard (45-60 minutes)</option>
                  <option value="60+min">Extended (60+ minutes)</option>
                </select>
                      </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Workout Days
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        id={`day-${day.toLowerCase()}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        value={day}
                        {...register("preferredWorkoutDays")}
                      />
                      <label
                        htmlFor={`day-${day.toLowerCase()}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {day.slice(0, 3)}
                      </label>
                    </div>
                  ))}
                    </div>
                  </div>
                  
              <div>
                <label htmlFor="preferredWorkoutTimes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Workout Time
                </label>
                <select
                  id="preferredWorkoutTimes"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("preferredWorkoutTimes")}
                >
                  <option value="">Select time preference</option>
                  <option value="early-morning">Early Morning (5-8am)</option>
                  <option value="morning">Morning (8-11am)</option>
                  <option value="midday">Midday (11am-2pm)</option>
                  <option value="afternoon">Afternoon (2-5pm)</option>
                  <option value="evening">Evening (5-8pm)</option>
                  <option value="night">Night (8-11pm)</option>
                  <option value="flexible">Flexible/Varies</option>
                </select>
                      </div>
              
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-3">
                AI Coaching Preferences
              </h3>
              
                      <div>
                <label htmlFor="aiCoachingLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Coaching Level
                </label>
                <select
                  id="aiCoachingLevel"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("aiCoachingLevel")}
                >
                  <option value="minimal">Minimal - Basic guidance and reminders</option>
                  <option value="moderate" selected>Moderate - Regular check-ins and suggestions</option>
                  <option value="comprehensive">Comprehensive - Detailed coaching and frequent interaction</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="aiPersona" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred AI Coach Persona
                </label>
                <select
                  id="aiPersona"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("aiPersona")}
                >
                  <option value="coach-alex">Coach Alex - Motivational and supportive</option>
                  <option value="trainer-sam">Trainer Sam - Direct and results-focused</option>
                  <option value="expert-jordan">Expert Jordan - Scientific and detailed</option>
                  <option value="friend-taylor">Friend Taylor - Casual and encouraging</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="checkInFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  How often would you like check-ins?
                </label>
                <select
                  id="checkInFrequency"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("checkInFrequency")}
                >
                  <option value="low">Low - Weekly</option>
                  <option value="medium">Medium - Every few days</option>
                  <option value="high">High - Daily</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifMeals" className="text-sm text-gray-700 dark:text-gray-300">
                      Meal Reminders & Nutrition Tips
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifMeals"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.meals")}
                      />
                      <label
                        htmlFor="notifMeals"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifActivity" className="text-sm text-gray-700 dark:text-gray-300">
                      Activity Tracking Reminders
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifActivity"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.activity")}
                      />
                      <label
                        htmlFor="notifActivity"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifWater" className="text-sm text-gray-700 dark:text-gray-300">
                      Water Intake Reminders
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifWater"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.water")}
                      />
                      <label
                        htmlFor="notifWater"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifSleep" className="text-sm text-gray-700 dark:text-gray-300">
                      Sleep Tracking Reminders
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifSleep"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.sleep")}
                      />
                      <label
                        htmlFor="notifSleep"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifMeasurements" className="text-sm text-gray-700 dark:text-gray-300">
                      Measurement & Progress Updates
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifMeasurements"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.measurements")}
                      />
                      <label
                        htmlFor="notifMeasurements"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifWorkoutReminders" className="text-sm text-gray-700 dark:text-gray-300">
                      Workout Reminders
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifWorkoutReminders"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.workoutReminders")}
                      />
                      <label
                        htmlFor="notifWorkoutReminders"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifProgressUpdates" className="text-sm text-gray-700 dark:text-gray-300">
                      Weekly Progress Reports
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifProgressUpdates"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.progressUpdates")}
                      />
                      <label
                        htmlFor="notifProgressUpdates"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifChallenges" className="text-sm text-gray-700 dark:text-gray-300">
                      Fitness Challenges & Goals
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        id="notifChallenges"
                        type="checkbox"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        {...register("notificationPreferences.challenges")}
                      />
                      <label
                        htmlFor="notifChallenges"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'lifestyle':
        return (
          <>
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understanding your lifestyle helps us design a fitness program that fits seamlessly into your daily routine.
              </p>
              
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Occupation
                </label>
                <input
                  id="occupation"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Your job or daily activity"
                  {...register("occupation")}
                />
                      </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Activity Level
                  </label>
                  <select
                    id="activityLevel"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("activityLevel")}
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (desk job, little movement)</option>
                    <option value="lightly-active">Lightly Active (walking, standing)</option>
                    <option value="moderately-active">Moderately Active (regular movement)</option>
                    <option value="very-active">Very Active (physically demanding job)</option>
                    <option value="extremely-active">Extremely Active (athlete, manual labor)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="stressLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stress Level
                  </label>
                  <select
                    id="stressLevel"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("stressLevel")}
                  >
                    <option value="">Select stress level</option>
                    <option value="low">Low - Rarely feel stressed</option>
                    <option value="moderate">Moderate - Occasional stress</option>
                    <option value="high">High - Frequently stressed</option>
                  </select>
                    </div>
                  </div>
                  
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Diet Type
                  </label>
                  <select
                    id="dietType"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("dietType")}
                  >
                    <option value="">Select diet type</option>
                    <option value="omnivore">Omnivore (meat and plants)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="other">Other</option>
                  </select>
                      </div>
                
                      <div>
                  <label htmlFor="waterIntake" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Water Intake (liters)
                  </label>
                  <input
                    id="waterIntake"
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Liters per day"
                    {...register("waterIntake")}
                  />
                      </div>
                    </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="alcoholConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alcohol Consumption
                  </label>
                  <select
                    id="alcoholConsumption"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("alcoholConsumption")}
                  >
                    <option value="">Select frequency</option>
                    <option value="none">None</option>
                    <option value="occasional">Occasional (1-2 drinks weekly)</option>
                    <option value="moderate">Moderate (3-7 drinks weekly)</option>
                    <option value="frequent">Frequent (8+ drinks weekly)</option>
                  </select>
                  </div>
                
                <div>
                  <label htmlFor="smokingStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Smoking Status
                  </label>
                  <select
                    id="smokingStatus"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...register("smokingStatus")}
                  >
                    <option value="">Select status</option>
                    <option value="non-smoker">Non-smoker</option>
                    <option value="former-smoker">Former smoker</option>
                    <option value="current-smoker">Current smoker</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Conditions (if any)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'High Blood Pressure', 'Diabetes', 'Heart Disease', 'Asthma', 'Back Pain', 
                    'Joint Pain', 'Arthritis', 'Anxiety/Depression', 'Pregnancy', 'Other'
                  ].map((condition) => (
                    <div key={condition} className="flex items-center">
                      <input
                        id={`medical-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        value={condition}
                        {...register("medicalConditions")}
                      />
                      <label 
                        htmlFor={`medical-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  This information helps us create a safe workout program. Always consult with healthcare providers before starting a new fitness regimen.
                </p>
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
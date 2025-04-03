"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../../lib/hooks/UserContext';
import OnboardingForm from '../../../components/forms/OnboardingForm';
import OnboardingProgress from '../../../components/ui/OnboardingProgress';

const steps = [
  { id: 'basics', name: 'Basic Info' },
  { id: 'measurements', name: 'Body Measurements' },
  { id: 'tracking', name: 'Tracking Devices' },
  { id: 'goals', name: 'Health Goals' },
  { id: 'preferences', name: 'Preferences' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Body Measurements
    bodyFatPercentage: '',
    waistCircumference: '',
    hipCircumference: '',
    
    // Tracking Devices
    hasTrackingDevice: false,
    trackingDevices: [] as string[],
    
    // Health metrics from devices
    restingHeartRate: '',
    vo2Max: '',
    
    // Health Goals
    primaryGoal: '',
    weightGoal: '',
    activityGoal: '',
    dietaryGoals: [] as string[],
    
    // App Preferences
    checkInFrequency: 'medium', // low, medium, high
    notificationPreferences: {
      meals: true,
      activity: true,
      water: true,
      sleep: true,
      measurements: true,
    },
  });

  const router = useRouter();
  const { user, setUser } = useUserContext();
  
  const handleStepComplete = (stepData: any) => {
    // Update form data with new step data
    setFormData({ ...formData, ...stepData });
    
    if (currentStep < steps.length - 1) {
      // Move to next step if not the last step
      setCurrentStep(currentStep + 1);
    } else {
      // Submit all data if this is the last step
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    // In a real app, this would send data to an API
    if (user) {
      // Calculate estimated body fat if not provided
      let bodyFat = formData.bodyFatPercentage;
      if (!bodyFat && formData.gender && formData.waistCircumference) {
        // Simple estimation formula - would use more complex calculations in production
        bodyFat = formData.gender === 'male' 
          ? (86.01 * Math.log10(parseFloat(formData.waistCircumference) - parseFloat(formData.hipCircumference)) - 70.041).toString()
          : (163.205 * Math.log10(parseFloat(formData.waistCircumference) + parseFloat(formData.hipCircumference)) - 97.684).toString();
      }
      
      // Update user data with collected information
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender,
          bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
          restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : undefined,
          vo2Max: formData.vo2Max ? parseFloat(formData.vo2Max) : undefined,
        },
        preferences: {
          ...user.preferences,
          fitnessGoals: [formData.primaryGoal, ...(formData.dietaryGoals || [])].filter(Boolean),
          checkInFrequency: formData.checkInFrequency,
          notificationPreferences: formData.notificationPreferences,
          trackingDevices: formData.trackingDevices,
        }
      };
      
      // Save updated user
      setUser(updatedUser);
      
      // Redirect to dashboard after completion
      router.push('/dashboard');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Let's Get to Know You</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Help us personalize your fitness journey by sharing some information about yourself
      </p>
      
      <OnboardingProgress steps={steps} currentStep={currentStep} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <OnboardingForm 
          step={steps[currentStep].id} 
          formData={formData} 
          onComplete={handleStepComplete}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
    </div>
  );
} 
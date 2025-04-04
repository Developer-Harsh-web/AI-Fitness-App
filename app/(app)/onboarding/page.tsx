"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../../lib/hooks/UserContext';
import OnboardingForm from '../../../components/forms/OnboardingForm';
import OnboardingProgress from '../../../components/ui/OnboardingProgress';

const steps = [
  { id: 'basics', name: 'Basic Info' },
  { id: 'measurements', name: 'Body Measurements' },
  { id: 'fitnessLevel', name: 'Fitness Level' },
  { id: 'healthMetrics', name: 'Health Metrics' },
  { id: 'tracking', name: 'Tracking Devices' },
  { id: 'lifestyle', name: 'Lifestyle' },
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
    neckCircumference: '',
    chestCircumference: '',
    armCircumference: '',
    thighCircumference: '',
    calfCircumference: '',
    
    // Fitness Level Assessment
    fitnessLevel: '', // beginner, intermediate, advanced
    weeklyExercise: '', // hours per week
    experienceLevel: '', // years of consistent training
    maxPushups: '',
    maxPullups: '',
    oneRepMaxBench: '',
    oneRepMaxSquat: '',
    mileRunTime: '',
    
    // Health Metrics
    restingHeartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    vo2Max: '',
    glucoseLevel: '',
    cholesterolTotal: '',
    cholesterolHDL: '',
    cholesterolLDL: '',
    sleepQuality: '', // poor, fair, good, excellent
    
    // Tracking Devices
    hasTrackingDevice: false,
    trackingDevices: [] as string[],
    trackingIntegrations: {
      appleHealth: {
        connected: false,
        lastSynced: null,
        permissions: {
          steps: true,
          heartRate: true,
          workouts: true,
          sleep: true,
          nutrition: true
        }
      },
      googleFit: {
        connected: false,
        lastSynced: null,
        permissions: {
          steps: true,
          heartRate: true,
          workouts: true,
          sleep: true,
          nutrition: true
        }
      },
      fitbit: {
        connected: false,
        lastSynced: null,
        permissions: {
          steps: true,
          heartRate: true,
          workouts: true,
          sleep: true,
          nutrition: true
        }
      },
      garmin: {
        connected: false,
        lastSynced: null,
        permissions: {
          steps: true,
          heartRate: true,
          workouts: true,
          sleep: true,
          nutrition: true
        }
      },
      otherDevices: {
        connected: false,
        deviceName: '',
        lastSynced: null
      }
    },
    
    // Lifestyle Information
    occupation: '',
    activityLevel: '', // sedentary, lightly active, moderately active, very active, extremely active
    stressLevel: '', // low, moderate, high
    sleepHours: '',
    dietType: '', // omnivore, vegetarian, vegan, pescatarian, keto, paleo
    waterIntake: '',
    alcoholConsumption: '', // none, occasional, moderate, frequent
    smokingStatus: '', // non-smoker, former smoker, current smoker
    medicalConditions: [] as string[],
    
    // Health Goals
    primaryGoal: '', // weight loss, muscle gain, endurance, general fitness, etc.
    weightGoal: '',
    strengthGoal: '',
    enduranceGoal: '',
    flexibilityGoal: '',
    activityGoal: '',
    dietaryGoals: [] as string[],
    timeframe: '', // 1 month, 3 months, 6 months, 1 year
    
    // App Preferences
    checkInFrequency: 'medium', // low, medium, high
    workoutPreference: '', // home, gym, outdoors
    workoutDuration: '', // 15-30 min, 30-45 min, 45-60 min, 60+ min
    preferredWorkoutDays: [] as string[],
    preferredWorkoutTimes: '',
    aiCoachingLevel: 'moderate', // minimal, moderate, comprehensive
    notificationPreferences: {
      meals: true,
      activity: true,
      water: true,
      sleep: true,
      measurements: true,
      workoutReminders: true,
      progressUpdates: true,
      challenges: true
    },
    aiPersona: 'coach-alex', // default AI coach persona
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
      if (!bodyFat && formData.gender && formData.waistCircumference && formData.neckCircumference) {
        // More accurate Navy method formula
        if (formData.gender === 'male' && formData.height) {
          const waist = parseFloat(formData.waistCircumference);
          const neck = parseFloat(formData.neckCircumference);
          const height = parseFloat(formData.height);
          bodyFat = (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1);
        } else if (formData.gender === 'female' && formData.height && formData.hipCircumference) {
          const waist = parseFloat(formData.waistCircumference);
          const neck = parseFloat(formData.neckCircumference);
          const hips = parseFloat(formData.hipCircumference);
          const height = parseFloat(formData.height);
          bodyFat = (495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(1);
        }
      }
      
      // Calculate BMI if height and weight are provided
      let bmi;
      if (formData.height && formData.weight) {
        const heightInMeters = parseFloat(formData.height) / 100;
        const weightInKg = parseFloat(formData.weight);
        bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
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
          bmi: bmi ? parseFloat(bmi) : undefined,
          bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
          restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : undefined,
          vo2Max: formData.vo2Max ? parseFloat(formData.vo2Max) : undefined,
          bloodPressure: formData.bloodPressureSystolic && formData.bloodPressureDiastolic
            ? `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}`
            : undefined,
          sleepQuality: formData.sleepQuality || undefined,
          sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : undefined,
          measurements: {
            waist: formData.waistCircumference ? parseFloat(formData.waistCircumference) : undefined,
            hips: formData.hipCircumference ? parseFloat(formData.hipCircumference) : undefined,
            neck: formData.neckCircumference ? parseFloat(formData.neckCircumference) : undefined,
            chest: formData.chestCircumference ? parseFloat(formData.chestCircumference) : undefined,
            arms: formData.armCircumference ? parseFloat(formData.armCircumference) : undefined,
            thighs: formData.thighCircumference ? parseFloat(formData.thighCircumference) : undefined,
            calves: formData.calfCircumference ? parseFloat(formData.calfCircumference) : undefined,
          },
          fitnessAssessment: {
            level: formData.fitnessLevel || undefined,
            weeklyExercise: formData.weeklyExercise ? parseFloat(formData.weeklyExercise) : undefined,
            experienceYears: formData.experienceLevel ? parseFloat(formData.experienceLevel) : undefined,
            maxPushups: formData.maxPushups ? parseInt(formData.maxPushups) : undefined,
            maxPullups: formData.maxPullups ? parseInt(formData.maxPullups) : undefined,
            benchPress: formData.oneRepMaxBench ? parseFloat(formData.oneRepMaxBench) : undefined,
            squat: formData.oneRepMaxSquat ? parseFloat(formData.oneRepMaxSquat) : undefined,
            mileTime: formData.mileRunTime ? parseFloat(formData.mileRunTime) : undefined,
          },
        },
        preferences: {
          ...user.preferences,
          fitnessGoals: {
            primary: formData.primaryGoal || undefined,
            weight: formData.weightGoal || undefined,
            strength: formData.strengthGoal || undefined,
            endurance: formData.enduranceGoal || undefined,
            flexibility: formData.flexibilityGoal || undefined,
            timeframe: formData.timeframe || undefined,
            dietary: (formData.dietaryGoals || []).filter(Boolean),
          },
          lifestyle: {
            occupation: formData.occupation || undefined,
            activityLevel: formData.activityLevel || undefined,
            stressLevel: formData.stressLevel || undefined,
            diet: formData.dietType || undefined,
            waterIntake: formData.waterIntake ? parseFloat(formData.waterIntake) : undefined,
            alcohol: formData.alcoholConsumption || undefined,
            smoking: formData.smokingStatus || undefined,
            medicalConditions: (formData.medicalConditions || []).filter(Boolean),
          },
          workouts: {
            preference: formData.workoutPreference || undefined,
            duration: formData.workoutDuration || undefined,
            days: (formData.preferredWorkoutDays || []).filter(Boolean),
            times: formData.preferredWorkoutTimes || undefined,
          },
          checkInFrequency: formData.checkInFrequency,
          notificationPreferences: formData.notificationPreferences,
          aiCoachingLevel: formData.aiCoachingLevel,
          aiPersona: formData.aiPersona,
          trackingDevices: formData.trackingDevices,
        },
        trackingIntegrations: formData.trackingIntegrations,
      };
      
      // Save updated user
      setUser(updatedUser);
      
      // Redirect to dashboard after completion
      router.push('/dashboard');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-3">Complete Your Fitness Profile</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        The more information you provide, the more personalized your fitness journey will be
      </p>
      
      <OnboardingProgress steps={steps} currentStep={currentStep} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <OnboardingForm 
          step={steps[currentStep].id} 
          formData={formData} 
          onComplete={handleStepComplete}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Step {currentStep + 1} of {steps.length} • {steps[currentStep].name}
      </div>
    </div>
  );
} 
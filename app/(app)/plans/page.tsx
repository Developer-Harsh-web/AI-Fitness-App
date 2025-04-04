"use client";

import React, { useState, useEffect } from 'react';
import { useAiPersona } from '../../../lib/hooks/useAiPersona';
import { BarChart2, Calendar, Dumbbell, Utensils, Activity, Heart, ArrowRight, Bot, Plus, Clipboard } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function PlansPage() {
  const { userPlans, generatePersonalizedPlan, currentPersona } = useAiPersona();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Get selected plan
  const selectedPlan = selectedPlanId 
    ? userPlans.find(plan => plan.id === selectedPlanId) 
    : userPlans.length > 0 ? userPlans[0] : null;
  
  // Set first plan as selected by default
  useEffect(() => {
    if (userPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(userPlans[0].id);
    }
  }, [userPlans, selectedPlanId]);
  
  // Generate a new plan
  const handleGeneratePlan = async (type: 'workout' | 'diet' | 'recovery') => {
    setIsGenerating(true);
    try {
      const newPlan = await generatePersonalizedPlan(type, []);
      setSelectedPlanId(newPlan.id);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper to get the appropriate icon for plan type
  const getPlanTypeIcon = (type: 'workout' | 'diet' | 'recovery') => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="h-5 w-5" />;
      case 'diet':
        return <Utensils className="h-5 w-5" />;
      case 'recovery':
        return <Heart className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-lg relative overflow-hidden mb-6">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-2">Personalized Plans</h1>
          <p className="text-indigo-100">
            AI-generated plans customized for your fitness goals and body metrics
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with plan list */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Plans</h2>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {userPlans.length > 0 ? (
                userPlans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full text-left p-4 transition-colors ${
                      selectedPlanId === plan.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                        plan.type === 'workout' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : plan.type === 'diet'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      }`}>
                        {getPlanTypeIcon(plan.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${
                          selectedPlanId === plan.id
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {plan.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)} • {plan.duration}
                        </p>
                      </div>
                      {selectedPlanId === plan.id && (
                        <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Clipboard className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No plans yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Generate your first personalized plan
                  </p>
                </div>
              )}
            </div>
            
            {/* Generate new plan options */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Generate New Plan</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleGeneratePlan('workout')}
                  variant="outline"
                  className="flex items-center justify-center py-2"
                  isLoading={isGenerating}
                >
                  <Dumbbell className="h-4 w-4 mr-1" />
                  <span className="text-xs">Workout</span>
                </Button>
                <Button
                  onClick={() => handleGeneratePlan('diet')}
                  variant="outline"
                  className="flex items-center justify-center py-2"
                  isLoading={isGenerating}
                >
                  <Utensils className="h-4 w-4 mr-1" />
                  <span className="text-xs">Diet</span>
                </Button>
                <Button
                  onClick={() => handleGeneratePlan('recovery')}
                  variant="outline"
                  className="flex items-center justify-center py-2"
                  isLoading={isGenerating}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">Recovery</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* AI Coach card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-4 border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                {currentPersona.emoji}
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                  Personalized Coach Advice
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 mb-3">
                  Chat with {currentPersona.name} for customized plans tailored to your specific needs and goals.
                </p>
                <a 
                  href="/ai-chat" 
                  className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  Chat with {currentPersona.name}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main plan content area */}
        <div className="lg:col-span-8">
          {selectedPlan ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Plan header */}
              <div className={`p-6 ${
                selectedPlan.type === 'workout' 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : selectedPlan.type === 'diet'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-purple-50 dark:bg-purple-900/20'
              }`}>
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                    selectedPlan.type === 'workout' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : selectedPlan.type === 'diet'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                    {getPlanTypeIcon(selectedPlan.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPlan.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPlan.duration} • Created {new Date(selectedPlan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {selectedPlan.description}
                </p>
              </div>
              
              {/* Plan content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Plan Details
                </h3>
                
                {selectedPlan.steps.map((step, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Day {step.day}
                    </h4>
                    <div className="space-y-3">
                      {step.activities.map((activity, actIndex) => (
                        <div 
                          key={actIndex}
                          className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.name}
                            </h5>
                            {activity.duration && (
                              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                {activity.duration}
                              </span>
                            )}
                            {activity.calories && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                {activity.calories} calories
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                          {(activity.sets && activity.reps) && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {activity.sets} sets × {activity.reps} reps
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline">
                    <Clipboard className="h-4 w-4 mr-2" />
                    Export Plan
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create Your First Plan</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Generate personalized workout, diet, or recovery plans based on your fitness profile and goals.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    onClick={() => handleGeneratePlan('workout')}
                    isLoading={isGenerating}
                  >
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Create Workout Plan
                  </Button>
                  <Button
                    onClick={() => handleGeneratePlan('diet')}
                    variant="outline"
                    isLoading={isGenerating}
                  >
                    <Utensils className="h-4 w-4 mr-2" />
                    Create Meal Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress metrics (optional section) */}
          {selectedPlan && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 mt-6">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
                <BarChart2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expected Progress</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <Activity className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consistency</h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">80%</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Target adherence</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <BarChart2 className="h-6 w-6 mx-auto text-green-500 mb-2" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Results</h4>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedPlan.type === 'workout' ? '+15%' : selectedPlan.type === 'diet' ? '-5 lbs' : '+20%'}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPlan.type === 'workout' ? 'Strength gain' : selectedPlan.type === 'diet' ? 'Weight loss' : 'Recovery rate'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeline</h4>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedPlan.type === 'workout' ? '4 wks' : selectedPlan.type === 'diet' ? '6 wks' : '2 wks'}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">To see results</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
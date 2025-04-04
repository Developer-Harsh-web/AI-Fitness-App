"use client";

import React, { useState, useEffect } from 'react';
import { useAiPersona } from '../../../lib/hooks/useAiPersona';
import AIPersonaChat from '../../../components/dashboard/AIPersonaChat';
import { 
  Bot, 
  Heart, 
  Brain, 
  FilePlus, 
  Settings, 
  MessageSquare,
  ChevronRight,
  Zap,
  Activity,
  Bell
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useUserContext } from '../../../lib/hooks/UserContext';

export default function AiChatPage() {
  const { personas, currentPersona, setCurrentPersonaById } = useAiPersona();
  const { user, setUser } = useUserContext();
  const [selectedPersona, setSelectedPersona] = useState(currentPersona.id);
  const [coachingIntensity, setCoachingIntensity] = useState(user?.preferences?.checkInFrequency || 'moderate');
  
  // Initialize coaching intensity from user preferences
  useEffect(() => {
    if (user?.preferences?.checkInFrequency) {
      setCoachingIntensity(user.preferences.checkInFrequency);
    }
  }, [user]);
  
  // Handle persona selection
  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
    setCurrentPersonaById(personaId);
  };
  
  // Handle coaching intensity change
  const handleIntensityChange = (intensity: string) => {
    setCoachingIntensity(intensity);
    
    // Update user preferences
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          checkInFrequency: intensity
        }
      };
      setUser(updatedUser);
    }
  };
  
  // Get check-in frequency text description based on intensity
  const getCheckInFrequencyText = (intensity: string) => {
    switch (intensity) {
      case 'light':
        return 'Once or twice per day';
      case 'moderate':
        return '3-5 times per day';
      case 'intensive':
        return 'Every 30-60 minutes';
      default:
        return 'Moderately throughout the day';
    }
  };
  
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AI Fitness Coach
          </h1>
          <p className="text-indigo-100 text-lg">
            Chat with your personalized AI coaches for guidance, motivation, and expert advice
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Coach selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Your Coach</h2>
            </div>
            
            <div className="p-4 space-y-2">
              {personas.map(persona => (
                <div 
                  key={persona.id}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedPersona === persona.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                  onClick={() => handleSelectPersona(persona.id)}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    selectedPersona === persona.id 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <span className="text-xl">{persona.emoji}</span>
                  </div>
                  
                  <div>
                    <h3 className={`font-medium ${
                      selectedPersona === persona.id 
                        ? 'text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}>{persona.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{persona.specialty}</p>
                  </div>
                  
                  {selectedPersona === persona.id && (
                    <ChevronRight className="ml-auto h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Coaching intensity settings */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coaching Intensity</h2>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Set how frequently your AI coach will check in on your progress
              </p>
              
              <div className="space-y-3">
                <div 
                  className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                    coachingIntensity === 'light' 
                      ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleIntensityChange('light')}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-4 h-4 rounded-full mr-2 ${
                      coachingIntensity === 'light'
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : 'border border-gray-400 dark:border-gray-500'
                    }`}></div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Light</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                    Check-ins once or twice per day
                  </p>
                </div>
                
                <div 
                  className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                    coachingIntensity === 'moderate' 
                      ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleIntensityChange('moderate')}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-4 h-4 rounded-full mr-2 ${
                      coachingIntensity === 'moderate'
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : 'border border-gray-400 dark:border-gray-500'
                    }`}></div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Moderate</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                    Check-ins 3-5 times per day
                  </p>
                </div>
                
                <div 
                  className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                    coachingIntensity === 'intensive' 
                      ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleIntensityChange('intensive')}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-4 h-4 rounded-full mr-2 ${
                      coachingIntensity === 'intensive'
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : 'border border-gray-400 dark:border-gray-500'
                    }`}></div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Intensive</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                    Frequent check-ins every 30-60 minutes
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Current Setting</h4>
                <p className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                  <Activity className="h-4 w-4 text-indigo-500 mr-1" />
                  {getCheckInFrequencyText(coachingIntensity)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Coach Profile */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coach Profile</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-4">
                  <span className="text-2xl">{currentPersona.emoji}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentPersona.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentPersona.role}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">Specialty</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPersona.specialty}</p>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">Coaching Style</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPersona.style}</p>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{currentPersona.introduction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col min-h-[600px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl">{currentPersona.emoji}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat with {currentPersona.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ask about workouts, nutrition, or fitness advice
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <AIPersonaChat />
            </div>
          </div>
          
          {/* Suggested questions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">Create a custom plan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ask your coach to create a personalized workout plan based on your goals</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">Ask for motivation</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get a motivational message or advice when you're feeling unmotivated</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">Health advice</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get guidance on improving sleep, nutrition, or overall wellness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for suggested questions
function SuggestedQuestion({ question, icon }: { question: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition cursor-pointer">
      <div className="flex items-start gap-2">
        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200">{question}</p>
      </div>
    </div>
  );
} 
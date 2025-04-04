"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUserContext } from './UserContext';

// Define persona type
interface AiPersona {
  id: string;
  name: string;
  emoji: string;
  role: string;
  specialty: string;
  tone: 'motivational' | 'analytical' | 'supportive' | 'challenging';
  style: string;
  introduction: string;
}

// Define search result type
interface SearchResult {
  title: string;
  snippet: string;
  source: string;
  url: string;
}

// Define personalized plan type
interface PersonalizedPlan {
  id: string;
  type: 'workout' | 'diet' | 'recovery';
  title: string;
  description: string;
  duration: string;
  steps: {
    day: number;
    activities: {
      name: string;
      description: string;
      duration?: string;
      sets?: number;
      reps?: number;
      calories?: number;
    }[];
  }[];
  createdAt: Date;
}

// Define context type
type AiPersonaContextType = {
  personas: AiPersona[];
  currentPersona: AiPersona;
  setCurrentPersonaById: (id: string) => void;
  getTimeBasedMessage: () => string;
  searchInternet: (query: string) => Promise<SearchResult[]>;
  generatePersonalizedPlan: (type: 'workout' | 'diet' | 'recovery', userGoals: string[]) => Promise<PersonalizedPlan>;
  userPlans: PersonalizedPlan[];
};

// Available personas
const availablePersonas: AiPersona[] = [
  {
    id: 'coach-alex',
    name: 'Coach Alex',
    emoji: '💪',
    role: 'Fitness Coach',
    specialty: 'Strength Training',
    tone: 'motivational',
    style: 'Energetic and encouraging',
    introduction: 'Hey there! I\'m Coach Alex, your dedicated fitness partner. I specialize in strength training and will help motivate you to reach your goals!'
  },
  {
    id: 'nutritionist-jamie',
    name: 'Nutritionist Jamie',
    emoji: '🥗',
    role: 'Nutrition Expert',
    specialty: 'Balanced Diet',
    tone: 'supportive',
    style: 'Friendly and informative',
    introduction: 'Hello! I\'m Jamie, your nutrition guide. I\'ll help you develop healthy eating habits that complement your fitness journey.'
  },
  {
    id: 'trainer-sam',
    name: 'Trainer Sam',
    emoji: '🏃',
    role: 'Cardio Specialist',
    specialty: 'Endurance Training',
    tone: 'challenging',
    style: 'Direct and challenging',
    introduction: 'I\'m Sam, your cardio and endurance specialist. I\'ll push you to your limits and help you build exceptional stamina and resilience.'
  },
  {
    id: 'coach-taylor',
    name: 'Coach Taylor',
    emoji: '🧘',
    role: 'Wellness Coach',
    specialty: 'Recovery & Mindfulness',
    tone: 'analytical',
    style: 'Calm and thoughtful',
    introduction: 'Hi, I\'m Taylor. I focus on the holistic aspects of fitness including recovery, sleep, and stress management. Balance is key to sustainable progress.'
  }
];

// Set default persona
const defaultPersona = availablePersonas[0];

// Mock search results based on common fitness queries
const mockSearchDatabase = {
  'weight loss': [
    {
      title: 'Evidence-Based Weight Loss Tips',
      snippet: 'Research indicates that a combination of caloric deficit, regular exercise, and adequate protein intake is most effective for sustainable weight loss.',
      source: 'Journal of Nutrition',
      url: 'https://example.com/weight-loss-research'
    },
    {
      title: 'Recent Studies on Intermittent Fasting',
      snippet: 'New research suggests that time-restricted eating may help with weight management and metabolic health improvements.',
      source: 'Medical Journal of Metabolism',
      url: 'https://example.com/intermittent-fasting'
    }
  ],
  'muscle building': [
    {
      title: 'Optimal Protein Intake for Muscle Growth',
      snippet: 'Current research recommends 1.6-2.2g of protein per kg of bodyweight for individuals focused on muscle hypertrophy.',
      source: 'Sports Medicine Review',
      url: 'https://example.com/protein-muscle-research'
    },
    {
      title: 'Progressive Overload Principles',
      snippet: 'Scientific evidence supports that gradual increases in training volume, intensity, or frequency are essential for continued muscle development.',
      source: 'Journal of Strength and Conditioning',
      url: 'https://example.com/progressive-overload'
    }
  ],
  'cardio workouts': [
    {
      title: 'HIIT vs Steady-State Cardio',
      snippet: 'Recent studies show both high-intensity interval training and moderate-intensity continuous training offer unique benefits for cardiovascular health.',
      source: 'Cardiovascular Research Quarterly',
      url: 'https://example.com/cardio-comparison'
    },
    {
      title: 'Optimal Cardio Duration for Heart Health',
      snippet: 'Research indicates that 150 minutes of moderate-intensity aerobic activity weekly provides significant cardiovascular benefits.',
      source: 'Heart Association Journal',
      url: 'https://example.com/cardio-heart-health'
    }
  ]
};

// Create context
const AiPersonaContext = createContext<AiPersonaContextType>({
  personas: availablePersonas,
  currentPersona: defaultPersona,
  setCurrentPersonaById: () => {},
  getTimeBasedMessage: () => 'Stay consistent with these reminders!',
  searchInternet: async () => [],
  generatePersonalizedPlan: async () => ({} as PersonalizedPlan),
  userPlans: []
});

// Create provider component
export function AiPersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<AiPersona>(defaultPersona);
  const [userPlans, setUserPlans] = useState<PersonalizedPlan[]>([]);
  const { user } = useUserContext();
  
  // Update current persona based on user preferences
  useEffect(() => {
    if (user?.preferences?.aiPersonaId) {
      const preferredPersona = availablePersonas.find(p => p.id === user.preferences.aiPersonaId);
      if (preferredPersona) {
        setCurrentPersona(preferredPersona);
      }
    }
  }, [user]);
  
  // Function to set current persona by ID
  const setCurrentPersonaById = (id: string) => {
    const persona = availablePersonas.find(p => p.id === id);
    if (persona) {
      setCurrentPersona(persona);
    }
  };
  
  // Function to get a time-based message
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    const userFirstName = user?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) {
      return `Good morning, ${userFirstName}! Here are your morning reminders.`;
    } else if (hour < 17) {
      return `Good afternoon, ${userFirstName}! Don't forget these important tasks.`;
    } else {
      return `Good evening, ${userFirstName}! Let's finish the day strong with these reminders.`;
    }
  };
  
  // Simulate internet search functionality
  const searchInternet = async (query: string): Promise<SearchResult[]> => {
    // In a real app, this would call an API to search the internet
    // For demo purposes, we'll simulate a search with predefined results
    return new Promise((resolve) => {
      setTimeout(() => {
        // Normalize the query
        const normalizedQuery = query.toLowerCase().trim();
        
        // Check our mock database for relevant results
        let results: SearchResult[] = [];
        
        // Check for keyword matches
        Object.entries(mockSearchDatabase).forEach(([keyword, keywordResults]) => {
          if (normalizedQuery.includes(keyword)) {
            results = [...results, ...keywordResults];
          }
        });
        
        // If no direct matches, return generic results about fitness
        if (results.length === 0) {
          results = [
            {
              title: 'Latest Fitness Research Trends',
              snippet: 'Recent studies emphasize the importance of personalized approaches to fitness based on individual body composition, genetics, and lifestyle factors.',
              source: 'International Journal of Exercise Science',
              url: 'https://example.com/fitness-trends'
            },
            {
              title: 'Evidence-Based Nutrition Guidelines',
              snippet: 'Current nutritional science supports balanced macronutrient intake tailored to individual activity levels and metabolic factors.',
              source: 'Nutrition Today',
              url: 'https://example.com/nutrition-guidelines'
            }
          ];
        }
        
        resolve(results);
      }, 1500); // Simulate network delay
    });
  };
  
  // Generate personalized plans based on user data
  const generatePersonalizedPlan = async (type: 'workout' | 'diet' | 'recovery', userGoals: string[] = []): Promise<PersonalizedPlan> => {
    // In a real app, this would use AI to generate a truly personalized plan
    // For demo purposes, we'll create template-based plans
    return new Promise((resolve) => {
      setTimeout(() => {
        // Use user data for personalization
        const fitnessLevel = user?.preferences?.fitnessLevel || 'beginner';
        const dietaryPrefs = user?.preferences?.dietaryPreferences || [];
        const weight = user?.stats?.weight || 70;
        const height = user?.stats?.height || 175;
        const bodyFat = user?.stats?.bodyFatPercentage || 20;
        
        // Generate a unique ID for the plan
        const planId = `plan-${Date.now()}`;
        
        let newPlan: PersonalizedPlan;
        
        if (type === 'workout') {
          // Create a workout plan based on fitness level and goals
          const workoutIntensity = fitnessLevel === 'beginner' ? 'light' : fitnessLevel === 'intermediate' ? 'moderate' : 'high';
          const focusAreas = userGoals.includes('weight loss') ? ['cardio', 'full body'] : 
                            userGoals.includes('muscle building') ? ['resistance', 'strength'] : 
                            ['functional', 'balanced'];
          
          newPlan = {
            id: planId,
            type: 'workout',
            title: `${fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)} ${focusAreas[0].charAt(0).toUpperCase() + focusAreas[0].slice(1)} Program`,
            description: `A personalized ${workoutIntensity} intensity workout program designed for your ${fitnessLevel} fitness level, focusing on ${focusAreas.join(' and ')} training to achieve your ${userGoals.join(' and ')} goals.`,
            duration: '4 weeks',
            steps: [
              {
                day: 1,
                activities: [
                  {
                    name: 'Warm-up',
                    description: '5-10 minutes of light cardio and dynamic stretches',
                    duration: '10 minutes'
                  },
                  {
                    name: fitnessLevel === 'beginner' ? 'Bodyweight Squats' : 'Barbell Squats',
                    description: `${fitnessLevel === 'beginner' ? '3 sets of 10 reps' : '4 sets of 8-12 reps with appropriate weight'}`,
                    sets: fitnessLevel === 'beginner' ? 3 : 4,
                    reps: fitnessLevel === 'beginner' ? 10 : 8
                  },
                  {
                    name: fitnessLevel === 'beginner' ? 'Push-ups' : 'Bench Press',
                    description: `${fitnessLevel === 'beginner' ? '3 sets of max reps' : '4 sets of 8-10 reps with appropriate weight'}`,
                    sets: fitnessLevel === 'beginner' ? 3 : 4,
                    reps: fitnessLevel === 'beginner' ? 10 : 8
                  },
                  {
                    name: 'Cool-down',
                    description: '5 minutes of static stretching',
                    duration: '5 minutes'
                  }
                ]
              },
              {
                day: 2,
                activities: [
                  {
                    name: 'Cardio Session',
                    description: `${fitnessLevel === 'beginner' ? '20 minutes of brisk walking' : fitnessLevel === 'intermediate' ? '30 minutes of jogging' : '30 minutes of HIIT'}`,
                    duration: fitnessLevel === 'beginner' ? '20 minutes' : '30 minutes'
                  }
                ]
              },
              // More days would be included in a full plan
            ],
            createdAt: new Date()
          };
        } else if (type === 'diet') {
          // Create a diet plan based on dietary preferences and goals
          const calorieTarget = userGoals.includes('weight loss') 
            ? Math.round((10 * weight + 6.25 * height - 5 * 30 + (user?.preferences?.gender === 'female' ? -161 : 5)) * 0.8)
            : Math.round((10 * weight + 6.25 * height - 5 * 30 + (user?.preferences?.gender === 'female' ? -161 : 5)) * 1.2);
          
          const proteinTarget = userGoals.includes('muscle building') 
            ? Math.round(weight * 2.2) 
            : Math.round(weight * 1.6);
            
          const dietType = dietaryPrefs.includes('vegan') ? 'Vegan' : 
                          dietaryPrefs.includes('vegetarian') ? 'Vegetarian' : 
                          dietaryPrefs.includes('keto') ? 'Ketogenic' : 'Balanced';
          
          newPlan = {
            id: planId,
            type: 'diet',
            title: `Personalized ${dietType} Nutrition Plan`,
            description: `A customized nutrition plan designed for your ${userGoals.join(' and ')} goals, respecting your ${dietaryPrefs.join(', ')} dietary preferences.`,
            duration: 'Ongoing',
            steps: [
              {
                day: 1,
                activities: [
                  {
                    name: 'Breakfast',
                    description: dietaryPrefs.includes('vegan') 
                      ? 'Protein-packed vegan smoothie with plant-based protein powder, berries, and spinach' 
                      : 'Greek yogurt with berries and nuts',
                    calories: Math.round(calorieTarget * 0.25)
                  },
                  {
                    name: 'Lunch',
                    description: dietaryPrefs.includes('vegetarian')
                      ? 'Quinoa bowl with roasted vegetables and chickpeas'
                      : 'Grilled chicken salad with mixed greens and olive oil dressing',
                    calories: Math.round(calorieTarget * 0.35)
                  },
                  {
                    name: 'Dinner',
                    description: dietaryPrefs.includes('keto')
                      ? 'Baked salmon with asparagus and avocado'
                      : 'Lean protein with complex carbs and vegetables',
                    calories: Math.round(calorieTarget * 0.3)
                  },
                  {
                    name: 'Snack',
                    description: 'Protein shake or nuts',
                    calories: Math.round(calorieTarget * 0.1)
                  }
                ]
              },
              // Additional days would follow similar patterns
            ],
            createdAt: new Date()
          };
        } else {
          // Create a recovery plan
          newPlan = {
            id: planId,
            type: 'recovery',
            title: 'Personalized Recovery Protocol',
            description: 'A customized recovery plan to optimize your rest days and enhance overall performance and wellness.',
            duration: 'Implement on rest days',
            steps: [
              {
                day: 1,
                activities: [
                  {
                    name: 'Morning Mobility',
                    description: '10 minutes of gentle dynamic stretching focusing on tight areas',
                    duration: '10 minutes'
                  },
                  {
                    name: 'Hydration Strategy',
                    description: `Drink ${Math.round(weight * 0.03)} liters of water throughout the day with electrolytes`,
                  },
                  {
                    name: 'Active Recovery',
                    description: fitnessLevel === 'beginner' 
                      ? '20 minute light walk' 
                      : '30 minute light activity (swimming, cycling, or walking)',
                    duration: fitnessLevel === 'beginner' ? '20 minutes' : '30 minutes'
                  },
                  {
                    name: 'Evening Relaxation',
                    description: '10 minutes of deep breathing exercises and meditation',
                    duration: '10 minutes'
                  }
                ]
              }
            ],
            createdAt: new Date()
          };
        }
        
        // Add the new plan to user plans
        setUserPlans(prev => [...prev, newPlan]);
        
        resolve(newPlan);
      }, 2000); // Simulate AI processing time
    });
  };
  
  return (
    <AiPersonaContext.Provider 
      value={{ 
        personas: availablePersonas,
        currentPersona,
        setCurrentPersonaById,
        getTimeBasedMessage,
        searchInternet,
        generatePersonalizedPlan,
        userPlans
      }}
    >
      {children}
    </AiPersonaContext.Provider>
  );
}

// Custom hook to use the context
export function useAiPersona() {
  const context = useContext(AiPersonaContext);
  if (!context) {
    throw new Error('useAiPersona must be used within an AiPersonaProvider');
  }
  return context;
}

export default AiPersonaContext; 
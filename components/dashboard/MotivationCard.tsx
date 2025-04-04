"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, FireIcon, ArrowPathIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { useUserContext } from '../../lib/hooks/UserContext';

// Array of personalized motivational quotes
const MOTIVATION_QUOTES = [
  {
    text: "The only bad workout is the one that didn't happen. Every effort counts!",
    author: "FitAI Coach",
    theme: "consistency"
  },
  {
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers",
    theme: "growth"
  },
  {
    text: "Take care of your body. It's the only place you have to live, and it deserves your best investment.",
    author: "Jim Rohn",
    theme: "health"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince. Believe in yourself!",
    author: "FitAI Coach",
    theme: "mindset"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "FitAI Coach",
    theme: "progress"
  },
  {
    text: "The difference between try and triumph is just a little umph! You've got this!",
    author: "Marvin Phillips",
    theme: "motivation"
  },
  {
    text: "Small daily improvements are the key to long-term success. Celebrate each step forward!",
    author: "FitAI Coach",
    theme: "progress"
  },
  {
    text: "Success is what comes after you stop making excuses and start making progress.",
    author: "Luis Galarza",
    theme: "mindset"
  },
  {
    text: "The only person you are destined to become is the person you decide to be. Choose health, choose strength.",
    author: "Ralph Waldo Emerson",
    theme: "choice"
  },
  {
    text: "Don't count the days, make the days count. Every workout brings you closer to your goals.",
    author: "Muhammad Ali",
    theme: "consistency"
  },
  {
    text: "Your health is an investment, not an expense. The dividends are priceless.",
    author: "FitAI Coach",
    theme: "health"
  },
  {
    text: "Energy and persistence conquer all things. Keep showing up, especially on the hard days.",
    author: "Benjamin Franklin",
    theme: "persistence"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow. Embrace the journey!",
    author: "FitAI Coach",
    theme: "growth"
  },
  {
    text: "Challenges are what make life interesting. Overcoming them is what makes life meaningful.",
    author: "Joshua J. Marine",
    theme: "challenges"
  },
  {
    text: "The best project you'll ever work on is you. Invest time in your health and fitness.",
    author: "FitAI Coach",
    theme: "self-improvement"
  }
];

// Personalized messages based on user activity
const PERSONALIZED_MESSAGES = [
  "You've been consistent with your workouts this week. Amazing job!",
  "Your nutrition tracking is on point. Keep making great choices!",
  "You're making incredible progress toward your goals!",
  "Your dedication is inspiring. Keep up the momentum!",
  "You've been crushing your step goals lately!",
  "Your workout consistency is building amazing habits.",
  "You're on track with your nutrition goals this week.",
  "Your dedication to recovery and rest days shows true discipline."
];

// Use a stable approach for initial quote selection
// We'll use the day of the year to determine which quote to show
const getInitialQuoteIndex = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % MOTIVATION_QUOTES.length;
};

// Use a stable approach for personalized message
const getInitialMessageIndex = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % PERSONALIZED_MESSAGES.length;
};

export default function MotivationCard() {
  const { user } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  const [randomIndex, setRandomIndex] = useState(getInitialQuoteIndex());
  const [personalizedMessage, setPersonalizedMessage] = useState(PERSONALIZED_MESSAGES[getInitialMessageIndex()]);
  const [timeOfDay, setTimeOfDay] = useState('afternoon'); // Default for SSR
  
  useEffect(() => {
    setIsClient(true);
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);
  
  // Function to get a new random quote - only available after hydration
  const refreshQuote = () => {
    if (!isClient) return;
    
    let newIndex;
    // Ensure we get a different quote each time
    do {
      newIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    } while (newIndex === randomIndex && MOTIVATION_QUOTES.length > 1);
    
    setRandomIndex(newIndex);
    
    // Also refresh the personalized message
    setPersonalizedMessage(
      PERSONALIZED_MESSAGES[Math.floor(Math.random() * PERSONALIZED_MESSAGES.length)]
    );
  };
  
  const quote = MOTIVATION_QUOTES[randomIndex];
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const firstName = user?.name?.split(' ')[0] || 'Champion';
    
    if (timeOfDay === 'morning') {
      return `Good morning, ${firstName}!`;
    } else if (timeOfDay === 'afternoon') {
      return `Good afternoon, ${firstName}!`;
    } else {
      return `Good evening, ${firstName}!`;
    }
  };
  
  // Choose appropriate icon
  const MotivationIcon = timeOfDay === 'morning' ? SparklesIcon : (timeOfDay === 'evening' ? TrophyIcon : FireIcon);
  
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-md text-white">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <MotivationIcon className="h-10 w-10 mr-4 flex-shrink-0 text-yellow-300" />
          <div>
            <h3 className="text-xl font-semibold mb-1">{getGreeting()}</h3>
            <p className="text-lg mb-2 font-medium">"{quote.text}"</p>
            <p className="text-sm text-indigo-100">— {quote.author}</p>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-300" />
              <span>{personalizedMessage}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={refreshQuote}
          className="p-2 rounded-full hover:bg-indigo-600 transition-colors"
          aria-label="Get new quote"
          title="Get new quote"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 
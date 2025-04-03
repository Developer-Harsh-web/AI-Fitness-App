"use client";

import React, { useState } from 'react';
import { CheckCircleIcon, FireIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// Array of motivational quotes
const MOTIVATION_QUOTES = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Unknown"
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips"
  },
  {
    text: "The hardest lift of all is lifting your butt off the couch.",
    author: "Unknown"
  },
  {
    text: "Success is what comes after you stop making excuses.",
    author: "Luis Galarza"
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  }
];

export default function MotivationCard() {
  // Use state to store the current quote index
  const [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * MOTIVATION_QUOTES.length)
  );
  
  // Function to get a new random quote
  const refreshQuote = () => {
    let newIndex;
    // Ensure we get a different quote each time
    do {
      newIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    } while (newIndex === randomIndex && MOTIVATION_QUOTES.length > 1);
    
    setRandomIndex(newIndex);
  };
  
  const quote = MOTIVATION_QUOTES[randomIndex];
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 shadow-md text-white">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <FireIcon className="h-10 w-10 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Daily Motivation</h3>
            <p className="text-lg mb-2">"{quote.text}"</p>
            <p className="text-sm text-blue-100">— {quote.author}</p>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>You're on track with your goals. Keep it up!</span>
            </div>
          </div>
        </div>
        <button 
          onClick={refreshQuote}
          className="p-2 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Get new quote"
          title="Get new quote"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 
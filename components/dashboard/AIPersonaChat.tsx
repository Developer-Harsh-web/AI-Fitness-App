"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Calendar, Dumbbell, History, Search, Loader, ExternalLink, CheckCircle, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { useAiPersona } from '../../lib/hooks/useAiPersona';
import { useUserContext } from '../../lib/hooks/UserContext';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  searchResults?: {
    title: string;
    snippet: string;
    source: string;
    url: string;
  }[];
  plan?: {
    id: string;
    type: 'workout' | 'diet' | 'recovery';
    title: string;
    description: string;
  } | null;
};

export default function AIPersonaChat() {
  const { currentPersona, searchInternet, generatePersonalizedPlan, userPlans } = useAiPersona();
  const { user } = useUserContext();
  
  // Format the welcome message to include coaching intensity information
  const getWelcomeMessage = () => {
    const name = user?.name || 'there';
    let intensityMsg = '';
    
    if (user?.preferences?.checkInFrequency) {
      switch (user.preferences.checkInFrequency) {
        case 'light':
          intensityMsg = "I'll check in with you once or twice daily to support your fitness journey.";
          break;
        case 'moderate':
          intensityMsg = "I'll check in with you 3-5 times per day to help you stay on track.";
          break;
        case 'intensive':
          intensityMsg = "I'll be checking in frequently (every 30-60 minutes) to maximize your accountability.";
          break;
        default:
          intensityMsg = "I'll check in regularly to support your fitness journey.";
      }
    }
    
    return `Hi ${name}! I'm ${currentPersona.name}, your AI fitness coach. ${intensityMsg} I can search the internet for the latest fitness information and create personalized plans based on your body metrics and goals. How can I help you today?`;
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle user sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Check if the message contains search-related keywords
    const searchKeywords = ['search', 'find information', 'look up', 'research', 'latest', 'studies', 'evidence'];
    const planKeywords = ['plan', 'program', 'routine', 'schedule', 'create', 'generate', 'personalized'];
    
    const needsSearch = searchKeywords.some(keyword => userMessage.content.toLowerCase().includes(keyword));
    const needsPlan = planKeywords.some(keyword => userMessage.content.toLowerCase().includes(keyword));
    
    if (needsSearch) {
      await handleSearchRequest(userMessage.content);
    } else if (needsPlan) {
      await handlePlanRequest(userMessage.content);
    } else {
      // For regular messages, simulate a delay then generate a response
      setTimeout(() => {
        generateAIResponse(userMessage.content);
        setIsLoading(false);
      }, 1500);
    }
  };
  
  // Handle search requests
  const handleSearchRequest = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Acknowledge that we're searching
      const searchingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'll search for information about "${query.replace(/search|find information about|look up|research/gi, '').trim()}". This might take a moment...`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, searchingMessage]);
      
      // Perform the search
      const results = await searchInternet(query);
      
      // Prepare response with search results
      let responseContent = 'Here\'s what I found from recent research:';
      
      // Create response with search results
      const responseMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        searchResults: results
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      // Handle errors
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an issue while searching for information. Please try again or ask me something else.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  
  // Handle plan generation requests
  const handlePlanRequest = async (request: string) => {
    setIsGeneratingPlan(true);
    
    try {
      // Determine the type of plan requested
      const lowerCaseRequest = request.toLowerCase();
      let planType: 'workout' | 'diet' | 'recovery' = 'workout'; // Default to workout
      
      if (lowerCaseRequest.includes('diet') || lowerCaseRequest.includes('meal') || lowerCaseRequest.includes('nutrition') || lowerCaseRequest.includes('food')) {
        planType = 'diet';
      } else if (lowerCaseRequest.includes('recover') || lowerCaseRequest.includes('rest') || lowerCaseRequest.includes('mobility')) {
        planType = 'recovery';
      }
      
      // Identify goals from the request
      const goals: string[] = [];
      if (lowerCaseRequest.includes('weight loss') || lowerCaseRequest.includes('lose weight')) {
        goals.push('weight loss');
      }
      if (lowerCaseRequest.includes('muscle') || lowerCaseRequest.includes('strength') || lowerCaseRequest.includes('bulk')) {
        goals.push('muscle building');
      }
      if (lowerCaseRequest.includes('endurance') || lowerCaseRequest.includes('stamina') || lowerCaseRequest.includes('cardio')) {
        goals.push('endurance');
      }
      if (lowerCaseRequest.includes('flexibility') || lowerCaseRequest.includes('mobility')) {
        goals.push('flexibility');
      }
      
      // If no specific goals were identified, use user's preferences
      if (goals.length === 0 && user?.preferences?.fitnessGoals) {
        goals.push(...user.preferences.fitnessGoals);
      }
      
      // Acknowledge that we're generating a plan
      const generatingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm creating a personalized ${planType} plan based on your body metrics, fitness level, and goals. This will take a moment...`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, generatingMessage]);
      
      // Generate the plan
      const plan = await generatePersonalizedPlan(planType, goals);
      
      // Prepare response with the plan
      const responseMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've created a personalized ${planType} plan for you based on your profile data. Here's a summary:`,
        timestamp: new Date(),
        plan: {
          id: plan.id,
          type: plan.type,
          title: plan.title,
          description: plan.description
        }
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      // Handle errors
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an issue while creating your plan. Please try again or ask me something else.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsGeneratingPlan(false);
    }
  };
  
  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Generate AI response based on user message
  const generateAIResponse = (userMessage: string) => {
    // Simple pattern matching for the demo
    let response = '';
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Get coaching style based on intensity preference
    const coachingIntensity = user?.preferences?.checkInFrequency || 'moderate';
    const getCoachingTone = (casual: string, moderate: string, intensive: string) => {
      switch (coachingIntensity) {
        case 'light': return casual;
        case 'moderate': return moderate;
        case 'intensive': return intensive;
        default: return moderate;
      }
    };
    
    if (lowerCaseMessage.includes('workout') || lowerCaseMessage.includes('exercise')) {
      response = getCoachingTone(
        `Based on your fitness level, here are some workout suggestions you might enjoy. Let me know if you'd like more details.`,
        `Based on your fitness level and goals, I recommend focusing on ${user?.preferences.fitnessLevel === 'beginner' ? 'bodyweight exercises' : 'compound movements'} today. Would you like me to suggest a specific workout plan?`,
        `It's time to push your limits! I've analyzed your fitness level and goals, and you should be doing ${user?.preferences.fitnessLevel === 'beginner' ? 'a structured bodyweight routine' : 'intense compound movements'} RIGHT NOW. Let's get specific about your plan for today and set some targets!`
      );
    } else if (lowerCaseMessage.includes('diet') || lowerCaseMessage.includes('nutrition') || lowerCaseMessage.includes('food')) {
      response = getCoachingTone(
        `Nutrition is important for your goals. How has your eating been lately?`,
        `Your nutrition is crucial for your fitness goals. I see you're following a ${user?.preferences.dietaryPreferences?.join(', ') || 'balanced'} approach. How is that working for you so far?`,
        `Your nutrition MUST be optimized to reach your goals! I need to know exactly what you've eaten today so we can adjust your ${user?.preferences.dietaryPreferences?.join(', ') || 'diet'} plan immediately!`
      );
    } else if (lowerCaseMessage.includes('track') || lowerCaseMessage.includes('device') || lowerCaseMessage.includes('app')) {
      const connectedDevices = user?.preferences.trackingDevices || [];
      const connectedApps = user?.preferences.trackingApps || [];
      
      if (connectedDevices.length > 0 || connectedApps.length > 0) {
        response = getCoachingTone(
          `You've connected ${[...connectedDevices, ...connectedApps].join(', ')}. This data will help us understand your progress.`,
          `Great! You're currently tracking data with ${[...connectedDevices, ...connectedApps].join(', ')}. I'll use this data to provide personalized recommendations.`,
          `Excellent! I'm actively monitoring your ${[...connectedDevices, ...connectedApps].join(', ')} data and will alert you immediately when I detect any changes or opportunities to improve!`
        );
      } else {
        response = getCoachingTone(
          `Connecting a fitness device might help track your progress better.`,
          `I recommend connecting a fitness tracker or app to better monitor your progress. You can do this from the dashboard.`,
          `You NEED to connect a fitness tracker ASAP! Without proper tracking, we're flying blind on your fitness journey. Let's set this up immediately from the dashboard!`
        );
      }
    } else if (lowerCaseMessage.includes('goal')) {
      const goals = user?.preferences.fitnessGoals || [];
      response = getCoachingTone(
        `Your goals are ${goals.join(', ')}. Let's work on them step by step.`,
        `Your current goals are ${goals.join(', ')}. Let's work together to achieve them!`,
        `I'm laser-focused on helping you achieve ${goals.join(', ')}! Every minute counts toward these goals. What specific actions are you taking TODAY?`
      );
    } else if (lowerCaseMessage.includes('tired') || lowerCaseMessage.includes('exhausted') || lowerCaseMessage.includes('rest')) {
      response = getCoachingTone(
        `Rest is important. Listen to your body and take the time you need to recover.`,
        `Recovery is a crucial part of any fitness journey. Make sure you're getting enough sleep and proper nutrition to support your body's recovery process.`,
        `I understand you're feeling tired, but champions push through! That said, strategic recovery is essential - get 8 hours of sleep tonight, hydrate properly, and be ready for tomorrow's session without fail!`
      );
    } else if (lowerCaseMessage.includes('motivation') || lowerCaseMessage.includes('unmotivated') || lowerCaseMessage.includes('give up')) {
      response = getCoachingTone(
        `It's normal to have ups and downs. Remember why you started this journey.`,
        `Everyone struggles with motivation sometimes. Think about how far you've come and the goals you're working toward. What's one small step you can take today?`,
        `Motivation is a MYTH! Success comes from discipline and consistency even when you don't feel like it. Get up RIGHT NOW and do at least 5 minutes of activity - I'll be checking in on you later!`
      );
    } else {
      response = getCoachingTone(
        `Thanks for your message! I'm here to help with your fitness journey. Would you like me to search for some information or create a personalized plan for you?`,
        `Thanks for your message! As your fitness coach, I can help with workouts, nutrition tracking, and creating personalized plans. I can also search for the latest research. What specific area would you like assistance with?`,
        `I'm your dedicated fitness coach, available 24/7 to keep you accountable! I can search for research-backed information or create a personalized plan based on your body metrics. What SPECIFICALLY do you need help with right now?`
      );
    }
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };
  
  // Provide quick suggestion buttons
  const quickSuggestions = [
    { text: "Today's workout", icon: <Dumbbell className="h-3 w-3 mr-1" /> },
    { text: "Track progress", icon: <History className="h-3 w-3 mr-1" /> },
    { text: "Create a meal plan", icon: <Calendar className="h-3 w-3 mr-1" /> },
    { text: "Search for weight loss studies", icon: <Search className="h-3 w-3 mr-1" /> }
  ];
  
  return (
    <div className="flex flex-col h-[450px] bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  currentPersona.emoji
                )}
              </div>
              
              <div className={`px-4 py-2 rounded-lg mx-2 ${
                message.role === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {message.role === 'assistant' && (
                  <div className="font-medium text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                    {currentPersona.name}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Display search results if available */}
                {message.searchResults && message.searchResults.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Research sources:</p>
                    <div className="space-y-2">
                      {message.searchResults.map((result, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-xs">
                          <p className="font-medium text-blue-600 dark:text-blue-400">{result.title}</p>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{result.snippet}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-gray-500">{result.source}</span>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                              Source <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Display plan information if available */}
                {message.plan && (
                  <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 rounded border border-blue-200 dark:border-blue-800 text-xs">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <p className="font-medium text-blue-700 dark:text-blue-300">{message.plan.title}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{message.plan.description}</p>
                      <div className="mt-2">
                        <Link 
                          href={`/plans/${message.plan.id}`}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View full plan
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicators */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                {currentPersona.emoji}
              </div>
              <div className="px-4 py-2 rounded-lg mx-2 bg-gray-100 dark:bg-gray-700">
                <div className="flex space-x-1 items-center">
                  {isSearching && <Search className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />}
                  {isGeneratingPlan && <FileText className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />}
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick suggestion buttons */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
            className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
            onClick={() => setInput(suggestion.text)}
          >
            {suggestion.icon}
            {suggestion.text}
          </button>
        ))}
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about fitness, nutrition, or wellness..."
            className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-24"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="ml-2 h-8 w-8 p-0 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Responses are based on your profile data and the latest fitness research
        </div>
      </div>
    </div>
  );
} 
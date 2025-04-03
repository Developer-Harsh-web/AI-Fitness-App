"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Clock, Bot, User as UserIcon, ArrowUp, RotateCcw, ArrowDown } from 'lucide-react';
import Button from '../ui/Button';
import { useUserContext, User } from '../../lib/hooks/UserContext';
import { format } from 'date-fns';

// Types for chat messages
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'reminder' | 'suggestion';
}

// Type for quick suggestions
interface QuickSuggestion {
  id: string;
  text: string;
}

export default function AiChat() {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m your AI fitness companion. How can I help you today?',
      timestamp: new Date(),
      type: 'text',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserContext();
  
  // Quick suggestions based on context
  const [suggestions, setSuggestions] = useState<QuickSuggestion[]>([
    { id: '1', text: 'How many calories can I eat today?' },
    { id: '2', text: 'What workout should I do today?' },
    { id: '3', text: 'How much progress have I made this week?' },
    { id: '4', text: 'Help me plan my meals for tomorrow.' },
  ]);
  
  // Add a state to track if auto-scrolling should happen
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  // Inside the component, add a state to track if we're showing the scroll button
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Add a state to track if check-ins are enabled
  const [checkInsEnabled, setCheckInsEnabled] = useState(false);
  
  // Enable check-ins after 2 minutes to avoid disruption during initial use
  useEffect(() => {
    const enableCheckInsTimer = setTimeout(() => {
      setCheckInsEnabled(true);
    }, 120000); // 2 minutes
    
    return () => clearTimeout(enableCheckInsTimer);
  }, []);
  
  // Improved scroll behavior
  useEffect(() => {
    // Only scroll when messages change and auto-scroll is enabled
    if (messagesEndRef.current && messages.length > 0 && shouldAutoScroll) {
      const lastMessage = messages[messages.length - 1];
      const isNewMessage = lastMessage.timestamp > new Date(Date.now() - 2000);
      
      // Only auto-scroll for new messages added in the last 2 seconds
      if (isNewMessage) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, shouldAutoScroll]);
  
  // Modify the scroll event listener to also update the scroll button visibility
  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    
    if (!chatContainer) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout to debounce the scroll event
      scrollTimeout = setTimeout(() => {
        const { scrollHeight, scrollTop, clientHeight } = chatContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        // Only auto-scroll when explicitly requested by user action
        // Don't change shouldAutoScroll here - let it be controlled only by explicit actions
        
        // Show scroll button when not at bottom
        setShowScrollButton(!isNearBottom);
      }, 100);
    };
    
    // Add scroll event listener
    chatContainer.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  
  // Simulate AI response
  const getAIResponse = async (userMessage: string, user: User | null): Promise<string> => {
    // In a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword-based response for demo purposes
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Use user data for personalized responses
    const name = user?.name || 'there';
    
    if (lowercaseMessage.includes('workout') || lowercaseMessage.includes('exercise')) {
      return `Based on your fitness goals and level, I'd recommend a ${user?.preferences.fitnessLevel || 'moderate'} intensity workout focusing on ${user?.preferences.fitnessGoals?.join(' and ') || 'strength and cardio'}. Would you like me to create a personalized plan?`;
    } else if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('nutrition') || lowercaseMessage.includes('eat')) {
      return `Hi ${name}! For your current goals, I recommend focusing on ${user?.preferences.dietaryPreferences?.join(', ') || 'balanced nutrition'} with plenty of protein and vegetables. Your daily calorie target should be around ${Math.round((user?.stats.weight || 70) * 30)} calories.`;
    } else if (lowercaseMessage.includes('progress') || lowercaseMessage.includes('weight') || lowercaseMessage.includes('goal')) {
      return `You're making great progress, ${name}! Your current weight is ${user?.stats.weight || '--'}kg, and you're on track to reach your goal. Keep up the good work!`;
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi ')) {
      return `Hello ${name}! How can I help you with your fitness journey today?`;
    } else {
      return `I'm here to help with your fitness journey. You can ask me about workouts, nutrition plans, progress tracking, or tips for reaching your fitness goals.`;
    }
  };
  
  const handleSendMessage = async () => {
    if (isLoading || !inputMessage.trim()) return;
    
    // Enable auto-scroll when user sends a message
    setShouldAutoScroll(true);
    
    // Clear input field immediately for better UX
    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prevMessages => [...prevMessages, userMessageObj]);
    
    // Set loading state and get AI response
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const aiResponse = await getAIResponse(userMessage, user);
      
      // Add AI message after receiving response
      const aiMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessageObj]);
      
      // Update suggestions based on the new message
      updateSuggestions(userMessage, aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSuggestions = (userMessage: string, aiResponse: string) => {
    // Generate contextual suggestions based on conversation
    const lowerUserMsg = userMessage.toLowerCase();
    const lowerAiResp = aiResponse.toLowerCase();
    
    let newSuggestions: QuickSuggestion[] = [];
    
    if (lowerUserMsg.includes('workout') || lowerUserMsg.includes('exercise')) {
      newSuggestions = [
        { id: '1', text: 'Show me the workout details' },
        { id: '2', text: 'Is this good for weight loss?' },
        { id: '3', text: 'How many calories will this burn?' },
        { id: '4', text: 'I want something easier' },
      ];
    } else if (lowerUserMsg.includes('calorie') || lowerUserMsg.includes('eat')) {
      newSuggestions = [
        { id: '1', text: 'Suggest a healthy snack' },
        { id: '2', text: 'How can I reduce my appetite?' },
        { id: '3', text: 'Show my calorie breakdown' },
        { id: '4', text: 'Log my lunch' },
      ];
    } else if (lowerAiResp.includes('recipe') || lowerUserMsg.includes('meal')) {
      newSuggestions = [
        { id: '1', text: 'Show me the breakfast recipe' },
        { id: '2', text: 'Show me the lunch recipe' },
        { id: '3', text: 'Show me the dinner recipe' },
        { id: '4', text: 'Suggest alternatives' },
      ];
    } else {
      // Default suggestions
      newSuggestions = [
        { id: '1', text: 'What\'s my progress this week?' },
        { id: '2', text: 'When should I work out today?' },
        { id: '3', text: 'How\'s my sleep quality?' },
        { id: '4', text: 'Help me stay motivated' },
      ];
    }
    
    setSuggestions(newSuggestions);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShouldAutoScroll(true);
  };
  
  const handleVoiceInput = () => {
    if (!isListening) {
      // In a real app, this would use the Web Speech API
      setIsListening(true);
      setShouldAutoScroll(true);
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('I want to improve my running performance');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };
  
  const handleAddReminder = () => {
    setShouldAutoScroll(true);
    
    // Simulate adding a reminder
    const reminderMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: 'Reminder set: "Drink water" - I\'ll remind you every 2 hours',
      timestamp: new Date(),
      type: 'reminder',
    };
    
    setMessages(prev => [...prev, reminderMessage]);
  };
  
  // Add a manual scroll function for the reset button
  const resetChat = () => {
    setShouldAutoScroll(true);
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m your AI fitness companion. How can I help you today?',
      timestamp: new Date(),
      type: 'text',
    }]);
  };
  
  // Modify the scheduled check-in function to respect the enabled state
  useEffect(() => {
    if (!user || !checkInsEnabled) return;
    
    const checkInIntervals = {
      'low': 8 * 60 * 60 * 1000, // 8 hours in ms
      'medium': 3 * 60 * 60 * 1000, // 3 hours in ms
      'high': 15 * 60 * 1000, // 15 minutes in ms
    };
    
    const interval = checkInIntervals[user.preferences.checkInFrequency || 'medium'];
    
    // For demo purposes, we'll use a shorter interval
    const demoInterval = interval / 60; // Much faster for demo
    
    const checkInTimer = setTimeout(() => {
      // NEVER auto-scroll for automatic check-ins
      setShouldAutoScroll(false);
      
      const suggestions = [
        'Have you had enough water today?',
        'Time to stand up and stretch!',
        'Ready for a quick activity break?',
        'How are you feeling right now?',
        'Let\'s check your step count - on track for today?',
      ];
      
      // Add system check-in message
      const checkInMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: suggestions[Math.floor(Math.random() * suggestions.length)],
        timestamp: new Date(),
        type: 'suggestion',
      };
      
      setMessages(prev => [...prev, checkInMessage]);
    }, demoInterval);
    
    return () => clearTimeout(checkInTimer);
  }, [user, messages.length, checkInsEnabled]);
  
  // Add a function to scroll to bottom
  const scrollToBottom = () => {
    setShouldAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Input handling with focus management
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    // Don't auto-scroll when typing
    setShouldAutoScroll(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col h-[500px]">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-white mr-3" />
            <h3 className="text-xl font-semibold text-white">FitCoach AI</h3>
          </div>
          <button 
            onClick={resetChat}
            className="text-blue-100 hover:text-white p-1.5 hover:bg-blue-500/20 rounded-full transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50 dark:bg-gray-900/50 relative">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {message.role === 'assistant' && message.type !== 'suggestion' && (
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            {message.role === 'user' && (
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center order-last ml-3 shadow-sm">
                <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            
            <div 
              className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : message.role === 'system' || message.type === 'suggestion'
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/20 text-gray-800 dark:text-gray-200 border border-yellow-200 dark:border-yellow-800/30' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700'
              } ${message.type === 'reminder' ? 'border-l-4 border-yellow-500' : ''}`}
            >
              {message.role === 'assistant' && message.type === 'suggestion' && (
                <div className="flex items-center text-amber-600 dark:text-amber-400 mb-1.5 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Check-in</span>
                </div>
              )}
              
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              <div className="text-xs mt-2 opacity-70 font-light">
                {format(message.timestamp, 'h:mm a')}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="max-w-[75%] rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map(suggestion => (
            <button
              key={suggestion.id}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full text-xs text-blue-800 dark:text-blue-300 font-medium transition-all border border-blue-200 dark:border-blue-800/30"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded-full p-2.5 ${
              isListening 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/30' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
            } hover:shadow-md transition-all`}
            onClick={handleVoiceInput}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Ask about workouts, nutrition, goals..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="rounded-full"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </Button>
          
          <button
            type="button"
            className="rounded-full p-2.5 bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            onClick={handleAddReminder}
          >
            <Clock className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 
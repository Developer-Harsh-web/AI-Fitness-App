"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Clock, Bot, User as UserIcon, ArrowUp, RotateCcw, ArrowDown, MessageSquare } from 'lucide-react';
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

// AI personalities for more engaging conversations
const aiPersonalities = [
  {
    name: "Coach Alex",
    greeting: "Hey there! Coach Alex here. Ready to crush some goals today? 💪",
    style: "enthusiastic",
    emoji: "💪"
  },
  {
    name: "Nutritionist Maya",
    greeting: "Hi! I'm Maya, your nutrition expert. How's your meal planning going? 🥗",
    style: "supportive",
    emoji: "🥗"
  },
  {
    name: "Trainer Sam",
    greeting: "Welcome back! Sam here to help you with your fitness journey. What's on the agenda today? 🏋️",
    style: "motivational",
    emoji: "🏋️"
  }
];

export default function AiChat() {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiPersonality, setAiPersonality] = useState(aiPersonalities[Math.floor(Math.random() * aiPersonalities.length)]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: aiPersonality.greeting,
      timestamp: new Date(),
      type: 'text',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserContext();
  
  // Quick suggestions based on context
  const [suggestions, setSuggestions] = useState<QuickSuggestion[]>([
    { id: '1', text: 'How many calories should I eat today?' },
    { id: '2', text: 'What workout would you recommend for me?' },
    { id: '3', text: 'How\'s my progress this week?' },
    { id: '4', text: 'Can you create a meal plan for tomorrow?' },
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
  
  // Add check-in messages after periods of inactivity
  useEffect(() => {
    if (!checkInsEnabled || messages.length === 0) return;
    
    // Set a timer to check in if user hasn't sent a message in a while
    const checkInTimer = setTimeout(() => {
      const lastMessage = messages[messages.length - 1];
      const now = new Date();
      const timeSinceLastMessage = now.getTime() - lastMessage.timestamp.getTime();
      
      // If it's been more than 3 minutes since the last message and the last message wasn't from the assistant
      if (timeSinceLastMessage > 3 * 60 * 1000 && lastMessage.role !== 'assistant') {
        // Add a check-in message
        const checkInMessages = [
          `${aiPersonality.name} here. Need any help with your fitness goals? ${aiPersonality.emoji}`,
          `Hey there! Just checking in. How's your day going? Anything I can help with? ${aiPersonality.emoji}`,
          `Still thinking about your fitness journey? I'm here when you need me! ${aiPersonality.emoji}`,
          `Don't forget to stay hydrated today! Need any workout tips? ${aiPersonality.emoji}`
        ];
        
        const randomCheckIn = checkInMessages[Math.floor(Math.random() * checkInMessages.length)];
        
        const checkInMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: randomCheckIn,
          timestamp: new Date(),
          type: 'text',
        };
        
        setMessages(prevMessages => [...prevMessages, checkInMessage]);
      }
    }, 3 * 60 * 1000); // 3 minutes
    
    return () => clearTimeout(checkInTimer);
  }, [messages, checkInsEnabled, aiPersonality]);
  
  // Simulate AI response with personality
  const getAIResponse = async (userMessage: string, user: User | null): Promise<string> => {
    // In a real app, this would call an AI service
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    setIsTyping(false);
    
    // Simple keyword-based response for demo purposes
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Use user data for personalized responses
    const name = user?.name?.split(' ')[0] || 'there';
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    // Add personality and conversational elements
    const fillers = [
      `Great question, ${name}! `,
      `I'm glad you asked, ${name}. `,
      `Let me help with that, ${name}. `,
      `Good ${timeOfDay}, ${name}! `,
      `${aiPersonality.emoji} Absolutely! `
    ];
    
    const randomFiller = fillers[Math.floor(Math.random() * fillers.length)];
    
    if (lowercaseMessage.includes('workout') || lowercaseMessage.includes('exercise')) {
      const workoutTypes = ['HIIT', 'strength training', 'yoga', 'circuit training', 'cardio'];
      const randomWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      return `${randomFiller}Based on your ${user?.preferences.fitnessLevel || 'fitness'} level and goals to focus on ${user?.preferences.fitnessGoals?.join(' and ') || 'overall fitness'}, I'd recommend a ${randomWorkout} session today. Would you like me to create a customized plan for you? I can tailor it exactly to your preferences! ${aiPersonality.emoji}`;
    } else if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('nutrition') || lowercaseMessage.includes('eat')) {
      const calorieTarget = Math.round((user?.stats.weight || 70) * 30);
      const proteinTarget = Math.round((user?.stats.weight || 70) * 1.8);
      return `${randomFiller}For your current goals and activity level, I'd suggest focusing on ${user?.preferences.dietaryPreferences?.join(', ') || 'balanced nutrition'} with about ${calorieTarget} calories daily. Try to get at least ${proteinTarget}g of protein to support your muscle recovery and growth. Want me to suggest some meal ideas that match your preferences? ${aiPersonality.emoji}`;
    } else if (lowercaseMessage.includes('progress') || lowercaseMessage.includes('weight') || lowercaseMessage.includes('goal')) {
      const progress = Math.round(Math.random() * 10) / 10;
      return `${randomFiller}You're crushing it! ${aiPersonality.emoji} Your current weight is ${user?.stats.weight || '--'}kg, which is ${progress}kg ${Math.random() > 0.5 ? 'down' : 'up'} from last week. Keep up the great work! I notice your consistency has been excellent - that's the real key to long-term success.`;
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi ')) {
      return `Hey ${name}! ${aiPersonality.emoji} Great to see you again! How's your ${timeOfDay} going? I'm here to help with anything fitness or nutrition related.`;
    } else if (lowercaseMessage.includes('thank')) {
      return `You're very welcome, ${name}! That's what I'm here for. ${aiPersonality.emoji} Is there anything else I can help you with today?`;
    } else if (lowercaseMessage.includes('tired') || lowercaseMessage.includes('sore')) {
      return `I understand, ${name}. Rest days are just as important as workout days! ${aiPersonality.emoji} How about some gentle stretching or a short walk to help with recovery? Remember to stay hydrated and get enough sleep tonight.`;
    } else {
      return `${randomFiller}I'm here to support your fitness journey every step of the way. You can ask me about workouts, nutrition plans, recovery tips, or anything else to help you reach your goals. What's on your mind today? ${aiPersonality.emoji}`;
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
      // Add typing indicator after a short delay for realism
      setTimeout(() => setIsTyping(true), 300);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const aiResponse = await getAIResponse(userMessage, user);
      
      // Remove typing indicator
      setIsTyping(false);
      
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
      setIsTyping(false);
      
      // Add error message
      const errorMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request right now. Can you try again in a moment? My circuits might need a short break! 😅",
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
        { id: '1', text: 'Show me the detailed workout plan' },
        { id: '2', text: 'Is this good for my weight loss goal?' },
        { id: '3', text: 'How many calories will this burn?' },
        { id: '4', text: 'I need something less intense today' },
      ];
    } else if (lowerUserMsg.includes('calorie') || lowerUserMsg.includes('eat')) {
      newSuggestions = [
        { id: '1', text: 'Can you suggest a healthy snack?' },
        { id: '2', text: 'How can I reduce cravings?' },
        { id: '3', text: 'What\'s my nutrient breakdown?' },
        { id: '4', text: 'Help me log my lunch' },
      ];
    } else if (lowerAiResp.includes('recipe') || lowerUserMsg.includes('meal')) {
      newSuggestions = [
        { id: '1', text: 'Show me a high-protein breakfast' },
        { id: '2', text: 'I need a quick lunch idea' },
        { id: '3', text: 'What\'s a healthy dinner option?' },
        { id: '4', text: 'I\'m vegetarian, any alternatives?' },
      ];
    } else if (lowerUserMsg.includes('thank')) {
      newSuggestions = [
        { id: '1', text: 'I have another question' },
        { id: '2', text: 'Help me with today\'s workout' },
        { id: '3', text: 'What should I eat after workout?' },
        { id: '4', text: 'How\'s my progress looking?' },
      ];
    } else {
      // Default suggestions
      newSuggestions = [
        { id: '1', text: 'How\'s my progress this week?' },
        { id: '2', text: 'What workout should I do today?' },
        { id: '3', text: 'Can you check my sleep quality?' },
        { id: '4', text: 'I need some motivation' },
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
      
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        const simulatedVoiceInput = suggestions[Math.floor(Math.random() * suggestions.length)].text;
        setInputMessage(simulatedVoiceInput);
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };
  
  const handleAddReminder = () => {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 1);
    
    const reminderMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: `Reminder set for ${format(reminderTime, 'h:mm a')}: Drink water and stretch.`,
      timestamp: new Date(),
      type: 'reminder',
    };
    
    setMessages(prevMessages => [...prevMessages, reminderMessage]);
    
    // Also add assistant confirmation
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Great! I've set a reminder for you at ${format(reminderTime, 'h:mm a')} to drink water and stretch. I'll send you a notification then. Staying hydrated is so important for your fitness goals! ${aiPersonality.emoji}`,
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    setShouldAutoScroll(true);
  };
  
  const resetChat = () => {
    // Pick a new random AI personality
    const newPersonality = aiPersonalities[Math.floor(Math.random() * aiPersonalities.length)];
    setAiPersonality(newPersonality);
    
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: newPersonality.greeting,
        timestamp: new Date(),
        type: 'text',
      }
    ]);
    
    // Reset suggestions to default
    setSuggestions([
      { id: '1', text: 'How many calories should I eat today?' },
      { id: '2', text: 'What workout would you recommend for me?' },
      { id: '3', text: 'How\'s my progress this week?' },
      { id: '4', text: 'Can you create a meal plan for tomorrow?' },
    ]);
    
    setShouldAutoScroll(true);
  };
  
  const scrollToBottom = () => {
    setShouldAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 items-center justify-center">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              {aiPersonality.name} 
              <span className="ml-1.5 text-lg">{aiPersonality.emoji}</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your AI fitness companion</p>
          </div>
          </div>
          <button 
            onClick={resetChat}
          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          title="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
      </div>
      
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } ${message.role === 'system' ? 'justify-center' : ''}`}
          >
            {message.role === 'system' ? (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full px-3 py-1.5 flex items-center">
                <Clock className="h-3 w-3 mr-1.5" />
                {message.content}
              </div>
            ) : (
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}
                  <div>
                    <div className="text-sm">{message.content}</div>
            <div 
                      className={`text-[10px] mt-1 ${
                message.role === 'user' 
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {format(message.timestamp, 'h:mm a')}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <UserIcon className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-36 right-8 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-10"
          >
            <ArrowDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick suggestions */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 overflow-x-auto">
        <div className="flex gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="whitespace-nowrap px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {suggestion.text}
            </button>
          ))}
        </div>
        </div>
        
      {/* Chat input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2">
          <button
          onClick={handleVoiceInput}
          className={`p-2 rounded-full ${
              isListening 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        <button
          onClick={handleAddReminder}
          className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Clock className="h-5 w-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${aiPersonality.name}...`}
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
        <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          className={`p-2 rounded-full ${
            !inputMessage.trim()
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          }`}
        >
          <Send className="h-5 w-5" />
          </button>
      </div>
    </div>
  );
} 
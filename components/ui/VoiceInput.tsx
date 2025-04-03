"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import Button from './Button';

interface VoiceInputProps {
  onInputCapture: (text: string) => void;
  placeholder?: string;
  className?: string;
  autoStart?: boolean;
}

export default function VoiceInput({
  onInputCapture,
  placeholder = 'Speak to track your activity...',
  className = '',
  autoStart = false,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  
  // Use a ref to track recording state to avoid stale closures in event handlers
  const isRecordingRef = useRef(false);
  
  // Keep the ref in sync with the state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Initialize speech recognition once on mount
  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window === 'undefined') return;

    // Check if speech recognition is available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        // Use the ref instead of state to avoid stale closures
        recognitionInstance.onresult = (event: any) => {
          // Check the current value of the ref
          if (!isRecordingRef.current) return;
          
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcription = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcription;
            } else {
              interimTranscript += transcription;
            }
          }
          
          // Update the transcript
          const newTranscript = finalTranscript || interimTranscript;
          if (newTranscript) {
            setTranscript(newTranscript);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsRecording(false);
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current = recognitionInstance;
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSupported(false);
      }
    } else {
      // Speech recognition is not supported
      setIsSupported(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          // Try to stop recognition if it's running
          if (isRecording) {
            recognitionRef.current.stop();
          }
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
    };
  }, []); // Empty dependency array so it only runs once on mount

  // Separate effect for handling isRecording changes
  useEffect(() => {
    // Skip if speech recognition isn't supported or available
    if (!recognitionRef.current || !isSupported) return;
    
    if (isRecording) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // If recognition is already started, this might throw an error
        console.error('Error starting speech recognition:', error);
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // If recognition is already stopped, this might throw an error
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, [isRecording, isSupported]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    setTranscript('');
    setIsRecording(true);
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    setIsRecording(false);
    
    // Callback with the transcript
    if (transcript.trim()) {
      onInputCapture(transcript.trim());
    }
  }, [transcript, onInputCapture, isSupported]);

  // Handle auto-start separately
  useEffect(() => {
    if (autoStart && recognitionRef.current && !isRecording && isSupported) {
      const timer = setTimeout(() => {
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isRecording, startRecording, isSupported]);

  if (!isSupported) {
    return (
      <div className={`p-4 rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <p className="text-gray-700 dark:text-gray-300">
          Speech recognition is not supported in your browser. Try using Chrome, Edge, or Safari.
        </p>
        <input
          type="text"
          placeholder="Type your activity instead..."
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              onInputCapture(target.value);
              target.value = '';
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${isRecording ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center">
          <div className="flex-grow">
            {isRecording ? (
              <p className="text-gray-700 dark:text-gray-300">
                {transcript || "I'm listening..."}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{placeholder}</p>
            )}
          </div>
          <div className="ml-3">
            {isRecording ? (
              <Button
                variant="danger"
                size="sm"
                onClick={stopRecording}
                className="rounded-full p-2"
              >
                <StopIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={startRecording}
                className="rounded-full p-2"
              >
                <MicrophoneIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {isRecording && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 mr-2"></span>
          Recording... Speak clearly
        </div>
      )}
    </div>
  );
} 